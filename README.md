# Steps to setup the sample envoy reverse proxy configuration

- Setup the environment variables
`source .env`

- Create an image for a test ubuntu container
`docker image build -f ubuntu.dockerfile -t local/ubuntu:20.04 .`

- Pull the nodejs application image
`docker image pull nodejs`
- Pull the envoy docker image
`docker image pull envoyproxy/envoy`
- Setup a docker network
`docker network create -d bridge --subnet=172.28.0.0/16 --gateway=172.28.0.1 ${DOCKER_NETWORK}`

- Create the nodejs container
```bash
docker container create \
    --name q-node-app-01 \
    -e PORT=80 \
    -e NODE_NAME=node-1 \
    --ip 172.28.1.10 \
    --hostname node-app-01 \
    --network ${DOCKER_NETWORK} \
    nodejs

docker container create \
    --name q-node-app-02 \
    -e PORT=80 \
    -e NODE_NAME=node-2 \
    --ip 172.28.1.11 \
    --hostname node-app-02 \
    --network ${DOCKER_NETWORK} \
    nodejs


docker cp ./node/server.js q-node-app-01:/usr/src/app/server.js
docker cp ./node/server.js q-node-app-02:/usr/src/app/server.js


# start the node-app container
docker container start q-node-app-01
docker container start q-node-app-02

# to check the logs of the container
docker logs q-node-app-01

# to login into the running node-app container
docker exec -it q-node-app-01 /bin/sh

# to remove the container
docker container stop q-node-app-01
docker container rm q-node-app-01
s
```
- To test if the app is running fine

```bash
docker image pull ubuntu:20.04

docker container run -it --rm \
    --name q-ubuntu-test-01 \
    --network ${DOCKER_NETWORK} \
    local/ubuntu:20.04 /bin/bash

```

- Create the envoy container
```bash
# create the container
docker container create \
    --name q-envoyproxy-03 \
    --hostname envoy3 \
    --network ${DOCKER_NETWORK} \
    -p 8080:80 \
    envoyproxy/envoy:${ENVOY_VERSION} -c /envoy-3.yaml

# copy the envoy configuration file
docker cp ./envoy-config/envoy.yaml q-envoyproxy-01:/envoy.yaml

docker cp ./envoy-config/envoy-3.yaml q-envoyproxy-03:/envoy-3.yaml

docker start q-envoyproxy-01





```

docker container run --rm \
    --name q-envoyproxy-03 \
    --hostname envoy3 \
    --network ${DOCKER_NETWORK} \
    -v $(pwd)/envoy-config/envoy-3.yaml:/envoy-3.yaml \
    -p 8080:80 \
    -p 9090:443 \
    envoyproxy/envoy:${ENVOY_VERSION} \
    -c /envoy-3.yaml --log-level debug