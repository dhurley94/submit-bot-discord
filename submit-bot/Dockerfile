FROM node:10-jessie-slim

WORKDIR /app

COPY app/ ./

RUN npm install

EXPOSE 3306
EXPOSE 80

ENTRYPOINT [ "node", "app.js" ]
