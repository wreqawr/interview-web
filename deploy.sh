#!/bin/bash

# Docker 部署脚本
# 使用方法: ./deploy.sh [build|up|down|restart|logs]

set -e

IMAGE_NAME="interview-web:latest"
CONTAINER_NAME="interview-web"
COMPOSE_FILE="docker-compose.yml"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印信息
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    info "Docker 运行正常"
}

# 检查网络是否存在
check_network() {
    if ! docker network inspect interview-net > /dev/null 2>&1; then
        warn "网络 interview-net 不存在，正在创建..."
        docker network create interview-net
        info "网络 interview-net 创建成功"
    else
        info "网络 interview-net 已存在"
    fi
}

# 构建镜像
build_image() {
    info "开始构建 Docker 镜像..."
    docker build -t $IMAGE_NAME .
    info "镜像构建完成"
}

# 启动服务
start_services() {
    info "启动服务..."
    docker-compose -f $COMPOSE_FILE up -d
    info "服务启动完成"
    info "访问地址: http://localhost:10077"
}

# 停止服务
stop_services() {
    info "停止服务..."
    docker-compose -f $COMPOSE_FILE down
    info "服务已停止"
}

# 重启服务
restart_services() {
    info "重启服务..."
    stop_services
    start_services
}

# 查看日志
view_logs() {
    info "查看服务日志（按 Ctrl+C 退出）..."
    docker-compose -f $COMPOSE_FILE logs -f
}

# 显示状态
show_status() {
    info "服务状态:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    info "容器健康状态:"
    docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "容器未运行"
}

# 主函数
main() {
    check_docker
    
    case "${1:-}" in
        build)
            build_image
            ;;
        up)
            check_network
            build_image
            start_services
            show_status
            ;;
        down)
            stop_services
            ;;
        restart)
            check_network
            restart_services
            show_status
            ;;
        logs)
            view_logs
            ;;
        status)
            show_status
            ;;
        *)
            echo "用法: $0 [build|up|down|restart|logs|status]"
            echo ""
            echo "命令说明:"
            echo "  build   - 构建 Docker 镜像"
            echo "  up      - 构建镜像并启动服务"
            echo "  down    - 停止服务"
            echo "  restart - 重启服务"
            echo "  logs    - 查看服务日志"
            echo "  status  - 查看服务状态"
            exit 1
            ;;
    esac
}

main "$@"

