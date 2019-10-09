from project import db
from project.models import Box
from project.tests.base import BaseTestCase
from project.tests.utils import add_user, add_image, add_box
from sqlalchemy.exc import StatementError
from hashlib import sha256


class TestBoxModel(BaseTestCase):
    def test_add_box(self):
        box = add_box(x_min=0.0, y_min=1.0,
                      x_max=2.0, y_max=3.0,
                      label='dog')
        self.assertEqual(box.x_min, 0.0)
        self.assertEqual(box.y_min, 1.0)
        self.assertEqual(box.x_max, 2.0)
        self.assertEqual(box.y_max, 3.0)
        self.assertEqual(box.label, 'dog')

    def test_add_box_with_image(self):
        image = add_image(
            name=sha256('test_name'.encode()).hexdigest())
        box = add_box(x_min=0.0, y_min=1.0,
                      x_max=2.0, y_max=3.0,
                      label='dog', image=image)
        self.assertEqual(box.x_min, 0.0)
        self.assertEqual(box.y_min, 1.0)
        self.assertEqual(box.x_max, 2.0)
        self.assertEqual(box.y_max, 3.0)
        self.assertEqual(box.label, 'dog')
        self.assertIsNotNone(box.image)
        self.assertEqual(
            box.image.name,
            sha256('test_name'.encode()).hexdigest())

    def test_add_box_non_numeric_coordinates(self):
        box = Box(x_min='hello', y_min=1.0,
                  x_max=2.0, y_max=3.0,
                  label='dog')
        db.session.add(box)
        self.assertRaises(StatementError, db.session.commit)

    def test_box_to_json(self):
        box = add_box(x_min=0.0, y_min=1.0,
                      x_max=2.0, y_max=3.0,
                      label='dog')
        self.assertTrue(isinstance(box.to_json(), dict))