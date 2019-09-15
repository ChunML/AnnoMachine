from flask import Blueprint


main_blueprint = Blueprint('main', __name__)


from . import views