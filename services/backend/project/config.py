import os


class BaseConfig:
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    ARCH = os.environ.get('ARCH')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER')
    ANNO_FOLDER = os.getenv('ANNO_FOLDER')
    DETECT_FOLDER = os.getenv('DETECT_FOLDER')
    SEND_FILE_MAX_AGE_DEFAULT = 0
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    BCRYPT_LOG_ROUNDS = 13
    TOKEN_EXPIRATION_DAYS = 30
    TOKEN_EXPIRATION_SECONDS = 0


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    DEBUG_TB_ENABLED = True
    BCRYPT_LOG_ROUNDS = 4


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL')
    BCRYPT_LOG_ROUNDS = 4
    TOKEN_EXPIRATION_DAYS = 0
    TOKEN_EXPIRATION_SECONDS = 3
    PRETRAINED_TYPE = 'base'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'tests', 'files', 'upload')
    ANNO_FOLDER = os.path.join(os.path.dirname(__file__), 'tests', 'files', 'anno')
    DETECT_FOLDER = os.path.join(os.path.dirname(__file__), 'tests', 'files', 'detect')


class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
