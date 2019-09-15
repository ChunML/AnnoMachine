import torch
import torch.nn as nn
from torchvision import models
from layers import create_vgg16_layers

vgg = models.vgg16(pretrained=True)
new_vgg = nn.ModuleList(create_vgg16_layers())

for i, m in enumerate(vgg.features):
    if isinstance(m, nn.Conv2d):
        new_vgg[i].weight.data = m.weight.clone().detach()


conv6_weight = vgg.classifier[0].weight.detach()
conv7_weight = vgg.classifier[3].weight.detach()

conv6_weight = conv6_weight.view(-1)
conv6_weight = conv6_weight[:512*1024*3*3]
conv6_weight = conv6_weight.view(1024, 512, 3, 3)
print(conv6_weight.size())

conv7_weight = conv7_weight.view(-1)
conv7_weight = conv7_weight[:1024*1024*1*1]
conv7_weight = conv7_weight.view(1024, 1024, 1, 1)
print(conv7_weight.size())

new_vgg[31].weight.data = conv6_weight.clone()
new_vgg[33].weight.data = conv7_weight.clone()

torch.save(new_vgg.state_dict(), 'weights/new_vgg.pth')