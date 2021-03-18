DOCKER_BUILDKIT=1 docker build . -t judge-girl-web-compile -f Dockerfile-compile
docker run --rm  -v $(pwd):/usr/src/app  -v $(pwd)/dist:/usr/src/app/dist judge-girl-web-compile
