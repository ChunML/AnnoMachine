import torch
import torch.nn.functional as F
import numpy as np
from .image_utils import ImageVisualizer
from .anchor import generate_default_boxes
from .box_utils import decode, compute_nms
import cv2
import yaml


NUM_CLASSES = 21
MEAN = [123, 117, 104]

with open('./project/ssd/config.yaml', 'r') as f:
    cfg = yaml.load(f)
config = cfg['SSD300']

idx_to_name = ['aeroplane', 'bicycle', 'bird', 'boat',
               'bottle', 'bus', 'car', 'cat', 'chair',
               'cow', 'diningtable', 'dog', 'horse',
               'motorbike', 'person', 'pottedplant',
               'sheep', 'sofa', 'train', 'tvmonitor']

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def prepare_image(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
    img = cv2.resize(img, (300, 300))
    img -= [123, 117, 104]
    img = torch.from_numpy(img).permute(2, 0, 1)
    img = img.unsqueeze(0)

    return img


def reconstruct_image(img):
    """ Reconstruct processed image to export:
        1. Transpose from C, H, W to H, W, C
        2. Add back mean values
        3. Convert from RGB to BGR color

    Args:
        img: numpy array of shape (3, H, W)

    Returns:
        img: numpy array of shape (H, W, 3)
    """
    img = np.ascontiguousarray(img.transpose((1, 2, 0)))
    img += [123, 117, 104]
    img = img.astype(np.uint8)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return img


def test(ssd, img, default_boxes):
    """ Execute test on one image
        then perform NMS algorithm
        then rescale boxes back to normal size

    Args:
        ssd: trained SSD model
        img: Torch array of shape (1, 3, H, W)
        default_boxes: Torch array of shape (num_default, 4)

    Returns:
        img: numpy array of (3, H, W)
        all_boxes: final boxes, numpy array of (num_boxes, 4)
        all_scores: final scores, numpy array of (num_boxes,)
        all_names: final class names, numpy array of (num_boxes,)
    """
    img = img.to(device)
    default_boxes = default_boxes.to(device)
    with torch.no_grad():
        out_confs, out_locs = ssd(img)
    out_confs = out_confs.squeeze(0)
    out_locs = out_locs.squeeze(0)
    out_boxes = decode(default_boxes, out_locs)
    out_labels = F.softmax(out_confs, dim=1)

    all_boxes = []
    all_scores = []
    all_names = []

    for c in range(1, NUM_CLASSES):
        cls_scores = out_labels[:, c]
        score_idx = cls_scores > 0.6
        cls_boxes = out_boxes[score_idx]
        cls_scores = cls_scores[score_idx]

        box_idx = compute_nms(
            cls_boxes, cls_scores,
            0.45,
            200)

        cls_boxes = cls_boxes[box_idx]
        cls_scores = cls_scores[box_idx]
        cls_names = [c] * cls_boxes.size(0)

        all_boxes.append(cls_boxes)
        all_scores.append(cls_scores)
        all_names.extend(cls_names)

    all_boxes = torch.cat(all_boxes, dim=0)
    all_scores = torch.cat(all_scores, dim=0)

    img = img.squeeze(0).cpu().numpy()
    all_boxes *= img.shape[-1]
    all_boxes = all_boxes.cpu().numpy()
    all_scores = all_scores.cpu().numpy()
    all_names = np.array(all_names)

    return img, all_boxes, all_scores, all_names


def test_one_image(img_path, ssd, save_dir, filename):
    img = prepare_image(img_path)
    default_boxes = generate_default_boxes(config)

    ssd.to(device)
    ssd.eval()

    visualizer = ImageVisualizer(
        idx_to_name,
        save_dir=save_dir)

    img, boxes, scores, names = test(ssd, img, default_boxes)
    img = reconstruct_image(img)
    visualizer.save_image(img, boxes, names, filename)

    return boxes, scores, names
