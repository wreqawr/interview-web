#!/bin/bash

# 构建脚本
echo "开始构建 Docker 镜像..."

# 构建镜像
docker build -t interview-web:latest .

echo "构建完成！"

# 可选：推送到镜像仓库
# docker tag interview-web:latest your-registry/interview-web:latest
# docker push your-registry/interview-web:latest

echo "镜像构建完成，可以使用以下命令运行："
echo "docker run -d -p 8080:8080 --name interview-web interview-web:latest"
echo "或者使用 docker-compose:"
echo "docker-compose up -d" 