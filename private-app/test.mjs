import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanPath, blockedPath, accountForEmail, accountForRecipient } from './policy.mjs';
test('encoded paths cannot bypass route policy', () => {
  for (const path of ['/api/auth/%6cogin', '//api/auth/login', '/a/../api/auth/login', '/api\\auth/login', '/api/auth//login']) assert.equal(cleanPath(path), null);
});
test('native registration and password authentication are blocked', () => {
  for (const path of ['/setup','/register','/api/setup/status','/api/auth/register','/api/auth/login','/api/auth/password-reset/request','/api/auth/mfa/verify']) assert.equal(blockedPath(path), true);
  assert.equal(blockedPath('/api/auth/me'), false);
});
test('identities and recipients are exact matches, never domain-wide access', () => {
  const accounts = [{ login:'owner@example.com', mailbox:'owner@execution.associates', aliases:['info@execution.associates'] }];
  assert.equal(accountForEmail(accounts, 'OWNER@example.com'), accounts[0]);
  assert.equal(accountForEmail(accounts, 'other@example.com'), undefined);
  assert.equal(accountForRecipient(accounts, 'info@execution.associates'), accounts[0]);
  assert.equal(accountForRecipient(accounts, 'other@execution.associates'), undefined);
});
