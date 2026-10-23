"""Exercise the public CLI with disposable keys and fictional data only."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


SOURCE = Path(__file__).resolve().parents[1] / 'private-data.py'


@unittest.skipUnless(shutil.which('age') and shutil.which('age-keygen'), 'age tools required')
class PrivateDataTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.vault = self.root / 'vault'
        helper_dir = self.vault / '90_System' / 'PrivateData'
        helper_dir.mkdir(parents=True)
        self.helper = helper_dir / 'private-data.py'
        shutil.copyfile(SOURCE, self.helper)
        self.key = self.root / 'key.txt'
        self.other_key = self.root / 'other-key.txt'
        for path in (self.key, self.other_key):
            subprocess.run(['age-keygen', '-o', str(path)], check=True, capture_output=True)
            path.chmod(0o600)
        self.store = self.vault / 'private-data.json.age'
        self.original = {'example_reference': 'FICTIONAL-000', 'other': 'FICTIONAL-SECOND'}

    def cli(self, *args, data=None, key=None):
        env = dict(os.environ, SECOND_BRAIN_KEY=str(key or self.key))
        return subprocess.run([sys.executable, str(self.helper), *args], input=data,
                              capture_output=True, env=env)

    def initialize(self):
        result = self.cli('init', data=json.dumps(self.original).encode())
        self.assertEqual(result.returncode, 0, result.stderr)
        return self.store.read_bytes()

    def test_round_trip_selective_read_and_replacement(self):
        ciphertext = self.initialize()
        for value in self.original.values():
            self.assertNotIn(value.encode(), ciphertext)
        result = self.cli('read', 'example_reference')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), self.original['example_reference'])
        self.assertNotIn(self.original['other'].encode(), result.stdout)
        updated = dict(self.original, example_reference='FICTIONAL-UPDATED')
        result = self.cli('write', data=json.dumps(updated).encode())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn(b'FICTIONAL', result.stdout + result.stderr)
        recovered = subprocess.run(['age', '-d', '-i', str(self.key), str(self.store)],
                                   capture_output=True, check=True)
        self.assertEqual(json.loads(recovered.stdout), updated)
        self.assertFalse(list(self.vault.glob('.private-data-*.tmp')))

    def test_existing_store_cannot_be_initialized_again(self):
        before = self.initialize()
        result = self.cli('init', data=b'{"new":"FICTIONAL"}')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.store.read_bytes(), before)

    def test_wrong_or_missing_key_preserves_store(self):
        before = self.initialize()
        for key in (self.other_key, self.root / 'missing-key'):
            for args, data in ((('read', 'example_reference'), None),
                               (('write',), b'{"replacement":"FICTIONAL"}')):
                result = self.cli(*args, data=data, key=key)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, b'')
                self.assertEqual(self.store.read_bytes(), before)

    def test_invalid_replacements_preserve_store_without_echo(self):
        before = self.initialize()
        for invalid in (b'FICTIONAL-INVALID', b'[]', b'{}', b'null', b'"FICTIONAL"', b'\xff'):
            result = self.cli('write', data=invalid)
            self.assertNotEqual(result.returncode, 0)
            self.assertNotIn(b'FICTIONAL', result.stdout + result.stderr)
            self.assertEqual(self.store.read_bytes(), before)

    def test_invalid_init_does_not_create_store(self):
        result = self.cli('init', data=b'[]')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.store.exists())

    def test_corrupt_store_cannot_be_overwritten(self):
        self.store.write_bytes(b'not a valid ciphertext')
        result = self.cli('write', data=b'{"new":"FICTIONAL"}')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.store.read_bytes(), b'not a valid ciphertext')

    def test_missing_store_is_not_silently_created_by_write(self):
        result = self.cli('write', data=b'{"new":"FICTIONAL"}')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.store.exists())

    def test_missing_field_does_not_dump_store(self):
        self.initialize()
        result = self.cli('read', 'absent')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(result.stdout, b'')
        self.assertNotIn(b'FICTIONAL', result.stderr)

    def test_key_inside_repository_is_rejected(self):
        local_key = self.vault / 'local-key.txt'
        shutil.copyfile(self.key, local_key)
        local_key.chmod(0o600)
        result = self.cli('init', data=b'{"new":"FICTIONAL"}', key=local_key)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.store.exists())

    @unittest.skipIf(os.name == 'nt', 'POSIX permissions')
    def test_insecure_key_permissions_are_rejected(self):
        self.key.chmod(0o644)
        result = self.cli('init', data=b'{"new":"FICTIONAL"}')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.store.exists())


if __name__ == '__main__':
    unittest.main()
