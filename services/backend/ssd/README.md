# SSD - Implementation in Pytorch

### Requirements
- Python 3.X
- Pytorch >1.0.0
- OpenCV
- numpy
- matplotlib
- CUDA (tested on CUDA 9, CUDA 10)
- cuDNN

### Generate pretrained weights for VGG16
```
python create_vgg16_weights.py
```

### Training
```
python train.py --help
usage: train.py [-h] [--data_dir DATA_DIR] [--augmentation AUGMENTATION]
                [--pretrained_path PRETRAINED_PATH] [--neg_ratio NEG_RATIO]
                [--lr LR] [--momentum MOMENTUM] [--weight_decay WEIGHT_DECAY]
                [--gamma GAMMA] [--arch ARCH] [--num_examples NUM_EXAMPLES]
                [--batch_size BATCH_SIZE] [--num_epochs NUM_EPOCHS]
                [--checkpoint_dir CHECKPOINT_DIR]

optional arguments:
  -h, --help            show this help message and exit
  --data_dir DATA_DIR   data root directory
  --augmentation AUGMENTATION
                        whether to perform augmentation of data
  --pretrained_path PRETRAINED_PATH
                        pretrained weight path
  --neg_ratio NEG_RATIO
                        negative examples ratio (used in hard negative mining
                        logic)
  --lr LR               initial learning rate
  --momentum MOMENTUM   momentum (used in SGD)
  --weight_decay WEIGHT_DECAY
                        weight decay (used in SGD)
  --gamma GAMMA         gamma (used in SGD)
  --arch ARCH           SSD architecture, can be either ssd300 or ssd512
  --num_examples NUM_EXAMPLES
                        number of examples to train
  --batch_size BATCH_SIZE
                        batch size
  --num_epochs NUM_EPOCHS
                        number of epochs to train
  --checkpoint_dir CHECKPOINT_DIR
                        directory to store training weights
```

Example 1: train SSD300 on 40 examples, batch_size=10 without augmentation using the pretrained weights generated above
```
python train.py --num_examples 40 --batch_size 10 --pretrained_path ./weights/new_vgg.pth --augmentation False
```

Example 2: train SSD512 on full dataset, batch_size=32 using the pretrained weights generated above on 120 epochs
```
python train.py --pretrained_path ./weights/new_vgg.pth --arch ssd512 --num_epochs 120
```

### Test
```
python test.py --help
usage: test.py [-h] [--data_dir DATA_DIR] [--arch ARCH]
               [--save_image_dir SAVE_IMAGE_DIR]
               [--pretrained_path PRETRAINED_PATH]
               [--num_examples NUM_EXAMPLES]
               [--max_num_boxes_per_class MAX_NUM_BOXES_PER_CLASS]
               [--score_thresh SCORE_THRESH] [--nms_thresh NMS_THRESH]
               [--batch_size BATCH_SIZE]

optional arguments:
  -h, --help            show this help message and exit
  --data_dir DATA_DIR   data root directory
  --arch ARCH           SSD architecture, can be either ssd300 or ssd512
  --save_image_dir SAVE_IMAGE_DIR
                        directory to save result images
  --pretrained_path PRETRAINED_PATH
                        pretrained weight path
  --num_examples NUM_EXAMPLES
                        number of examples to test
  --max_num_boxes_per_class MAX_NUM_BOXES_PER_CLASS
                        maximum number of objects per class (used in NMS
                        logic)
  --score_thresh SCORE_THRESH
                        score threshold
  --nms_thresh NMS_THRESH
                        NMS threshold
  --batch_size BATCH_SIZE
                        batch size
```

Example: test the SSD512 trained by the command above on full dataset
```
python test.py --pretrained_path ./models/ssd_epoch_120.pth --arch ssd512 --num_examples -1
```

### TODOs
- [ ] Random patching
- [ ] Random distortion
- [ ] VOC Evaluation
- [ ] OpenCV -> PIL for better font setting

### Paper
**SSD: Single Shot MultiBox Detector**

[[Paper]](https://arxiv.org/abs/1512.02325) [[Code]](https://github.com/weiliu89/caffe/tree/ssd)

### Reference
- [amdegroot's implementation](https://github.com/amdegroot/ssd.pytorch)
- [qfgaohao's implementation](https://github.com/qfgaohao/pytorch-ssd)
