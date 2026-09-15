import sqlite3
connection = sqlite3.connect('file:/var/lib/docker/volumes/execution-private_shared-mail/_data/mailflare.sqlite?mode=ro', uri=True)
for owner in ('saul', 'stephan'):
    count = connection.execute("SELECT count(*) FROM messages WHERE mailbox_id=? AND direction='inbound' AND (subject LIKE '% setup verification' OR subject LIKE '% delivery verification')", (owner,)).fetchone()[0]
    print(owner + ': ' + str(count) + ' incoming setup-check messages stored')
    assert count > 0, 'No incoming test message stored'
