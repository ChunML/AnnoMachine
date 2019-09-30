import torch
import torch.nn as nn


def create_vgg16_layers():
    """ Create layer list for VGG16
        cut before 5th maxpool layer
        because SSD use a different setting for that
    """
    vgg_layers = [
        nn.Conv2d(3, 64, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(64, 64, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.MaxPool2d(2, 2),

        nn.Conv2d(64, 128, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(128, 128, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.MaxPool2d(2, 2),

        nn.Conv2d(128, 256, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(256, 256, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(256, 256, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.MaxPool2d(2, 2, ceil_mode=True),

        nn.Conv2d(256, 512, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(512, 512, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(512, 512, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.MaxPool2d(2, 2),

        nn.Conv2d(512, 512, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(512, 512, 3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(512, 512, 3, padding=1),
        nn.ReLU(inplace=True),
    ]

    vgg_layers += [
        # Difference from original VGG16:
        # 5th maxpool layer has kernel size = 3 and stride = 1
        nn.MaxPool2d(3, stride=1, padding=1),
        # atrous conv2d for 6th block
        nn.Conv2d(512, 1024, kernel_size=3, padding=6, dilation=6),
        nn.ReLU(inplace=True),
        nn.Conv2d(1024, 1024, kernel_size=1),
        nn.ReLU(inplace=True),
    ]

    return vgg_layers


def create_extra_layers():
    """ Create extra layers
        8th to 11th blocks
    """
    extra_layers = [
        # 8th block output shape
        # SSD300: B, 512, 10, 10
        # SSD512: B, 512, 16, 16
        nn.Sequential(
            nn.Conv2d(1024, 256, kernel_size=1),
            nn.ReLU(),
            nn.Conv2d(256, 512, kernel_size=3, stride=2, padding=1),
            nn.ReLU()
        ),
        # 9th block output shape
        # SSD300: B, 256, 5, 5
        # SSD512: B, 256, 8, 8
        nn.Sequential(
            nn.Conv2d(512, 128, kernel_size=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1),
            nn.ReLU()
        ),
        # 10th block output shape
        # SSD300: B, 256, 3, 3
        # SSD512: B, 256, 4, 4
        nn.Sequential(
            nn.Conv2d(256, 128, kernel_size=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=3), #, stride=2, padding=1),
            nn.ReLU()
        ),
        # 11th block output shape
        # SSD300: B, 256, 1, 1
        # SSD512: B, 256, 2, 2
        nn.Sequential(
            nn.Conv2d(256, 128, kernel_size=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=3),
            nn.ReLU()
        ),
        # 12th block output shape
        # SSD512: B, 256, 1, 1
        nn.Sequential(
            nn.Conv2d(256, 128, kernel_size=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=4),
            nn.ReLU()
        )
    ]

    return extra_layers


def create_conf_head_layers(num_classes):
    """ Create layers for classification
    """
    conf_head_layers = [
        nn.Conv2d(512, 4 * num_classes, kernel_size=3, padding=1), # for 4th block
        nn.Conv2d(1024, 6 * num_classes, kernel_size=3, padding=1), # for 7th block
        nn.Conv2d(512, 6 * num_classes, kernel_size=3, padding=1), # for 8th block
        nn.Conv2d(256, 6 * num_classes, kernel_size=3, padding=1), # for 9th block
        nn.Conv2d(256, 4 * num_classes, kernel_size=3, padding=1), # for 10th block
        nn.Conv2d(256, 4 * num_classes, kernel_size=3, padding=1), # for 11th block
        nn.Conv2d(256, 4 * num_classes, kernel_size=1) # for 12th block
    ]

    return conf_head_layers


def create_loc_head_layers():
    """ Create layers for regression
    """
    loc_head_layers = [
        nn.Conv2d(512, 4 * 4, kernel_size=3, padding=1),
        nn.Conv2d(1024, 6 * 4, kernel_size=3, padding=1),
        nn.Conv2d(512, 6 * 4, kernel_size=3, padding=1),
        nn.Conv2d(256, 6 * 4, kernel_size=3, padding=1),
        nn.Conv2d(256, 4 * 4, kernel_size=3, padding=1),
        nn.Conv2d(256, 4 * 4, kernel_size=3, padding=1),
        nn.Conv2d(256, 4 * 4, kernel_size=1)
    ]

    return loc_head_layers
