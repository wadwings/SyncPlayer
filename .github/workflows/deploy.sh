docker pull wadwings/syncplaybackend
docker stop syncplaybackend
docker rm syncplaybackend
docker run --name syncplaybackend -d -p 8080:8080 wadwings/syncplaybackend
docker image prune -f
docker container prune -f