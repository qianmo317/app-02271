# ============ Stage 1: Build ============
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖（利用缓存层）
COPY frontend-user/package.json frontend-user/package-lock.json ./
RUN npm ci

# 复制源码并构建
COPY frontend-user/ .
RUN npm run build

# ============ Stage 2: Serve ============
FROM nginx:alpine AS production

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 复制 nginx 配置
COPY frontend-user/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80

# 启动日志 + Nginx
CMD ["sh", "-c", "echo '========================================' && echo '  Startup Success' && echo '  Sweet Whisper Bakery Frontend' && echo '  Access URL: http://localhost:8081' && echo '========================================' && nginx -g 'daemon off;'"]
