import torch
import torch.nn.functional as F


def hard_negative_mining(loss, gt_confs, neg_ratio):
    """ Hard negative mining algorithm
        to pick up negative examples for back-propagation
        base on classification loss values

    Args:
        loss: list of classification losses of all default boxes (B, num_default)
        gt_confs: classification targets (B, num_default)
        neg_ratio: negative / positive ratio

    Returns:
        conf_loss: classification loss
        loc_loss: regression loss
    """
    # loss: B x N
    # gt_confs: B x N
    pos_idx = gt_confs > 0
    num_pos = pos_idx.long().sum(dim=1, keepdim=True)
    num_neg = num_pos * neg_ratio

    loss[pos_idx] = -1e9
    rank = loss.argsort(dim=1, descending=True).argsort(dim=1)
    neg_idx = rank < num_neg

    return pos_idx, neg_idx


class SSDLosses(object):
    """ Class for SSD Losses

    Attributes:
        neg_ratio: negative / positive ratio
        num_classes: number of classes
    """
    def __init__(self, neg_ratio, num_classes):
        self.neg_ratio = neg_ratio
        self.num_classes = num_classes

    def __call__(self, confs, locs, gt_confs, gt_locs):
        """ Compute losses for SSD
            regression loss: smooth L1
            classification loss: cross entropy

        Args:
            confs: outputs of classification heads (B, num_default, num_classes)
            locs: outputs of regression heads (B, num_default, 4)
            gt_confs: classification targets (B, num_default)
            gt_locs: regression targets (B, num_default, 4)

        Returns:
            conf_loss: classification loss
            loc_loss: regression loss
        """
        with torch.no_grad():
            batch_size = confs.size(0)
            # compute classification losses
            # without reduction
            temp_loss = F.cross_entropy(
                confs.view(-1, self.num_classes),
                gt_confs.view(-1),
                reduction='none')
            temp_loss = temp_loss.view(batch_size, -1)
            pos_idx, neg_idx = hard_negative_mining(temp_loss, gt_confs, self.neg_ratio)

        # classification loss will consist of positive and negative examples
        confs = confs[pos_idx | neg_idx, :].view(-1, self.num_classes)
        gt_confs = gt_confs[pos_idx | neg_idx]
        conf_loss = F.cross_entropy(
            confs, gt_confs,
            reduction='sum')

        # regression loss only consist of positive examples
        locs = locs[pos_idx, :].view(-1, 4)
        gt_locs = gt_locs[pos_idx, :].view(-1, 4)
        loc_loss = F.smooth_l1_loss(locs, gt_locs, reduction='sum')

        num_pos = locs.size(0)

        conf_loss = conf_loss / num_pos
        loc_loss = loc_loss / num_pos

        return conf_loss, loc_loss


def create_loss(neg_ratio, num_classes):
    criterion = SSDLosses(neg_ratio, num_classes)

    return criterion
