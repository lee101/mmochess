import os
import tempfile
import unittest

os.environ.setdefault('DATABASE_PATH', os.path.join(tempfile.mkdtemp(), 'mmochess-test.db'))

from fastapi.testclient import TestClient

import main


class WebsiteUnitTest(unittest.TestCase):
    def setUp(self):
        self.headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) Version/6.0 Safari/536.25',
                        'Accept-Language': 'en_US'}
        self.client = TestClient(main.app)
        self.client.__enter__()

    def tearDown(self):
        self.client.__exit__(None, None, None)

    def test_levels(self):
        response = self.client.get('/versus', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html', response.text.lower())

    def test_homepage(self):
        response = self.client.get('/', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html', response.text.lower())


if __name__ == '__main__':
    unittest.main()
