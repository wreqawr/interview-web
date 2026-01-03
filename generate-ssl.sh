#!/bin/bash

# 生成自签名 SSL 证书脚本（仅用于开发环境）
# 生产环境请使用正式的 SSL 证书

set -e

SSL_DIR="./ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

echo "=========================================="
echo "生成自签名 SSL 证书（仅用于开发环境）"
echo "=========================================="

# 创建 SSL 目录
mkdir -p $SSL_DIR

# 检查是否已存在证书
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "证书文件已存在："
    echo "  - $CERT_FILE"
    echo "  - $KEY_FILE"
    read -p "是否重新生成？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "跳过证书生成"
        exit 0
    fi
    rm -f $CERT_FILE $KEY_FILE
fi

# 生成自签名证书（有效期 365 天）
echo "正在生成自签名证书..."
openssl req -x509 -newkey rsa:4096 \
    -keyout $KEY_FILE \
    -out $CERT_FILE \
    -days 365 \
    -nodes \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=Interview/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:::1"

# 设置权限
chmod 644 $CERT_FILE
chmod 600 $KEY_FILE

echo ""
echo "=========================================="
echo "证书生成完成！"
echo "=========================================="
echo "证书文件: $CERT_FILE"
echo "私钥文件: $KEY_FILE"
echo ""
echo "证书信息:"
openssl x509 -in $CERT_FILE -noout -subject -dates
echo ""
echo "注意："
echo "  - 这是自签名证书，浏览器会显示安全警告，需要手动信任"
echo "  - 仅用于开发环境，生产环境请使用正式的 SSL 证书"
echo "  - 证书有效期：365 天"
echo ""

