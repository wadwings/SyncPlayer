# 使用 node 14 作为基础镜像
FROM node:16

# 在容器内创建一个app目录
WORKDIR /app

# 将本地的 package.json 和 package-lock.json 文件复制到容器中
COPY . .

# 使用 npm 安装依赖

RUN npm i -g pnpm &&\
    pnpm i &&\
    pnpm run build

# 将所有文件复制到容器中

# 暴露8080端口
EXPOSE 8080

# 启动 NestJS 应用程序
CMD [ "pnpm", "run", "start:prod" ]
