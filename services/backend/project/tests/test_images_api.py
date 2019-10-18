from io import BytesIO
import json
from project.models import Box, Image
from project.tests.base import BaseTestCase
from project.tests.utils import add_user, add_image, add_box
import os


class TestImagesListApi(BaseTestCase):
    def test_get_images(self):
        user_1 = add_user('user1', 'pass')
        user_2 = add_user('user2', 'pass')
        add_image('image1', user=user_1)
        add_image('image2', user=user_1)
        add_image('image3', user=user_2)
        response = self.client.get(
            '/api/images',
            follow_redirects=True
        )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        data = data['data']
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['name'], 'image1')
        self.assertEqual(data[0]['user']['username'], 'user1')
        self.assertIsNotNone(data[0]['uploaded_at'])
        self.assertEqual(data[1]['name'], 'image2')
        self.assertEqual(data[1]['user']['username'], 'user1')
        self.assertIsNotNone(data[1]['uploaded_at'])
        self.assertEqual(data[2]['name'], 'image3')
        self.assertEqual(data[2]['user']['username'], 'user2')
        self.assertIsNotNone(data[2]['uploaded_at'])

    def test_post_valid_image_without_logging_in(self):
        data = {'files': []}
        data['files'].append((BytesIO(b'testContent'), 'testImage.jpg'))
        data['image_url'] = ''
        response = self.client.post(
            '/api/images',
            data=data,
            content_type='multipart/form-data',
            follow_redirects=True
        )
        self.assertEqual(response.status_code, 403)
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Provide a valid auth token.')

    def test_post_valid_image_after_logging_in(self):
        user = add_user(username='chun', password='password')
        auth_token = user.encode_auth_token().decode()
        image_file = open(os.path.join(
            os.path.dirname(__file__), 'image', 'test.jpg'), 'rb').read()
        data = {}
        data['image_file'] = (BytesIO(image_file), 'testImage.jpg')
        data['image_url'] = ''
        response = self.client.post(
            '/api/images',
            data=data,
            content_type='multipart/form-data',
            follow_redirects=True,
            headers={'Authorization': f'Bearer {auth_token}'})
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Successfully uploaded.')


class TestImagesApi(BaseTestCase):
    def test_delete_image_without_logging_in(self):
        user = add_user('user', 'pass')
        image = add_image('image', user=user)
        add_box(10, 10, 20, 20, 'dog', image=image)
        add_box(20, 20, 30, 30, 'cat', image=image)
        response = self.client.delete(
            f'/api/images/{image.name.replace(".jpg", "")}',
            follow_redirects=True
        )
        self.assertEqual(response.status_code, 403)
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Provide a valid auth token.')

    def test_delete_image_after_logging_in(self):
        user = add_user(username='chun', password='password')
        image = add_image('image.jpg', user=user)
        add_box(10, 10, 20, 20, 'dog', image=image)
        add_box(20, 20, 30, 30, 'cat', image=image)
        auth_token = user.encode_auth_token().decode()
        image_name = image.name.replace(".jpg", "")
        response = self.client.delete(
            f'/api/images/{image_name}',
            follow_redirects=True,
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Image was successfully deleted.')
        self.assertEqual(Image.query.count(), 0)
        self.assertEqual(Box.query.count(), 0)

    def test_delete_image_of_other_user(self):
        user_1 = add_user(username='test_1', password='password')
        user_2 = add_user(username='test_2', password='password')
        image = add_image('image.jpg', user=user_1)
        auth_token = user_2.encode_auth_token().decode()
        image_name = image.name.replace(".jpg", "")
        response = self.client.delete(
            f'/api/images/{image_name}',
            follow_redirects=True,
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        self.assertEqual(response.status_code, 403)
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Invalid payload!')

    def test_delete_image_with_invalid_name(self):
        user = add_user(username='test', password='password')
        image = add_image('image.jpg', user=user)
        auth_token = user.encode_auth_token().decode()
        response = self.client.delete(
            f'/api/images/wrong_name',
            follow_redirects=True,
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'fail')
        self.assertEqual(data['message'], 'Invalid payload!')
