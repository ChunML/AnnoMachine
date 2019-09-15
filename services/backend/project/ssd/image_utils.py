import os
import cv2


class ImageVisualizer(object):
    """ Class for visualizing image

    Attributes:
        idx_to_name: list to convert integer to string label
        class_colors: colors for drawing boxes and labels
        save_dir: directory to store images
    """
    def __init__(self, idx_to_name, class_colors=None, save_dir=None):
        self.idx_to_name = idx_to_name
        if class_colors is None or len(class_colors) != len(self.idx_to_name):
            self.class_colors = [[0, 255, 0]] * len(self.idx_to_name)
        else:
            self.class_colors = class_colors

        if save_dir is None:
            self.save_dir = './'
        else:
            self.save_dir = save_dir

    def save_image(self, img, boxes, labels, name):
        """ Method to draw boxes and labels
            then save to dir

        Args:
            img: numpy array (3, width, height)
            boxes: numpy array (num_boxes, 4)
            labels: numpy array (num_boxes)
            name: name of image to be saved
        """
        save_path = os.path.join(self.save_dir, name)
        if len(boxes) == 0:
            cv2.imwrite(save_path, img)
            return

        for i, box in enumerate(boxes):
            idx = labels[i] - 1
            cls_name = self.idx_to_name[idx]
            top_left = (box[0], box[1])
            bot_right = (box[2], box[3])
            cv2.rectangle(
                img, top_left, bot_right,
                color=self.class_colors[idx], thickness=2)
            cv2.putText(
                img, cls_name,
                top_left,
                fontFace=cv2.FONT_HERSHEY_DUPLEX,
                fontScale=0.7, color=self.class_colors[idx])
            cv2.imwrite(save_path, img)
