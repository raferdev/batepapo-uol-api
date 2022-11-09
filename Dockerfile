FROM node:16-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN npm ci

CMD ["node", "app.js"]