# Step 1
## Base image for Step 1: Node 10
FROM node:12.18.3-alpine AS builder

WORKDIR /tp-mvp

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# server, shared 복사
COPY server server
COPY shared shared

# 최상위 packagejson , yarn.lock 복사
COPY package.json .
COPY yarn.lock .

# monorepo 내부 패키지 (shared) 를 포함한 모든 디펜던시 설치
RUN yarn install

## Build
WORKDIR /server
RUN yarn build

## application 실행
EXPOSE 3000
CMD ["yarn", "start:prod"]