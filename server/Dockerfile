FROM node:16-alpine3.15

RUN mkdir ./server

WORKDIR /server

COPY . .

RUN npm install

EXPOSE 3333

CMD npm run start
