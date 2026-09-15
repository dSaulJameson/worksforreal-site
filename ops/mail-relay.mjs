export default {
  async email(message, env) {
    if (!['saul@execution.associates','stephan@execution.associates','info@execution.associates'].includes(message.to.toLowerCase())) {
      message.setReject('Unknown recipient'); return;
    }
    const raw = await new Response(message.raw).arrayBuffer();
    const prefix = new TextEncoder().encode(`${message.from}\n${message.to}\n`);
    const signed = new Uint8Array(prefix.length + raw.byteLength);
    signed.set(prefix); signed.set(new Uint8Array(raw), prefix.length);
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.INBOUND_WEBHOOK_SECRET), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
    const signature = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, signed)), b=>b.toString(16).padStart(2,'0')).join('');
    const response = await fetch('https://app.execution.associates/api/inbound', {
      method:'POST', headers:{'Content-Type':'message/rfc822','X-Mailflare-From':message.from,'X-Mailflare-To':message.to,'X-Mailflare-Signature':signature,'X-Mailflare-Headers':JSON.stringify(Object.fromEntries(message.headers))}, body:raw,
    });
    if (!response.ok) throw new Error(`Inbox delivery failed: ${response.status}`);
    const result = await response.json();
    if (result.action === 'reject') message.setReject(result.reason || 'Message rejected');
    if (result.forwardTo) await message.forward(result.forwardTo, new Headers(result.forwardHeaders || {}));
  },
  async fetch() { return new Response('Not found', { status:404 }); },
};
