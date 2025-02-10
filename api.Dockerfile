FROM node:23-slim

WORKDIR /app

COPY . .

CMD ["node", "src/api.js"]