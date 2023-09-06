FROM node:20.6-alpine

WORKDIR /application

ENV PATH /application/node_modules/.bin:$PATH
