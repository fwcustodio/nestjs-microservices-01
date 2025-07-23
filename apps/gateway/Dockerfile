FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/apps/gateway ./dist/apps/gateway
COPY apps/gateway/tsconfig.app.json ./apps/gateway/

EXPOSE 3000

CMD ["node", "dist/apps/gateway/main.js"]