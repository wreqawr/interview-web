#!/bin/bash

# 定义镜像名称
# shellcheck disable=SC2269
IMAGE_NAME="interview-web:latest"

# 检查镜像是否存在
if docker image inspect "$IMAGE_NAME" &> /dev/null; then
    echo "镜像 $IMAGE_NAME 存在，开始删除..."
    # 强制删除镜像（同时删除所有依赖容器）
    docker rmi -f "$IMAGE_NAME"
    # 检查删除结果
    # shellcheck disable=SC2181
    if [ $? -eq 0 ]; then
        echo "镜像 $IMAGE_NAME 已成功删除"
    else
        echo "删除镜像失败，请检查错误信息"
    fi
else
    echo "镜像 $IMAGE_NAME 不存在，无需删除"
fi
# 构建脚本
echo "开始构建 Docker 镜像..."

# 构建镜像
docker build --no-cache -t $IMAGE_NAME .

echo "构建完成！"

# 可选：推送到镜像仓库
# docker tag $IMAGE_NAME your-registry/$IMAGE_NAME
# docker push your-registry/$IMAGE_NAME

echo "镜像构建完成，可以使用以下命令运行："
echo "docker run -d -p 8080:8080 --name interview-web $IMAGE_NAME"
echo "或者使用 docker-compose:"
echo "docker-compose up -d" 