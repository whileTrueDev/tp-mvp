# Note that
# build 명령어는 언제나 Truepoint root 폴더에서 빌드를 실행하여야 합니다.
# 명령어는 다음과 같습니다.
# docker build -t <DOCKER_NAME>/<IMAGE_NAME>:<IMAGE_TAG> -f ./server/Dockerfile .

# ############################################
# Step 1
FROM node:12.18.3-alpine AS builder

WORKDIR /tp-mvp-server

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# server, shared 복사
COPY server /tp-mvp-server/server
COPY shared /tp-mvp-server/shared

# 최상위 packagejson , yarn.lock 복사
COPY package.json .
COPY yarn.lock .

# monorepo 내부 패키지 (shared) 를 포함한 모든 디펜던시 설치
RUN yarn install --pure-lockfile --non-interactive

## 테스트 환경변수 설정
ENV NODE_ENV test

## Build shared 패키지
WORKDIR /tp-mvp-server/shared
RUN yarn build

## Build server 패키지
WORKDIR /tp-mvp-server/server
RUN yarn build

# ############################################
# Step 2
FROM node:12.18.3-alpine AS api

WORKDIR /truepoint

ENV NODE_ENV test
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# shared
COPY --from=builder /tp-mvp-server/shared/package.json /truepoint/shared/package.json
COPY --from=builder /tp-mvp-server/shared/dist /truepoint/shared/dist

# server
COPY --from=builder /tp-mvp-server/server/package.json /truepoint/server/package.json
COPY --from=builder /tp-mvp-server/server/dist /truepoint/server/dist
COPY --from=builder /tp-mvp-server/server/tsconfig.build.json /truepoint/server/tsconfig.build.json
COPY --from=builder /tp-mvp-server/server/tsconfig.json /truepoint/server/tsconfig.json

# root dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /truepoint/server

## application 실행
EXPOSE 3000
CMD ["NODE_ENV=test", "yarn", "start:prod"]