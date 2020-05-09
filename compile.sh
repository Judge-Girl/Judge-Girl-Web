sudo DOCKER_BUILDKIT=1 docker build . -t judge-k8s-web-compile -f Dockerfile-compile
sudo docker run --rm  -v $(pwd):/usr/src/app  -v $(pwd)/dist:/usr/src/app/dist judge-k8s-web-compile
