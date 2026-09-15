"""Add the Execution sites without editing unrelated shared-host sites."""
import pathlib
import shutil
import subprocess
import time

path = pathlib.Path('/etc/caddy/Caddyfile')
original = path.read_text()
line = 'import /etc/caddy/execution.caddy'
if line not in original:
    backup = path.with_name('Caddyfile.before-execution-' + str(int(time.time())))
    shutil.copy2(path, backup)
    path.write_text(original + '\n' + line + '\n')
    result = subprocess.run(['caddy', 'validate', '--config', str(path)])
    if result.returncode:
        shutil.copy2(backup, path)
        raise SystemExit('Validation failed; original configuration restored')
    subprocess.run(['systemctl', 'reload', 'caddy'], check=True)
    print('Execution sites added; existing sites preserved.')
