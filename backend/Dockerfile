# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5006

ENV PORT=5006

CMD ["node", "index.js"]