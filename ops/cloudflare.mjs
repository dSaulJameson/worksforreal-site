import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes } from 'node:crypto';

const file = process.env.CLOUDFLARE_KEYS_FILE;
if (!file) throw new Error('Set CLOUDFLARE_KEYS_FILE to the local credentials file');
const source = readFileSync(file, 'utf8');
const token = source.match(/cfat_[A-Za-z0-9_-]+/)?.[0];
if (!token) throw new Error('Account API token not found');
export async function cf(path, method = 'GET', body, credential = token) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method, headers: { Authorization: `Bearer ${credential}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data.success === false) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(data.errors)}`);
  return data.result;
}
export const zone = (await cf('/zones?name=execution.associates'))[0];
export const account = zone.account.id;
const secretFile = process.env.EXECUTION_SECRETS_FILE;
export function secrets() { return JSON.parse(readFileSync(secretFile, 'utf8')); }
export function routingToken() {
  const config = readFileSync(process.env.WRANGLER_AUTH_FILE, 'utf8');
  return config.match(/oauth_token\s*=\s*"([^"]+)"/)[1];
}
async function dns(zoneId, record) {
  const matches = await cf(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(record.name)}&type=${record.type}`);
  if (matches.some(r => r.content === record.content && (record.proxied === undefined || r.proxied === record.proxied))) return;
  if (matches.length) throw new Error(`Existing ${record.type} record for ${record.name}; review before changing`);
  await cf(`/zones/${zoneId}/dns_records`, 'POST', { ttl: 1, ...record });
  console.log(`Added ${record.type} ${record.name}`);
}
const command = process.argv[2];
if (command === 'restrict-runtime-token') {
  const current = await cf(`/accounts/${account}/tokens/${secrets().mailTokenId}`);
  const groups = await cf(`/accounts/${account}/tokens/permission_groups`);
  const permission_groups = groups.filter(g => ['Email Sending Write','Email Sending Read'].includes(g.name)).map(g=>({id:g.id}));
  if (permission_groups.length !== 2) throw new Error('Unexpected email permission groups');
  await cf(`/accounts/${account}/tokens/${secrets().mailTokenId}`, 'PUT', { name:current.name, policies:[{effect:'allow',resources:{[`com.cloudflare.api.account.${account}`]:'*'},permission_groups}] });
  console.log('Runtime token restricted to email sending only.');
}
if (command === 'prepare-email-token') {
  if (!secretFile) throw new Error('Set EXECUTION_SECRETS_FILE outside the repository');
  if (existsSync(secretFile)) throw new Error('Secret file already exists; refusing to overwrite');
  const groups = await cf(`/accounts/${account}/tokens/permission_groups`);
  const named = names => names.map(name => {
    const group = groups.find(g => g.name === name);
    if (!group) throw new Error(`Missing permission ${name}`);
    return { id: group.id };
  });
  const result = await cf(`/accounts/${account}/tokens`, 'POST', {
    name: 'Execution Associates mail runtime',
    policies: [
      { effect: 'allow', resources: { [`com.cloudflare.api.account.${account}`]: '*' }, permission_groups: named(['Email Sending Write', 'Email Sending Read']) },
      { effect: 'allow', resources: { [`com.cloudflare.api.account.zone.${zone.id}`]: '*' }, permission_groups: named(['Zone Read', 'DNS Write', 'Email Routing Rules Write', 'Zone DNS Settings Write']) },
    ],
  });
  mkdirSync(dirname(secretFile), { recursive: true });
  writeFileSync(secretFile, JSON.stringify({ accountId: account, zoneId: zone.id, mailToken: result.value, mailTokenId: result.id, authSecret: randomBytes(48).toString('base64url'), inboundSecret: randomBytes(48).toString('base64url') }), { mode: 0o600 });
  console.log('Scoped email credentials saved; no values displayed.');
}
if (command === 'email-status') {
  for (const path of [`/zones/${zone.id}/email/routing`, `/zones/${zone.id}/email/sending/subdomains`]) {
    try { console.log(path, JSON.stringify(await cf(path, 'GET', undefined, secrets().mailToken))); }
    catch (error) { console.log(error.message); }
  }
}
if (command === 'fix-routing-scope') {
  const stored = secrets();
  const details = await cf(`/accounts/${account}/tokens/${stored.mailTokenId}`);
  const groups = await cf(`/accounts/${account}/tokens/permission_groups`);
  const permission = groups.find(g => g.name === 'Zone Settings Write');
  const policies = details.policies.map(p => ({ effect: p.effect, resources: p.resources, permission_groups: p.permission_groups.map(g => ({ id: g.id })) }));
  if (!policies[1].permission_groups.some(g => g.id === permission.id)) policies[1].permission_groups.push({ id: permission.id });
  await cf(`/accounts/${account}/tokens/${stored.mailTokenId}`, 'PUT', { name: details.name, policies });
  console.log('Added zone-settings permission for email routing.');
}
if (command === 'prepare-domains') {
  const redirectZone = (await cf('/zones?name=executionassociates.com'))[0];
  for (const [z, names] of [[zone, ['execution.associates', 'www.execution.associates', 'app.execution.associates']], [redirectZone, ['executionassociates.com', 'www.executionassociates.com']]]) {
    for (const name of names) await dns(z.id, { type: 'A', name, content: '170.205.38.181', proxied: true });
  }
  const path = `/zones/${zone.id}/email/sending/subdomains`;
  let sending = (await cf(path)).find(s => s.name === 'execution.associates');
  if (!sending) sending = await cf(path, 'POST', { name: 'execution.associates' });
  const records = await cf(`${path}/${sending.tag}/dns`);
  for (const record of records) {
    const { type, name, content, priority } = record;
    await dns(zone.id, { type, name, content, ...(priority === undefined ? {} : { priority }), proxied: false });
  }
  console.log('Sending domain:', JSON.stringify(sending));
}
if (command === 'enable-routing') {
  console.log(JSON.stringify(await cf(`/zones/${zone.id}/email/routing/dns`, 'POST', {}, routingToken())));
}
if (command === 'deploy-relay') {
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify({ main_module: 'relay.mjs', compatibility_date: '2026-09-15', bindings: [{ type: 'secret_text', name: 'INBOUND_WEBHOOK_SECRET', text: secrets().inboundSecret }] })], { type:'application/json' }));
  form.append('relay.mjs', new Blob([readFileSync(new URL('./mail-relay.mjs', import.meta.url))], { type:'application/javascript+module' }), 'relay.mjs');
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/execution-mail-relay`, { method:'PUT', headers:{Authorization:`Bearer ${token}`}, body:form });
  const result = await response.json();
  if (!result.success) throw new Error(JSON.stringify(result.errors));
  console.log('Email relay deployed.');
}
if (command === 'route-mail') {
  const credential = routingToken();
  const path = `/zones/${zone.id}/email/routing/rules`;
  const existing = await cf(path, 'GET', undefined, credential);
  for (const address of ['saul@execution.associates','stephan@execution.associates','info@execution.associates']) {
    const match = existing.find(r => r.matchers?.some(m => m.value === address));
    if (match) { console.log(`Existing rule for ${address}; unchanged`); continue; }
    await cf(path, 'POST', { name:`Execution inbox: ${address}`, enabled:true, matchers:[{type:'literal',field:'to',value:address}], actions:[{type:'worker',value:['execution-mail-relay']}] }, credential);
    console.log(`Routed ${address}`);
  }
}
if (command === 'send-check') {
  const recipient = process.argv[3];
  if (!['saul@execution.associates','stephan@execution.associates','dsauljameson@gmail.com'].includes(recipient)) throw new Error('Invalid test recipient');
  console.log(JSON.stringify(await cf(`/accounts/${account}/email/sending/send`, 'POST', {from:'saul@execution.associates',to:[recipient],subject:'Execution Associates delivery verification',text:'Checking delivery for the new private email setup.'}, secrets().mailToken)));
}
