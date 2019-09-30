import json
import unittest
from flask import current_app
from project import db
from project.models import User
from project.tests.base import BaseTestCase


class TestAuthBlueprint(BaseTestCase):
    def test_user_registration(self):
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
