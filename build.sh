#!/bin/bash

# 定义镜像名称
# shellcheck disable=SC2269
IMAGE_NAME="interview-web:latest"

# 检查镜像是否存在
if [ -n "$(docker images -q "${IMAGE_NAME}" 2>/dev/null)" ]; then
        echo "删除旧镜像: ${IMAGE_NAME}"
        docker rmi "${IMAGE_NAME}" 2>/dev/null || true
else
    echo "镜像 $IMAGE_NAME 不存在，无需删除"
fi
# 构建脚本
echo "开始构建 Docker 镜像..."

# 构建镜像
docker build -t $IMAGE_NAME .

echo "构建完成！"

echo "镜像构建完成，可以使用以下命令运行："
echo "docker run -d -p 8080:8080 --name interview-web $IMAGE_NAME"
echo "或者使用 docker-compose:"
echo "docker-compose up -d"
