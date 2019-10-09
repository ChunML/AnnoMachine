from project import db
from project.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user
from sqlalchemy.exc import IntegrityError


class TestUserModel(BaseTestCase):
    def test_add_user(self):
        user = add_user(username='chun', password='password')
        self.assertIsNotNone(user.id)
        self.assertIsNotNone(user.password)
        self.assertEqual(user.username, 'chun')

    def test_add_user_duplicate_username(self):
        add_user(username='chun', password='password')
        db.session.add(User(username='chun', password='password'))
        self.assertRaises(IntegrityError, db.session.commit)

    def test_user_json(self):
        user = add_user(username='chun', password='password')
        self.assertTrue(isinstance(user.to_json(), dict))

    def test_same_password_differently_encoded(self):
        user_1 = add_user(username='chun1', password='password')
        user_2 = add_user(username='chun2', password='password')
        self.assertNotEqual(user_1.password, user_2.password)

    def test_encode_auth_token(self):
        user = add_user(username='chun', password='password')
        auth_token = user.encode_auth_token()
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        user = add_user(username='chun', password='password')
        auth_token = user.encode_auth_token()
        decoded_token = User.decode_auth_token(auth_token)
        self.assertEqual(decoded_token, user.id)
