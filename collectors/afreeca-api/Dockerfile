FROM node:12.18.3-alpine

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/afreeca-collector
WORKDIR /home/afreeca-collector
ADD . /home/afreeca-collector

RUN yarn
CMD yarn start