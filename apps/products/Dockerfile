FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/apps/products ./dist/apps/products
COPY apps/products/tsconfig.app.json ./apps/products/

EXPOSE 3002

CMD ["node", "dist/apps/products/main.js"]