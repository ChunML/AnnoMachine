from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import sys

from ssd_tf2.network import create_ssd


db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()

try:
    ssd = create_ssd(21, os.getenv('ARCH'), os.getenv('PRETRAINED_TYPE'),
                     os.getenv('CHECKPOINT_DIR'), os.getenv('CHECKPOINT_PATH'))
except Exception as e:
    print(e)
    print('The program is exiting...')
    sys.exit()


def create_app(script_info=None):
    app = Flask(__name__)

    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)

    db.init_app(app)
    migrate.init_app(db, migrate)
    bcrypt.init_app(app)
    cors.init_app(app)

    from project.api import api_blueprint
    app.register_blueprint(api_blueprint)

    @app.shell_context_processor
    def ctx():
        return dict(app=app, db=db)

    return app
