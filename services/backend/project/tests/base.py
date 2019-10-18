from flask_testing import TestCase
from project import create_app, db
import shutil
import os


app = create_app()


class BaseTestCase(TestCase):
    def create_app(self):
        app.config.from_object('project.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        file_dir = os.path.join(os.path.dirname(__file__), 'files')
        if os.path.isdir(file_dir):
            shutil.rmtree(file_dir)
