FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/apps/shopping ./dist/apps/shopping
COPY apps/shopping/tsconfig.app.json ./apps/shopping/

EXPOSE 3003

CMD ["node", "dist/apps/shopping/main.js"]