import http from 'node:http';
import { readFileSync } from 'node:fs';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { getMigrations } from 'better-auth/db/migration';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import httpProxy from 'http-proxy';
import { accountForEmail, accountForRecipient, cleanPath, blockedPath } from './policy.mjs';
import { loginScript } from './login.mjs';

const origin = 'https://app.execution.associates';
const accounts = JSON.parse(process.env.ACCOUNTS_JSON || '[]');
if (!accounts.length || !process.env.BETTER_AUTH_SECRET || !process.env.CF_MAIL_TOKEN) throw new Error('Missing private app configuration');
const authDb = new Database('/data/auth.sqlite');
authDb.pragma('journal_mode = WAL');
authDb.pragma('busy_timeout = 5000');

async function sendMail(message) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/email/sending/send`, {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.CF_MAIL_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(message), signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (!response.ok || result.success === false) {
    // Never log message bodies or magic links.
    console.error('Mail delivery failed', response.status, result.errors?.map(e => ({ code:e.code, message:e.message })));
    throw new Error('Email delivery unavailable');
  }
}
const auth = betterAuth({
  appName: 'Execution Associates', baseURL: origin, basePath: '/api/login',
  secret: process.env.BETTER_AUTH_SECRET, database: authDb,
  trustedOrigins: [origin], emailAndPassword: { enabled: false },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 12 },
  advanced: { useSecureCookies: true, cookiePrefix: 'execution', ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
  rateLimit: { enabled: true, window: 60, max: 30, storage: 'database', customRules: { '/sign-in/magic-link': { window: 60, max: 3 } } },
  plugins: [magicLink({
    disableSignUp: true, expiresIn: 600, storeToken: 'hashed',
    async sendMagicLink({ email, url }) {
      if (!accountForEmail(accounts, email)) return;
      await sendMail({ from: {address:'login@execution.associates',name:'Execution Associates'}, to: [email], subject: 'Sign in to Execution Associates', text: `Use this link to sign in to your private inbox:\n\n${url}\n\nThis link expires in 10 minutes and can only be used once. If you did not request it, ignore this email.` });
    },
  })],
});
await (await getMigrations(auth.options)).runMigrations();
const context = await auth.$context;
for (const account of accounts) {
  if (!await context.internalAdapter.findUserByEmail(account.login)) {
    await context.internalAdapter.createUser({ name: account.name, email: account.login, emailVerified: true });
  }
  const db = new Database('/mail/shared/mailflare.sqlite', { fileMustExist: true });
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = ON');
  // Shared instance: each approved identity owns a separate mailbox.
  db.transaction(() => {
    if (!db.prepare('SELECT id FROM users WHERE email = ?').get(account.mailbox)) {
      const now = Math.floor(Date.now() / 1000);
      db.prepare('INSERT INTO users(id,email,reset_email,password_hash,name,role,created_at) VALUES (?,?,?,?,?,?,?)').run(account.key, account.mailbox, account.login, '!password-login-disabled!', account.name, account.key === accounts[0].key ? 'admin' : 'user', now);
      if (account.key !== accounts[0].key) db.prepare('UPDATE users SET created_by_user_id = ? WHERE id = ?').run(accounts[0].key, account.key);
      db.prepare('INSERT OR IGNORE INTO domains(id,user_id,hostname,zone_id,status,routing_enabled,sending_enabled,sending_requested,routing_status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)').run('execution', account.key, 'execution.associates', 'manual', 'active', 1, 1, 1, 'manual', now);
      db.prepare('INSERT INTO mailboxes(id,user_id,domain_id,local_part,display_name,created_at) VALUES (?,?,?,?,?,?)').run(account.key, account.key, 'execution', account.mailbox.split('@')[0], account.name, now);
      for (const alias of account.aliases || []) db.prepare('INSERT INTO mailbox_aliases(id,mailbox_id,domain_id,local_part,created_at) VALUES (?,?,?,?,?)').run(randomUUID(), account.key, 'execution', alias.split('@')[0], now);
    }
  })();
  account.db = db;
}

const loginHtml = readFileSync(new URL('./login.html', import.meta.url));
const brandImage = readFileSync(new URL('./brand.png', import.meta.url));
const nodeAuth = toNodeHandler(auth);
const proxy = httpProxy.createProxyServer({ ws: true, xfwd: false, proxyTimeout: 60000 });
proxy.on('error', (_error, _req, res) => { if (res.writeHead && !res.headersSent) res.writeHead(502); res.end?.('Inbox temporarily unavailable'); });
proxy.on('proxyRes', response => {
  // Mailflare's internal session must never reach the browser.
  delete response.headers['set-cookie'];
  response.headers['cache-control'] = 'private, no-store';
  response.headers['x-robots-tag'] = 'noindex, nofollow, noarchive';
});
function bridge(account, req) {
  const now = Math.floor(Date.now() / 1000);
  if (!account.bridge || account.bridge.expires < now + 60) {
    const token = randomBytes(32).toString('hex');
    account.db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now);
    const owner = account.db.prepare('SELECT id FROM users WHERE email = ? AND disabled = 0').get(account.mailbox);
    if (!owner) throw new Error('Inbox account unavailable');
    account.db.prepare('INSERT INTO sessions(id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)').run(randomUUID(), owner.id, createHash('sha256').update(token).digest('hex'), now + 3600, now);
    account.bridge = { token, expires: now + 3600 };
  }
  req.headers.cookie = `ep_session=${account.bridge.token}`;
  req.headers.authorization = `Bearer ${account.bridge.token}`;
  req.headers.host = 'app.execution.associates';
  req.headers['x-forwarded-host'] = 'app.execution.associates';
  req.headers['x-forwarded-proto'] = 'https';
  delete req.headers['x-middleware-subrequest'];
}
async function authorized(req) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  return session?.user ? accountForEmail(accounts, session.user.email) : undefined;
}
function reply(res, status, text, type = 'text/plain; charset=utf-8') { res.writeHead(status, { 'Content-Type': type }); res.end(text); }
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const path = cleanPath(req.url || '/');
    if (!path) return reply(res, 400, 'Invalid request');
    if (path === '/healthz') return reply(res, 200, 'ok');
    if (req.headers.host !== 'app.execution.associates') return reply(res, 421, 'Invalid host');
    if (path === '/robots.txt') return reply(res, 200, 'User-agent: *\nDisallow: /\n');
    if (path === '/api/inbound' && req.method === 'POST') {
      const account = accountForRecipient(accounts, req.headers['x-mailflare-to']);
      if (!account) return reply(res, 400, 'Unknown recipient');
      delete req.headers.cookie; delete req.headers.authorization;
      // Mailflare validates the message HMAC before storing anything.
      return proxy.web(req, res, { target: 'http://mailflare:3000' });
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin !== origin) return reply(res, 403, 'Invalid origin');
    if (path === '/login' && ['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
      return reply(res, 200, loginHtml, 'text/html; charset=utf-8');
    }
    if (path === '/login.js' && req.method === 'GET') return reply(res, 200, loginScript, 'text/javascript; charset=utf-8');
    if (path === '/brand.png' && ['GET','HEAD'].includes(req.method)) return reply(res, 200, brandImage, 'image/png');
    const allowedAuthPaths = ['/api/login/sign-in/magic-link', '/api/login/magic-link/verify', '/api/login/get-session', '/api/login/sign-out'];
    if (path.startsWith('/api/login')) {
      if (!allowedAuthPaths.includes(path)) return reply(res, 404, 'Not found');
      return nodeAuth(req, res);
    }
    if (blockedPath(path)) return reply(res, 403, 'Use your Execution Associates magic link to sign in.');
    const account = await authorized(req);
    if (!account) {
      if (path.startsWith('/api/')) return reply(res, 401, 'Sign in required');
      res.writeHead(302, { Location: '/login' }); return res.end();
    }
    if (path === '/api/auth/logout' && req.method === 'POST') {
      req.url = '/api/login/sign-out';
      return nodeAuth(req, res);
    }
    if (path === '/') { res.writeHead(302, { Location: '/inbox' }); return res.end(); }
    bridge(account, req);
    return proxy.web(req, res, { target: 'http://mailflare:3000' });
  } catch (_error) { console.error('Private app request failed'); if (!res.headersSent) reply(res, 503, 'Temporarily unavailable. Please try again.'); else res.end(); }
});
server.on('upgrade', async (req, socket, head) => {
  try {
    if (req.headers.host !== 'app.execution.associates' || req.headers.origin !== origin || cleanPath(req.url || '/') !== '/api/realtime') return socket.destroy();
    const account = await authorized(req);
    if (!account) return socket.destroy();
    bridge(account, req);
    proxy.ws(req, socket, head, { target: 'http://mailflare:3000' });
    // Bound a socket's lifetime so revoked sessions cannot remain connected indefinitely.
    const timeout = setTimeout(() => socket.destroy(), 60000);
    socket.once('close', () => clearTimeout(timeout));
  } catch { socket.destroy(); }
});

server.listen(3000, '0.0.0.0', () => console.log('Execution private app ready'));
