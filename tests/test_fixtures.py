import json
import unittest

import fixtures


class FixturesTestCase(unittest.TestCase):
    def test_fixture_to_json(self):
        fixture = fixtures.Fixture()
        fixture.id = 1
        fixture.star_rating = [1, 2, 3, 4]
        self.assertEqual(json.loads(fixture.to_JSON()), {'id': 1, 'star_rating': [1, 2, 3, 4]})


if __name__ == '__main__':
    unittest.main()
