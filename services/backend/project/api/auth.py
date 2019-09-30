from . import api_blueprint as api
from flask import request, jsonify
from sqlalchemy import exc
from project.models import User
from project import db


@api.route('/api/auth/register', methods=['POST'])
def register():
    response_object = {
        'status': 'fail',
        'message': 'Invalid data.'
    }
    data = request.get_json()
    if not data:
        return jsonify(response_object), 400
    username = data.get('username')
    password = data.get('password')
    try:
        user = User.query.filter_by(username=username).first()
        if user:
            response_object['message'] = f'username {username} was already token!'
            return jsonify(response_object), 400

        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        auth_token = new_user.encode_auth_token()
        response_object['status'] = 'success'
        response_object['message'] = 'Successfully registered.'
        response_object['auth_token'] = auth_token.decode()
        return jsonify(response_object), 201
    except (exc.IntegrityError, ValueError):
        db.session.rollback()
        return jsonify(response_object), 400
