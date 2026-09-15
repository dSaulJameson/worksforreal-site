"""Retire only the old Works for Real virtual hosts; preserve other hosted sites."""
from pathlib import Path
from datetime import datetime, timezone
import subprocess

path = Path('/etc/caddy/Caddyfile')
source = path.read_text()
replacements = {
    'handle @worksForRealWww {\n\t\tredir https://worksforreal.com{uri} permanent\n\t}': 'handle @worksForRealWww {\n\t\trespond "This site has been retired." 410\n\t}',
    'handle @worksForRealApex {\n\t\treverse_proxy 127.0.0.1:3015\n\t}': 'handle @worksForRealApex {\n\t\trespond "This site has been retired." 410\n\t}',
    'worksforreal.com, www.worksforreal.com {\n\timport security\n\tencode zstd gzip\n\n\t@worksForRealDirectWww host www.worksforreal.com\n\tredir @worksForRealDirectWww https://worksforreal.com{uri} permanent\n\n\treverse_proxy 127.0.0.1:3015\n}': 'worksforreal.com, www.worksforreal.com {\n\timport security\n\trespond "This site has been retired." 410\n}',
}
updated = source
for before, after in replacements.items():
    if before not in updated:
        raise SystemExit('Unexpected legacy virtual host configuration; no changes made')
    updated = updated.replace(before, after, 1)
backup = path.with_name('Caddyfile.before-retirement-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
backup.write_text(source)
path.write_text(updated)
try:
    subprocess.run(['caddy', 'validate', '--config', str(path)], check=True)
    subprocess.run(['systemctl', 'reload', 'caddy'], check=True)
except Exception:
    path.write_text(source)
    raise
print('Old website virtual hosts retired; configuration backup retained.')
