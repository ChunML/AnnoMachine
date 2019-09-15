import itertools
import math
import torch


def generate_default_boxes(config):
    """ Generate default boxes for all feature maps

    Args:
        config: information of feature maps
            scales: boxes' size relative to image's size
            fm_sizes: sizes of feature maps
            ratios: box ratios used in each feature maps

    Returns:
        default_boxes: Torch tensor of shape (num_default, 4)
                       with format (cx, cy, w, h)
    """
    default_boxes = []
    scales = config['scales']
    fm_sizes = config['fm_sizes']
    ratios = config['ratios']

    for m, fm_size in enumerate(fm_sizes):
        for i, j in itertools.product(range(fm_size), repeat=2):
            cx = (j + 0.5) / fm_size
            cy = (i + 0.5) / fm_size
            default_boxes.append([
                cx,
                cy,
                scales[m],
                scales[m]
            ])

            default_boxes.append([
                cx,
                cy,
                math.sqrt(scales[m] * scales[m + 1]),
                math.sqrt(scales[m] * scales[m + 1])
            ])

            for ratio in ratios[m]:
                r = math.sqrt(ratio)
                default_boxes.append([
                    cx,
                    cy,
                    scales[m] * r,
                    scales[m] / r
                ])

                default_boxes.append([
                    cx,
                    cy,
                    scales[m] / r,
                    scales[m] * r
                ])

    default_boxes = torch.tensor(default_boxes)
    default_boxes = torch.clamp(default_boxes, min=0.0, max=1.0)

    return default_boxes


if __name__ == '__main__':
    config = {
        'scales': [0.1, 0.2, 0.37, 0.54, 0.71, 0.88, 1.05],
        'fm_sizes': [38, 19, 10, 5, 3, 1],
        'ratios': [(2,), (2, 3), (2, 3), (2, 3), (2,), (2,)]
    }

    import functools

    # Each feature map's point has
    # 2 default boxes of ratio 1:1 +
    # 2 * len(ratio) default boxes
    # Total: fm_size ^ 2 * (2 * len(ratio) + 2)
    num_default_boxes = functools.reduce(
        lambda x, y: x + y[0] * y[0] * (2 * len(y[1]) + 2),
        zip(config['fm_sizes'], config['ratios']), 0)
    print('Total number of default boxes:', num_default_boxes)

    default_boxes = generate_default_boxes(config)

    assert default_boxes.size() == torch.Size([num_default_boxes, 4])