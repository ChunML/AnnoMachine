from . import main_blueprint as main
from flask import render_template, request, current_app, send_from_directory, redirect, url_for
import os
import torch
import cv2
from project import ssd, db
from project.ssd.test_one import test_one_image, idx_to_name
from project.models import Image, Box
import numpy as np
import requests


@main.route('/', methods=['GET', 'POST'])
def index():
    filenames = []
    upload_dir = current_app.config['UPLOAD_FOLDER']
    result_dir = current_app.config['DETECT_FOLDER']
    print(upload_dir)
    print(result_dir)
    if not os.path.exists(upload_dir):
        os.mkdir(upload_dir)
    if not os.path.exists(result_dir):
        os.mkdir(result_dir)
    if request.method == 'POST':
        if request.form['image_url'] == '' and request.files['image_file'].filename == '':
            return redirect(url_for('.index'))

        if request.files['image_file'].filename != '':
            img = request.files['image_file']
            filename = img.filename
            img_path = os.path.join(upload_dir, filename)
            img.save(img_path)
        else:
            response = requests.get(request.form['image_url'])
            if response.status_code == 200:
                filename = 'test_img.jpg'
                img_path = os.path.join(upload_dir, filename)
                with open(img_path, 'wb') as f:
                    f.write(response.content)

        boxes, scores, names = test_one_image(
            img_path, ssd, result_dir, filename)

        uploaded_filenames = os.listdir(upload_dir)
        img = Image(name=filename)
        db.session.add(img)
        for i in range(len(boxes)):
            db.session.add(Box(
                label=idx_to_name[names[i]],
                x_min=float(boxes[i][0]),
                y_min=float(boxes[i][1]),
                x_max=float(boxes[i][2]),
                y_max=float(boxes[i][3]),
                image=img))
        db.session.commit()

    filenames = os.listdir(result_dir)

    return render_template('index.html', filenames=filenames)


@main.route('/uploaded/<filename>')
def image_link(filename):
    # return send_file(
    #     # '/Users/chunml/workspace/ssd_flask/services/backend',
    #     os.path.join(
    #         current_app.config['DETECT_FOLDER'],
    #         filename),
    #     as_attachment=True, cache_timeout=-1)
    return send_from_directory(
        current_app.config['DETECT_FOLDER'],
        filename)
