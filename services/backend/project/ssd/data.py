import torch
from torch.utils.data import Dataset, DataLoader
import os
import cv2
import numpy as np
import xml.etree.ElementTree as ET
from box_utils import compute_target
from image_utils import ImageVisualizer


class VOCDataset(Dataset):
    """ Class for VOC Dataset

    Attributes:
        root_dir: dataset root dir (ex: ./data/VOCdevkit)
        year: dataset's year (2007 or 2012)
        num_examples: number of examples to be used
                      (in case one wants to overfit small data)
    """
    def __init__(self, root_dir, year,
                 new_size, default_boxes,
                 augmentation,
                 num_examples=-1):
        super(VOCDataset, self).__init__()
        self.idx_to_name = [
            'aeroplane', 'bicycle', 'bird', 'boat',
            'bottle', 'bus', 'car', 'cat', 'chair',
            'cow', 'diningtable', 'dog', 'horse',
            'motorbike', 'person', 'pottedplant',
            'sheep', 'sofa', 'train', 'tvmonitor']
        self.name_to_idx = dict([(v, k)
                                 for k, v in enumerate(self.idx_to_name)])

        self.data_dir = os.path.join(root_dir, 'VOC{}'.format(year))
        self.image_dir = os.path.join(self.data_dir, 'JPEGImages')
        self.anno_dir = os.path.join(self.data_dir, 'Annotations')
        self.ids = list(map(lambda x: x[:-4], os.listdir(self.image_dir)))

        self.new_size = new_size
        self.default_boxes = default_boxes
        self.augmentation = augmentation

        if num_examples != -1:
            self.ids = self.ids[:num_examples]

    def __len__(self):
        return len(self.ids)

    def _get_image(self, index):
        """ Method to read image from file
            then resize to (300, 300)
            then subtract by ImageNet's mean
            then convert to Torch Tensor

        Args:
            index: the index to get filename from self.ids

        Returns:
            img: Torch tensor of shape (3, 300, 300)
        """
        filename = self.ids[index]
        img_path = os.path.join(self.image_dir, filename + '.jpg')
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
        orig_shape = img.shape

        img = cv2.resize(
            img, (self.new_size, self.new_size))
        img -= [123, 117, 104]
        return torch.from_numpy(img).permute(2, 0, 1), orig_shape

    def _get_annotation(self, index, orig_shape):
        """ Method to read annotation from file
            Boxes are normalized to image size
            Integer labels are increased by 1

        Args:
            index: the index to get filename from self.ids
            orig_shape: image's original shape

        Returns:
            boxes: numpy array of shape (num_gt, 4)
            labels: numpy array of shape (num_gt,)
        """
        h, w, _ = orig_shape
        filename = self.ids[index]
        anno_path = os.path.join(self.anno_dir, filename + '.xml')
        objects = ET.parse(anno_path).findall('object')
        boxes = []
        labels = []

        for obj in objects:
            name = obj.find('name').text.lower().strip()
            bndbox = obj.find('bndbox')
            xmin = (float(bndbox.find('xmin').text) - 1) / w
            ymin = (float(bndbox.find('ymin').text) - 1) / h
            xmax = (float(bndbox.find('xmax').text) - 1) / w
            ymax = (float(bndbox.find('ymax').text) - 1) / h
            boxes.append([xmin, ymin, xmax, ymax])

            labels.append(self.name_to_idx[name] + 1)

        return np.array(boxes, dtype=np.float32), np.array(labels, dtype=np.int64)

    def _random_flip(self, img, boxes):
        if np.random.rand() > 0.5:
            return self._random_horizontal_flip(img, boxes)
        else:
            return self._random_vertical_flip(img, boxes)

    def _random_vertical_flip(self, img, boxes):
        img = torch.flip(img, [1])
        xmin = boxes[:, 1].clone()
        boxes[:, 1] = 1 - boxes[:, 3]
        boxes[:, 3] = 1 - xmin

        return img, boxes

    def _random_horizontal_flip(self, img, boxes):
        img = torch.flip(img, [2])
        xmin = boxes[:, 0].clone()
        boxes[:, 0] = 1 - boxes[:, 2]
        boxes[:, 2] = 1 - xmin

        return img, boxes

    def __getitem__(self, index):
        """ The __getitem__ method
            so that the object can be iterable

        Args:
            index: the index to get filename from self.ids

        Returns:
            img: Torch tensor of shape (3, 300, 300)
            boxes: Torch tensor of shape (num_gt, 4)
            labels: Torch tensor of shape (num_gt,)
        """
        img, orig_shape = self._get_image(index)
        boxes, labels = self._get_annotation(index, orig_shape)
        boxes = torch.from_numpy(boxes)
        labels = torch.from_numpy(labels)

        if self.augmentation:
            if np.random.rand() > 0.5:
                img, boxes = self._random_flip(img, boxes)

        gt_confs, gt_locs = compute_target(self.default_boxes, boxes, labels)

        return img, gt_confs, gt_locs


def create_dataloader(root_dir, batch_size,
                      image_size, default_boxes,
                      augmentation=False,
                      num_examples=-1):
    """ Create a DataLoader object
        to iterate throughout the dataset

    Args:
        root_dir: root dir to the dataset
        batch_size: batch size
        num_examples: number of examples to use

    Returns:
        dataloader: an instance of DataLoader
    """
    dataset = VOCDataset('./data/VOCdevkit', '2007',
                         image_size, default_boxes,
                         augmentation, num_examples)
    dataloader = DataLoader(dataset,
                            batch_size=batch_size,
                            shuffle=True)

    info = {
        'idx_to_name': dataset.idx_to_name,
        'name_to_idx': dataset.name_to_idx,
        'num_classes': len(dataset.idx_to_name)
    }

    return dataloader, info


if __name__ == '__main__':
    default_boxes = torch.rand(8732, 4)
    dataloader, info = create_dataloader('./data/VOCdevkit', 1, default_boxes)
    data = next(iter(dataloader))

    idx_to_name = info['idx_to_name']

    # Confirm data shapes
    print([x.shape for x in data])

    img, boxes, labels = data
    # Eliminate the batch dimension
    img = img.squeeze(0)
    boxes = boxes.squeeze(0)
    labels = labels.squeeze(0)

    # Reverse image processing step
    img = img.permute(1, 2, 0).contiguous().numpy()
    img += [123, 117, 104]
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Scale boxes back to image size
    boxes = boxes.numpy() * 300
    labels = labels.numpy()

    visualizer = ImageVisualizer(idx_to_name)
    visualizer.save_image(img, boxes, labels, 'test.jpg')
