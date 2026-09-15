// Run explicitly over SSH inside the gateway container. No test tokens are logged.
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
const origin = 'https://app.execution.associates';
const accounts = JSON.parse(process.env.ACCOUNTS_JSON);
let link;
const auth = betterAuth({ baseURL:origin, basePath:'/api/login', secret:process.env.BETTER_AUTH_SECRET, database:new Database('/data/auth.sqlite'), plugins:[magicLink({disableSignUp:true, storeToken:'hashed', sendMagicLink:async ({url})=>{link=url;}})] });
const headers = { origin, 'Content-Type':'application/json' };
for (const account of accounts) {
  await auth.api.signInMagicLink({ body:{email:account.login,callbackURL:'/inbox',errorCallbackURL:'/login'}, headers:new Headers(headers) });
  const verify = await fetch(link, {redirect:'manual'});
  assert.equal(verify.status,302);
  assert.equal(new URL(verify.headers.get('location')).pathname,'/inbox');
  const cookies = verify.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  assert.ok(cookies.includes('__Secure-execution.session_token='));
  const me = await fetch(origin+'/api/auth/me',{headers:{cookie:cookies}});
  assert.equal(me.status,200);
  assert.equal((await me.json()).user.email,account.mailbox);
  const inbox = await fetch(origin+'/inbox',{headers:{cookie:cookies},redirect:'manual'});
  assert.equal(inbox.status,200);
  const boxes = await fetch(origin+'/api/mailboxes',{headers:{cookie:cookies}});
  const boxData=await boxes.json();
  assert.ok(boxData.mailboxes.every(b=>b.localPart === account.key));
  if (process.argv.includes('--mail')) {
    const recipients = account.key === 'saul' ? ['stephan@execution.associates'] : ['saul@execution.associates','info@execution.associates'];
    const result = await fetch(origin+'/api/send', { method:'POST', headers:{...headers,cookie:cookies}, body:JSON.stringify({from:account.mailbox,to:recipients,subject:'Execution Associates setup verification',text:'This is a setup check confirming the private inbox can send and receive email.',mailboxId:boxData.mailboxes[0].id}) });
    if (!result.ok) throw new Error(`Mail test failed: ${result.status} ${await result.text()}`);
    console.log(account.key+': outgoing mail accepted');
  }
  const replay = await fetch(link,{redirect:'manual'});
  assert.ok(replay.headers.get('location').includes('INVALID_TOKEN'));
  const csrf=await fetch(origin+'/api/auth/logout',{method:'POST',headers:{cookie:cookies,origin:'https://example.org'}});
  assert.equal(csrf.status,403);
  const logout=await fetch(origin+'/api/auth/logout',{method:'POST',headers:{...headers,cookie:cookies},body:'{}'});
  assert.equal(logout.status,200);
  const after=await fetch(origin+'/api/auth/me',{headers:{cookie:cookies}});
  assert.equal(after.status,401);
  console.log(account.key+': magic-link, correct inbox, replay rejection, CSRF and logout PASS');
}
const denied=await fetch(origin+'/api/auth/me',{headers:{cookie:'ep_session=spoof',authorization:'Bearer spoof'}});
assert.equal(denied.status,401);
console.log('Native-session bypass rejected.');
