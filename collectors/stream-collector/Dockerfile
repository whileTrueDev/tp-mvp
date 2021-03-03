FROM node:10.15.3-alpine
RUN mkdir -p /home/stream-collector
WORKDIR /home/stream-collector
ADD . /home/stream-collector
RUN yarn
EXPOSE 3010
CMD yarn start