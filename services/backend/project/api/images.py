from flask import jsonify, request, current_app, send_from_directory
from flask_restful import Resource, Api
import csv
from . import api_blueprint as api
from project import ssd, db
from ssd_tf2.test import predict_one_image_from_path, idx_to_name
from ssd_tf2.image_utils import ImageVisualizer
from project.models import User, Image, Box
import os
from sqlalchemy import exc
import requests
from hashlib import sha256
import datetime
from .decorators import authenticate


image_api = Api(api)


@api.route('/api/ping/', methods=['GET'])
def ping():
    response_object = {
        'status': 'success',
        'message': 'Hello!'
    }

    return jsonify(response_object), 200


@api.route('/api/annotations/kitti/<filename>')
def anno_link(filename):
    image = Image.query.filter_by(name=filename.replace('.txt', '.jpg')).first()
    boxes = image.boxes
    with open(os.path.join(current_app.config['ANNO_FOLDER'],
                           filename), 'w', encoding='utf-8') as f:
        writer = csv.DictWriter(
            f, delimiter=' ',
            fieldnames=['label', 'x_min', 'y_min', 'x_max', 'y_max'])
        writer.writerows([box.to_json() for box in boxes])

    return send_from_directory(current_app.config['ANNO_FOLDER'],
                               filename, as_attachment=True)


@api.route('/api/<image_type>/<filename>')
def image_link(image_type, filename):
    if image_type == 'uploads':
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER'],
            filename)
    return send_from_directory(
        current_app.config['DETECT_FOLDER'],
        filename)


class ImagesList(Resource):
    method_decorators = {'post': [authenticate]}

    def __init__(self):
        self.upload_dir = current_app.config['UPLOAD_FOLDER']
        self.anno_dir = current_app.config['ANNO_FOLDER']
        self.detect_dir = current_app.config['DETECT_FOLDER']
        self.visualizer = ImageVisualizer(idx_to_name,
                                          save_dir=self.detect_dir)
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)
        if not os.path.exists(self.anno_dir):
            os.makedirs(self.anno_dir)
        if not os.path.exists(self.detect_dir):
            os.makedirs(self.detect_dir)

    def get(self):
        data = []
        users = User.query.all()
        for user in users:
            images = user.images
            user = user.to_json()
            user['images'] = []
            for image in images:
                boxes = image.boxes
                image = image.to_json()
                image['boxes'] = [box.to_json() for box in boxes]
                image['user'] = user
                data.append(image)

        response_object = {
            'status': 'success',
            'data': data
        }

        return response_object, 200

    def post(self, auth_resp):
        response_object = {
            'status': 'fail',
            'message': 'Invalid data!'
        }

        user = User.query.filter_by(id=auth_resp).first()
        if not user:
            return jsonify(response_object), 401
        if request.form['image_url'] == '' and len(request.files) == 0:
            return jsonify(response_object), 400

        if 'image_file' in request.files.keys():
            upload_img = request.files['image_file']
            filename = (datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S') +
                        upload_img.filename)
            filename = sha256(filename.encode()).hexdigest() + '.jpg'
            img_path = os.path.join(self.upload_dir, filename)
            upload_img.save(img_path)
        else:
            response = requests.get(request.form['image_url'])
            if response.status_code == 200:
                filename = (
                    datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S') +
                    request.form['image_url'])
                filename = sha256(filename.encode()).hexdigest() + '.jpg'
                img_path = os.path.join(self.upload_dir, filename)
                with open(img_path, 'wb') as f:
                    f.write(response.content)

        detect_img, boxes, scores, names = predict_one_image_from_path(
            img_path, ssd, current_app.config['ARCH'])

        try:
            img = Image(
                name=filename,
                is_private=request.form.get('is_private') is not None,
                user=user)
            db.session.add(img)
            for i in range(len(boxes)):
                db.session.add(Box(
                    label=idx_to_name[names[i] - 1],
                    x_min=float(boxes[i][0]),
                    y_min=float(boxes[i][1]),
                    x_max=float(boxes[i][2]),
                    y_max=float(boxes[i][3]),
                    image=img))
            db.session.commit()
            self.visualizer.save_image(detect_img, boxes, names, filename)
            response_object['status'] = 'success'
            response_object['message'] = 'Successfully uploaded.'
            return response_object, 201
        except exc.IntegrityError:
            db.session.rollback()
            return response_object, 400


image_api.add_resource(ImagesList, '/api/images/')
