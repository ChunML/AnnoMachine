#!/bin/bash

fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

docker-compose up -d --build
docker-compose exec backend python manage.py test
inspect $? backend
docker-compose exec frontend yarn test --coverage --watchAll=false
inspect $? frontend
docker-compose down

if [ -n "${fails}" ]; then
  echo "Tests failed: ${fails}"
  exit 1
else
  echo "Test passed!"
  exit 0
fi