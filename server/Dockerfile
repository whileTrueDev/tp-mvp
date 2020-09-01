# Step 1
## Base image for Step 1: Node 10
FROM node:12.18.3-alpine AS builder

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY . .
## Build
RUN npm install
RUN npm run build


# Step 2
## base image for Step 2: Node 12.18.3-alpine(light weight)
FROM node:12.18.3-alpine
WORKDIR /app

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

## Step 1의 builder에서 build된 프로젝트를 가져온다
COPY --from=builder /app ./
## application 실행
EXPOSE 3000
CMD ["npm", "run", "start:prod"]