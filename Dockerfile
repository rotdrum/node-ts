#!/bin/bash
FROM --platform=linux/amd64 node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY src ./src
COPY tsconfig.json ./

EXPOSE 3000

CMD npm start