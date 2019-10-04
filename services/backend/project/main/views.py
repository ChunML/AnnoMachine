from . import main_blueprint as main
from flask import render_template, request, current_app, send_from_directory, redirect, url_for
import os
import cv2
from project import ssd, db
from ssd_tf2.test import predict_one_image_from_path, idx_to_name
from project.models import User, Image, Box
import numpy as np
import requests
from sqlalchemy import exc


@main.route('/', methods=['GET', 'POST'])
def index():
    user = User.query.filter_by(username='chun').first()
    filenames = []
    upload_dir = current_app.config['UPLOAD_FOLDER']
    result_dir = current_app.config['DETECT_FOLDER']
    if not os.path.exists(upload_dir):
        os.mkdir(upload_dir)
    if not os.path.exists(result_dir):
        os.mkdir(result_dir)
    if request.method == 'POST':
        if request.form['image_url'] == '' and request.files['image_file'].filename == '':
            return redirect(url_for('.index'))

        if request.files['image_file'].filename != '':
            upload_img = request.files['image_file']
            filename = upload_img.filename
            img_path = os.path.join(upload_dir, filename)
            upload_img.save(img_path)
        else:
            response = requests.get(request.form['image_url'])
            if response.status_code == 200:
                filename = 'test_img.jpg'
                img_path = os.path.join(upload_dir, filename)
                with open(img_path, 'wb') as f:
                    f.write(response.content)

        detect_img, boxes, scores, names = predict_one_image_from_path(
            img_path, ssd)

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
            cv2.imwrite(os.path.join(result_dir, filename), detect_img)
        except exc.IntegrityError:
            db.session.rollback()

    filenames = os.listdir(result_dir)
    images = Image.query.filter_by(is_private=False).all()

    return render_template('index.html', images=images)


@main.route('/<image_type>/<filename>')
def image_link(image_type, filename):
    if image_type == 'uploads':
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER'],
            filename)
    return send_from_directory(
        current_app.config['DETECT_FOLDER'],
        filename)
