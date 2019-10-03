from . import api_blueprint as api
from flask import request, jsonify
from sqlalchemy import exc
from project.models import User
from project import db, bcrypt


@api.route('/api/auth/register', methods=['POST'])
def register():
    response_object = {
        'status': 'fail',
        'message': 'Invalid data!'
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
        response_object['username'] = user.username
        return jsonify(response_object), 201
    except (exc.IntegrityError, ValueError):
        db.session.rollback()
        return jsonify(response_object), 400


@api.route('/api/auth/login', methods=['POST'])
def login():
    response_object = {
        'status': 'fail',
        'message': 'Invalid data!'
    }
    data = request.get_json()
    if not data:
        return jsonify(response_object), 400
    username = data.get('username')
    password = data.get('password')
    try:
        user = User.query.filter_by(username=username).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            response_object['message'] = 'Invalid username or password!'
            return jsonify(response_object), 400
        auth_token = user.encode_auth_token()
        response_object['status'] = 'success'
        response_object['message'] = 'Successfully logged in.'
        response_object['auth_token'] = auth_token.decode()
        response_object['username'] = user.username
        return jsonify(response_object), 200
    except Exception:
        return jsonify(response_object), 500


@api.route('/api/auth/check-status', methods=['POST'])
def check_login_status():
    response_object = {
        'status': 'fail',
        'message': 'Invalid token.'
    }
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify(response_object), 403
    auth_token = auth_header.split(' ')[1]
    resp = User.decode_auth_token(auth_token)
    if isinstance(resp, str):
        response_object['message'] = resp
        return jsonify(response_object), 401

    user = User.query.filter_by(id=resp).first()
    response_object['status'] = 'success'
    response_object['message'] = 'Valid token.'
    response_object['username'] = user.username

    return jsonify(response_object), 200
