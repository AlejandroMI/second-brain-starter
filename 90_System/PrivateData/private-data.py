#!/usr/bin/env python3
"""Optional age-encrypted JSON store. Values enter through stdin, never arguments."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


STORE = Path(__file__).resolve().parents[2] / 'private-data.json.age'
KEY = Path(os.environ.get('SECOND_BRAIN_KEY', '~/.config/second-brain/age-key.txt')).expanduser()


def run(args, data=None):
    result = subprocess.run(args, input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        raise RuntimeError('age operation failed. Check the key and store; no data was saved.')
    return result.stdout


def read_object(data):
    try:
        value = json.loads(data)
    except (ValueError, UnicodeError):
        raise RuntimeError('Expected a valid JSON object. No data was saved.') from None
    if not isinstance(value, dict) or not value:
        raise RuntimeError('Expected a nonempty JSON object. No data was saved.')
    return value


def main():
    args = sys.argv[1:]
    if not (args in (['init'], ['write']) or len(args) == 2 and args[0] == 'read'):
        raise RuntimeError('Usage: private-data.py init | write (JSON via stdin) | read FIELD')
    age = shutil.which('age')
    keygen = shutil.which('age-keygen')
    if not age or not keygen:
        raise RuntimeError('Install age and age-keygen before using this optional helper.')
    if not KEY.is_file():
        raise RuntimeError('No key found. Provision an authorized key outside the repository.')
    # Resolving symlinks also prevents accidentally accepting a key stored in the vault.
    if KEY.resolve().is_relative_to(STORE.parent):
        raise RuntimeError('The key must be outside the repository.')
    if os.name != 'nt' and KEY.stat().st_mode & 0o077:
        raise RuntimeError('Key permissions must be owner-only (600).')

    if args[0] == 'init' and STORE.exists():
        raise RuntimeError('Store already exists. Use write after reading and preserving its fields.')
    if args[0] != 'init' and not STORE.is_file():
        raise RuntimeError('No store found. Use init only when creating a new store.')

    if args[0] == 'read':
        value = read_object(run([age, '--decrypt', '--identity', str(KEY), str(STORE)]))
        if args[1] not in value:
            raise RuntimeError('Requested field is absent.')
        sys.stdout.write(json.dumps(value[args[1]], ensure_ascii=False) + '\n')
        return

    value = read_object(sys.stdin.buffer.read())
    if args[0] == 'write':
        # An unrelated device key must not replace an unreadable store.
        read_object(run([age, '--decrypt', '--identity', str(KEY), str(STORE)]))
    plaintext = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    recipient = run([keygen, '-y', str(KEY)]).decode('ascii').strip()
    ciphertext = run([age, '--encrypt', '--armor', '--recipient', recipient], plaintext)
    if run([age, '--decrypt', '--identity', str(KEY)], ciphertext) != plaintext:
        raise RuntimeError('Recovery verification failed. No data was saved.')

    path = None
    try:
        with tempfile.NamedTemporaryFile(dir=STORE.parent, prefix='.private-data-', suffix='.tmp', delete=False) as handle:
            path = Path(handle.name)
            handle.write(ciphertext)
            handle.flush()
            os.fsync(handle.fileno())
        if args[0] == 'init':
            # Exclusive creation: even a second simultaneous init cannot overwrite a store.
            os.link(path, STORE)
        else:
            os.replace(path, STORE)
    finally:
        if path is not None:
            path.unlink(missing_ok=True)
    print('Encrypted data saved and recovery verified.')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, OSError) as error:
        # OSError filenames can contain private field names or arbitrary local paths.
        message = str(error) if isinstance(error, RuntimeError) else 'File operation failed. Check access and retry after inspecting store state.'
        print(message, file=sys.stderr)
        sys.exit(1)
