FROM node:16-alpine3.15 as build-stage

RUN mkdir ./client

WORKDIR /client

COPY . .

RUN npm install

STOPSIGNAL SIGTERM

EXPOSE 80

CMD ["npm", "run", "start"]
