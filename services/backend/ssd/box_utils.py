import torch


def compute_area(top_left, bot_right):
    """ Compute area given top_left and bottom_right coordinates

    Args:
        top_left: Torch tensor (num_boxes, 2)
        bot_right: Torch tensor (num_boxes, 2)

    Returns:
        area: Torch tensor (num_boxes,)
    """
    # top_left: N x 2
    # bot_right: N x 2
    hw = torch.clamp(bot_right - top_left, min=0.0)
    area = hw[..., 0] * hw[..., 1]

    return area


def compute_iou(boxes_a, boxes_b):
    """ Compute overlap between boxes_a and boxes_b

    Args:
        boxes_a: Torch tensor (num_boxes_a, 4)
        boxes_b: Torch tensor (num_boxes_b, 4)

    Returns:
        overlap: Torch tensor (num_boxes_a, num_boxes_b)
    """
    # boxes_a => num_boxes_a, 1, 4
    boxes_a = boxes_a.unsqueeze(1)

    # boxes_b => 1, num_boxes_b, 4
    boxes_b = boxes_b.unsqueeze(0)
    top_left = torch.max(boxes_a[..., :2], boxes_b[..., :2])
    bot_right = torch.min(boxes_a[..., 2:], boxes_b[..., 2:])

    overlap_area = compute_area(top_left, bot_right)
    area_a = compute_area(boxes_a[..., :2], boxes_a[..., 2:])
    area_b = compute_area(boxes_b[..., :2], boxes_b[..., 2:])

    overlap = overlap_area / (area_a + area_b - overlap_area)

    return overlap


def compute_target(default_boxes, gt_boxes, gt_labels, iou_threshold=0.5):
    """ Compute regression and classification targets

    Args:
        default_boxes: Torch tensor (num_default, 4)
                       of format (cx, cy, w, h)
        gt_boxes: Torch tensor (num_gt, 4)
                  of format (xmin, ymin, xmax, ymax)
        gt_labels: Torch tensor (num_gt,)

    Returns:
        gt_confs: classification targets, Torch tensor (num_default,)
        gt_locs: regression targets, Torch tensor (num_default, 4)
    """
    # Convert default boxes to format (xmin, ymin, xmax, ymax)
    # in order to compute overlap with gt boxes
    transformed_default_boxes = transform_center_to_corner(default_boxes)
    iou = compute_iou(transformed_default_boxes, gt_boxes)
    best_gt_iou, best_gt_idx = iou.max(1)
    best_default_iou, best_default_idx = iou.max(0)

    for gt_idx, default_idx in enumerate(best_default_idx):
        best_gt_idx[default_idx] = gt_idx

    best_gt_iou.index_fill_(0, best_default_idx, 2)

    gt_confs = gt_labels[best_gt_idx]
    gt_confs[best_gt_iou < iou_threshold] = 0
    gt_boxes = gt_boxes[best_gt_idx]

    gt_locs = encode(default_boxes, gt_boxes)

    return gt_confs, gt_locs


def encode(default_boxes, boxes, variance=[0.1, 0.2]):
    """ Compute regression values

    Args:
        default_boxes: Torch tensor (num_default, 4)
                       of format (cx, cy, w, h)
        boxes: Torch tensor (num_default, 4)
               of format (xmin, ymin, xmax, ymax)
        variance: variance for center point and size

    Returns:
        locs: regression values, Torch tensor (num_default, 4)
    """
    # Convert boxes to (cx, cy, w, h) format
    transformed_boxes = transform_corner_to_center(boxes)

    locs = torch.cat([
        (transformed_boxes[..., :2] - default_boxes[:, :2]
         ) / (default_boxes[:, 2:] * variance[0]),
        torch.log(transformed_boxes[..., 2:] / default_boxes[:, 2:]) / variance[1]], dim=-1)

    return locs


def decode(default_boxes, locs, variance=[0.1, 0.2]):
    """ Decode regression values back to coordinates

    Args:
        default_boxes: Torch tensor (num_default, 4)
                       of format (cx, cy, w, h)
        locs: Torch tensor (batch_size, num_default, 4)
              of format (cx, cy, w, h)
        variance: variance for center point and size

    Returns:
        boxes: Torch tensor (num_default, 4)
               of format (xmin, ymin, xmax, ymax)
    """
    locs = torch.cat([
        locs[..., :2] * variance[0] * default_boxes[:, 2:] + default_boxes[:, :2],
        torch.exp(locs[..., 2:] * variance[1]) * default_boxes[:, 2:]], dim=-1)

    boxes = transform_center_to_corner(locs)

    return boxes


def transform_corner_to_center(boxes):
    """ Transform boxes of format (xmin, ymin, xmax, ymax)
        to format (cx, cy, w, h)

    Args:
        boxes: Torch tensor (num_boxes, 4)
               of format (xmin, ymin, xmax, ymax)

    Returns:
        boxes: Torch tensor (num_boxes, 4)
               of format (cx, cy, w, h)
    """
    center_box = torch.cat([
        (boxes[..., :2] + boxes[..., 2:]) / 2,
        boxes[..., 2:] - boxes[..., :2]], dim=-1)

    return center_box


def transform_center_to_corner(boxes):
    """ Transform boxes of format (cx, cy, w, h)
        to format (xmin, ymin, xmax, ymax)

    Args:
        boxes: Torch tensor (num_boxes, 4)
               of format (cx, cy, w, h)

    Returns:
        boxes: Torch tensor (num_boxes, 4)
               of format (xmin, ymin, xmax, ymax)
    """
    corner_box = torch.cat([
        boxes[..., :2] - boxes[..., 2:] / 2,
        boxes[..., :2] + boxes[..., 2:] / 2], dim=-1)

    return corner_box


def compute_nms(boxes, scores, nms_threshold, limit=200):
    """ Perform Non Maximum Suppression algorithm
        to eliminate boxes with high overlap

    Args:
        boxes: Torch tensor (num_boxes, 4)
               of format (xmin, ymin, xmax, ymax)
        scores: Torch tensor (num_boxes,)
        nms_threshold: NMS threshold
        limit: maximum number of boxes to keep

    Returns:
        idx: indices of kept boxes
    """
    if boxes.size(0) == 0:
        return []
    selected = [0]
    _, idx = scores.sort(descending=True)
    idx = idx[:limit]
    boxes = boxes[idx]

    iou = compute_iou(boxes, boxes)

    while True:
        row = iou[selected[-1]]
        next_indices = row <= nms_threshold
        iou[:, ~next_indices] = 1.0

        if next_indices.sum().item() == 0:
            break

        next_indices = next_indices.int()
        selected.append(next_indices.argsort(descending=True)[0].item())

    return idx[selected]
