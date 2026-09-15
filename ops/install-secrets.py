"""Receive generated runtime secrets over SSH stdin; never print their values."""
import json
import os
import pathlib
import sys

data = json.load(sys.stdin)
target = pathlib.Path('/opt/execution-private/runtime.env')
if target.exists():
    raise SystemExit('Runtime secrets already exist; refusing to overwrite')
accounts = [
    dict(key='saul', name='Saul', login='dsauljameson@gmail.com', mailbox='saul@execution.associates', aliases=['info@execution.associates']),
    dict(key='stephan', name='Stephan', login='stephan@knowsuchagency.com', mailbox='stephan@execution.associates', aliases=[]),
]
values = {
    'BETTER_AUTH_SECRET': data['authSecret'],
    'CF_MAIL_TOKEN': data['mailToken'],
    'CF_ACCOUNT_ID': data['accountId'],
    'INBOUND_WEBHOOK_SECRET': data['inboundSecret'],
    'ACCOUNTS_JSON': json.dumps(accounts, separators=(',', ':')),
}
os.umask(0o077)
target.write_text(''.join(key + "='" + value + "'\n" for key, value in values.items()))
print('Private runtime secrets installed with owner-only access.')
