export function accountForEmail(accounts, email) {
  return accounts.find(a => a.login.toLowerCase() === String(email).trim().toLowerCase());
}
export function accountForRecipient(accounts, email) {
  return accounts.find(a => [a.mailbox, ...(a.aliases || [])].includes(String(email).toLowerCase()));
}
export function cleanPath(raw) {
  if (!raw.startsWith('/') || raw.startsWith('//') || /[\\\x00-\x20]/.test(raw)) return null;
  const path = raw.split('?')[0];
  // Prevent alternate encodings from bypassing the auth-route deny list.
  if (/%|\/\/|(?:^|\/)\.{1,2}(?:\/|$)/.test(path)) return null;
  return path.replace(/\/$/, '') || '/';
}
export function blockedPath(path) {
  return /^\/api\/licenses\/(?:activate|validate|deactivate)(?:\/|$)/.test(path)
    || /^\/(?:setup|register|onboarding|forgot-password|reset-password)(?:\/|$)/.test(path)
    || /^\/api\/(?:setup|seed)(?:\/|$)/.test(path)
    || /^\/api\/auth\/(?!me$|logout$)/.test(path)
    || /^\/api\/(?:settings\/password|settings\/mfa|admin\/update)(?:\/|$)/.test(path);
}
