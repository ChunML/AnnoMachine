import torch
import torch.nn as nn
from .layers import create_vgg16_layers, create_extra_layers, create_conf_head_layers, create_loc_head_layers


class SSD(nn.Module):
    """ Class for SSD model

    Attributes:
        num_classes: number of classes
        arch: network architecture, either ssd300 or ssd512
    """

    def __init__(self, num_classes, arch='ssd300'):
        super(SSD, self).__init__()
        self.num_classes = num_classes
        vgg16_layers = create_vgg16_layers()
        extra_layers = create_extra_layers()
        conf_head_layers = create_conf_head_layers(num_classes)
        loc_head_layers = create_loc_head_layers()

        if arch == 'ssd300':
            # Delete the 12th block
            # if the architecture is SSD300
            extra_layers.pop(-1)
            conf_head_layers.pop(-2)
            loc_head_layers.pop(-2)

        self.vgg16_layers = nn.ModuleList(vgg16_layers)
        self.batch_norm = nn.BatchNorm2d(512)
        self.extra_layers = nn.ModuleList(extra_layers)
        self.conf_head_layers = nn.ModuleList(
            conf_head_layers)
        self.loc_head_layers = nn.ModuleList(loc_head_layers)

    def compute_heads(self, x, idx):
        """ Compute outputs of classification and regression heads

        Args:
            x: the input feature map
            idx: index of the head layer

        Returns:
            conf: output of the idx-th classification head
            loc: output of the idx-th regression head
        """
        conf = self.conf_head_layers[idx](x)
        conf = conf.permute(0, 2, 3, 1).contiguous()
        conf = conf.view(conf.size(0), -1, self.num_classes)

        loc = self.loc_head_layers[idx](x)
        loc = loc.permute(0, 2, 3, 1).contiguous()
        loc = loc.view(loc.size(0), -1, 4)

        return conf, loc

    def init_from_scratch(self):
        """ Initialize the whole SSD model from scratch
            using xavier initializer
        """
        self.vgg16_layers.apply(_xavier_init)
        self.batch_norm.apply(_xavier_init)
        self.extra_layers.apply(_xavier_init)
        self.conf_head_layers.apply(_xavier_init)
        self.loc_head_layers.apply(_xavier_init)

    def init_vgg16(self, weight_path):
        """ Initialize the VGG16 layers from pretrained weights
            and the rest from scratch using xavier initializer
        """
        self.vgg16_layers.load_state_dict(torch.load(weight_path))
        self.batch_norm.apply(_xavier_init)
        self.extra_layers.apply(_xavier_init)
        self.conf_head_layers.apply(_xavier_init)
        self.loc_head_layers.apply(_xavier_init)

    def forward(self, x):
        """ The forward pass

        Args:
            x: the input image

        Returns:
            confs: list of outputs of all classification heads
            locs: list of outputs of all regression heads
        """
        confs = []
        locs = []
        head_idx = 0

        for layer in self.vgg16_layers[:23]:
            x = layer(x)

        conf, loc = self.compute_heads(self.batch_norm(x), head_idx)

        confs.append(conf)
        locs.append(loc)
        head_idx += 1

        for layer in self.vgg16_layers[23:]:
            x = layer(x)

        conf, loc = self.compute_heads(x, head_idx)

        confs.append(conf)
        locs.append(loc)
        head_idx += 1

        for layer in self.extra_layers:
            x = layer(x)
            conf, loc = self.compute_heads(x, head_idx)
            confs.append(conf)
            locs.append(loc)
            head_idx += 1

        confs = torch.cat(confs, dim=1)
        locs = torch.cat(locs, dim=1)

        return confs, locs


def _xavier_init(m):
    if isinstance(m, nn.Conv2d):
        nn.init.xavier_uniform_(m.weight)


def create_ssd(num_classes, arch, pretrained_type=None, weight_path=None):
    """ Create SSD model and load pretrained weights

    Args:
        num_classes: number of classes
        arch: network architecture, either ssd300 or ssd512
        pretrained_type: type of pretrained weights, can be either 'VGG16' or 'ssd'
        weight_path: path to pretrained weights

    Returns:
        net: the SSD model
    """
    net = SSD(num_classes, arch)

    if pretrained_type is None:
        net.init_from_scratch()

        return net

    if weight_path is None:
        raise ValueError(
            'Weight path must be specified if pretrained_type is not None')

    if pretrained_type == 'base':
        net.init_vgg16(weight_path)
    elif pretrained_type == 'ssd':
        net.load_state_dict(torch.load(weight_path, map_location=torch.device('cpu')))
    else:
        raise ValueError('Unknown pretrained type: {}'.format(pretrained_type))

    return net


if __name__ == '__main__':
    NUM_CLASSES = 21
    ssd = create_ssd(NUM_CLASSES, 'ssd300', 'base',
                     '../new-ssd/weights/vgg16_reducedfc.pth')

    x = torch.randn(1, 3, 300, 300)
    out_confs, out_locs = ssd(x)
    print('Output confs shape:', out_confs.size())
    print('Output locs shape:', out_locs.size())

    assert out_confs.size() == torch.Size([1, 8732, NUM_CLASSES])
    assert out_locs.size() == torch.Size([1, 8732, 4])
