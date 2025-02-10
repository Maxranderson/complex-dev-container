FROM node:23-slim

WORKDIR /app

COPY . .

CMD ["node", "src/cache-ingest.js"]