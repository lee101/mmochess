import json


class Fixture(object):
    def __init__(self):
        super(Fixture, self).__init__()

    def to_JSON(self):
        # todo compress by removing nulls
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)
