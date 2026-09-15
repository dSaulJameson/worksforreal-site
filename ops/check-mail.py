import sqlite3
for owner in ('saul', 'stephan'):
    connection = sqlite3.connect('file:/var/lib/docker/volumes/execution-private_' + owner + '-mail/_data/mailflare.sqlite?mode=ro', uri=True)
    count = connection.execute("SELECT count(*) FROM messages WHERE direction='inbound' AND (subject LIKE '% setup verification' OR subject LIKE '% delivery verification')").fetchone()[0]
    print(owner + ': ' + str(count) + ' incoming setup-check messages stored')
    assert count > 0, 'No incoming test message stored'
