from project import db
from project.models import Image
from project.tests.base import BaseTestCase
from project.tests.utils import add_user, add_image
from sqlalchemy.exc import IntegrityError
from hashlib import sha256


class TestImageModel(BaseTestCase):
    def test_add_image(self):
        image = add_image(
            name=sha256('test_name'.encode()).hexdigest())
        self.assertEqual(sha256('test_name'.encode()).hexdigest(),
                         image.name)

    def test_add_image_with_user(self):
        user = add_user(username='chun', password='password')
        image = add_image(
            name=sha256('test_name'.encode()).hexdigest(),
            user=user)
        self.assertEqual(sha256('test_name'.encode()).hexdigest(),
                         image.name)
        self.assertIsNotNone(image.user)
        self.assertEqual('chun', image.user.username)

    def test_add_images_with_different_users(self):
        user_1 = add_user(username='chun_1', password='password')
        user_2 = add_user(username='chun_2', password='password')
        image_1 = add_image(
            name=sha256('test_name_1'.encode()).hexdigest(),
            user=user_1)
        image_2 = add_image(
            name=sha256('test_name_2'.encode()).hexdigest(),
            user=user_2)
        self.assertEqual(sha256('test_name_1'.encode()).hexdigest(),
                         image_1.name)
        self.assertEqual('chun_1', image_1.user.username)
        self.assertEqual(sha256('test_name_2'.encode()).hexdigest(),
                         image_2.name)
        self.assertEqual('chun_2', image_2.user.username)

    def test_add_image_duplicate_filename(self):
        image = add_image(
            name=sha256('test_name'.encode()).hexdigest())
        image_2 = Image(
            name=sha256('test_name'.encode()).hexdigest())
        db.session.add(image_2)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_image_to_json(self):
        image = add_image(
            name=sha256('test_name'.encode()).hexdigest())
        self.assertTrue(isinstance(image.to_json(), dict))
