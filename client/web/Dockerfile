# Note that
# build 명령어는 언제나 Truepoint root 폴더에서 빌드를 실행하여야 합니다.
# 명령어는 다음과 같습니다.
# docker build -t <DOCKER_NAME>/<IMAGE_NAME>:<IMAGE_TAG> -f ./client/web/Dockerfile .

# ############################################
# Step 1
FROM node:12.18.3-alpine AS builder

WORKDIR /tp-mvp-client

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY client/web /tp-mvp-client/client/web
COPY shared /tp-mvp-client/shared

COPY package.json .
COPY yarn.lock .
# issue
# https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33822
RUN npx yarn-deduplicate ./yarn.lock


RUN yarn install --pure-lockfile --non-interactive

# Build shared
WORKDIR /tp-mvp-client/shared
RUN yarn build

# Build Client
WORKDIR /tp-mvp-client/client/web
RUN yarn build


# ############################################
# Step 2
FROM node:12.18.3-alpine AS client

WORKDIR /truepoint
ENV NODE_ENV production

# shared
COPY --from=builder /tp-mvp-client/shared/package.json /truepoint/shared/package.json
COPY --from=builder /tp-mvp-client/shared/dist /truepoint/shared/dist

# client
COPY --from=builder /tp-mvp-client/client/web/package.json /truepoint/client/web/package.json
COPY --from=builder /tp-mvp-client/client/web/build /truepoint/client/web/build

# root dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install --pure-lockfile --non-interactive --production

EXPOSE 3001

CMD ["yarn", 'start']