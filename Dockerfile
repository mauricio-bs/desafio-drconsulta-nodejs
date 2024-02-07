FROM node:20.11.0-apine

WORKDIR /app

COPY . .

RUN apk add --no-cache bash openssl

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]
