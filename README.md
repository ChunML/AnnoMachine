## AnnoMachine

### What is AnnoMachine?
AnnoMachine is an application that aims to provide a user-friendly way to visualize and iteract with object detection results.

### Use Cases
Below are two main use cases of AnnoMachine:
- A photo sharing app with automatic tagging and object-based searching
- A smart annotation marker: get a first rough annotation => iteractively finetune & download the updated annotation

### Introduction Video
Here is the video illustrating the two use cases mentioned above:
[![AnnoMachine](https://raw.githubusercontent.com/ChunML/ChunML.github.io/master/images/projects/annomachine/annomachine.png)](https://youtu.be/NBO1acBqBlo)

### Development Tools:
Stack:
- Object detection model: SSD (implemented on Tensorflow 2)
- Backend: Flask
- Frontend: ReactJS
- Database: PostgreSQL
- Web server: Nginx

Unit test:
- Backend: Flask-Testing
- Frontend: Jest + Enzyme

Deployment:
- docker
- docker-compose
- docker-machine

### Preparation
Clone the repo:
```
git clone https://github.chunml/annomachine
cd annomachine
```

Download the pretrained weights (trained on VOC07+12 for 120 epochs):
[weights](https://drive.google.com/file/d/1atYMDyYvofuTjv_Q6QZQ8E0bRdL1exS-/view?usp=sharing)

Save the weights to ./services/backend/ssd_tf2/models:
```
mkdir -p ./services/backend/ssd_tf2/models
mv ssd_epoch_120.h5 ./services/backend/ssd_tf2/models
```

Make sure the unit tests are passed:
```
./test.sh
```

### Local deployment
What we need to do is to run the command below:
```
docker-compose up -d --build
```

Head to `localhost` and see the result!

### AWS deployment
- Create your own *Access Key ID* and *Secret Access Key* from AWS
- Create a new file called ~/.aws/credentials (a file, not a folder)
- Paste the below content (replace with your keys):
```
[default]
aws_access_key_id=<your_access_key_id>
aws_secret_access_key=<your_secret_access_key>
```
- Create a new machine via `docker-machine`
```
docker-machine create --driver amazonec2 --amazonec2-open-port 80 <your_machine_name>
```
This will take a while. After that, a new EC2 instance is created on AWS, using the credentials you created above.
- Check if the new machine is created properly:
```
docker-machine ls
```
- Activate the AWS machine:
```
eval $(docker-machine env <your_machine_name>)
```
It means that from now on, we are inside the environment of the AWS machine! What we're gonna see/do all happens within that environment.
- Check if we are actually in AWS machine's environment:
```
docker-machine ls
```
We should see an *asterisk* next to the machine's name. Let's take note the IP address.
- Make sure that there is nothing on there yet:
```
docker image ls
```
- Deploy onto the AWS machine
```
docker-compose -f docker-compose-prod.yml up -d --build
```
- Confirm that the deployment is successful:
Head to `<your_machine_IP>` and enjoy the result!