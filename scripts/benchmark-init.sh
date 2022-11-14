#!/bin/zsh

container="$(docker ps --filter name='benchmark' --format='{{ .ID }}')"
if [ "$container" = "" ]; then
    echo "Creating container"
    container="$(docker run -d --rm --ipc=host --network=host --volume="$PWD":/srv -u $(id -u "${USER}"):$(id -g "${USER}") --name=benchmark --workdir=/srv les-petits-plats/node:latest)"
fi;
echo "container created with id $container!)}"

docker exec -it "$container" /srv/scripts/benchmark.sh
