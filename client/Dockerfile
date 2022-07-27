FROM node:16-alpine3.15 as build-stage

RUN mkdir ./client

WORKDIR /client

COPY . .

RUN npm install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

STOPSIGNAL SIGTERM

EXPOSE 80

CMD ["npm", "run", "start"]
