import tensorflow as tf
import os
import sys
import numpy as np
import yaml
from tqdm import tqdm
from PIL import Image

from .anchor import generate_default_boxes
from .box_utils import decode, compute_nms
from .image_utils import ImageVisualizer


os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

NUM_CLASSES = 21
BATCH_SIZE = 1


idx_to_name = [
    'aeroplane', 'bicycle', 'bird', 'boat',
    'bottle', 'bus', 'car', 'cat', 'chair',
    'cow', 'diningtable', 'dog', 'horse',
    'motorbike', 'person', 'pottedplant',
    'sheep', 'sofa', 'train', 'tvmonitor']


with open('./ssd_tf2/config.yml') as f:
    cfg = yaml.load(f)

try:
    config = cfg[os.getenv('ARCH').upper()]
except AttributeError:
    raise ValueError('Unknown architecture: {}'.format(args.arch))


def predict_one_image_from_path(img_path, ssd, arch):
    default_boxes = generate_default_boxes(config)

    original_image = Image.open(img_path)
    original_size = original_image.size

    if arch.lower() == 'ssd300':
        img_size = 300
    else:
        img_size = 512

    img = np.array(original_image.resize(
        (img_size, img_size)), dtype=np.float32)
    img = (img / 127.0) - 1.0
    img = tf.constant(img, dtype=tf.float32)
    img = tf.expand_dims(img, 0)

    confs, locs = ssd(img)

    confs = tf.squeeze(confs, 0)
    locs = tf.squeeze(locs, 0)

    confs = tf.math.softmax(confs, axis=-1)
    classes = tf.math.argmax(confs, axis=-1)
    scores = tf.math.reduce_max(confs, axis=-1)

    boxes = decode(default_boxes, locs)

    out_boxes = []
    out_labels = []
    out_scores = []

    for c in range(1, NUM_CLASSES):
        cls_scores = confs[:, c]

        score_idx = cls_scores > 0.6
        # cls_boxes = tf.boolean_mask(boxes, score_idx)
        # cls_scores = tf.boolean_mask(cls_scores, score_idx)
        cls_boxes = boxes[score_idx]
        cls_scores = cls_scores[score_idx]

        nms_idx = compute_nms(cls_boxes, cls_scores, 0.45, 200)
        cls_boxes = tf.gather(cls_boxes, nms_idx)
        cls_scores = tf.gather(cls_scores, nms_idx)
        cls_labels = [c] * cls_boxes.shape[0]

        out_boxes.append(cls_boxes)
        out_labels.extend(cls_labels)
        out_scores.append(cls_scores)

    out_boxes = tf.concat(out_boxes, axis=0)
    out_scores = tf.concat(out_scores, axis=0)

    boxes = tf.clip_by_value(out_boxes, 0.0, 1.0).numpy()
    classes = np.array(out_labels)
    scores = out_scores.numpy()

    img = img[0].numpy() + 1.0
    img *= 127
    img = img.astype(np.uint8)

    boxes *= (original_size * 2) #img.shape[0]

    return original_image, original_size, boxes, scores, classes
