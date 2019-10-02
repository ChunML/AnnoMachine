import json
import unittest
from flask import current_app
from project import db
from project.models import User
from project.tests.base import BaseTestCase


class TestAuthBlueprint(BaseTestCase):
    def test_user_registration_success(self):
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'chun',
                'password': 'password'
            }),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Successfully registered.')
        self.assertTrue(data['auth_token'])

    def test_user_registration_with_duplicate_username(self):
        self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'chun',
                'password': 'password'
            }),
            content_type='application/json')

        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'chun',
                'password': 'password'
            }),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'username chun was already token!')
        self.assertIsNone(data.get('auth_token'))

    def test_user_registration_with_blank_data(self):
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({}),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Invalid data!')
        self.assertIsNone(data.get('auth_token'))

    def test_user_login_success(self):
        user = User(username='chun', password='password')
        db.session.add(user)
        db.session.commit()
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'chun',
                'password': 'password'
            }),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Successfully logged in.')
        self.assertTrue(data['auth_token'])

    def test_user_login_with_wrong_password(self):
        user = User(username='chun', password='password')
        db.session.add(user)
        db.session.commit()
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'chun',
                'password': '123456'
            }),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Invalid username or password!')
        self.assertIsNone(data.get('auth_token'))

    def test_user_login_with_wrong_username(self):
        user = User(username='chun', password='password')
        db.session.add(user)
        db.session.commit()
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'chun123',
                'password': 'password'
            }),
            content_type='application/json')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Invalid username or password!')
        self.assertIsNone(data.get('auth_token'))
