FROM python:3.7.4-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python-opencv netcat

COPY requirements.txt /usr/src/app

RUN pip install -r requirements.txt

COPY entrypoint.sh /usr/src/app
RUN chmod +x entrypoint.sh

COPY . /usr/src/app

CMD ["./entrypoint.sh"]