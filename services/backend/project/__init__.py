from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
from ssd.network import create_ssd


db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()

ssd = create_ssd(
    21, 'ssd300', 'ssd',
    './ssd/models/ssd_epoch_120.pth')


def create_app(script_info=None):
    app = Flask(__name__)

    app_settings = os.getenv('APP_SETTINGS') or 'project.config.DevelopmentConfig'
    app.config.from_object(app_settings)

    db.init_app(app)
    migrate.init_app(db, migrate)
    bcrypt.init_app(app)
    cors.init_app(app)

    from project.main import main_blueprint
    app.register_blueprint(main_blueprint)
    from project.api import api_blueprint
    app.register_blueprint(api_blueprint)

    @app.shell_context_processor
    def ctx():
        return dict(app=app, db=db)

    return app
