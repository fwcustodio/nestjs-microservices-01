FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/apps/customer ./dist/apps/customer
COPY apps/customer/tsconfig.app.json ./apps/customer/

EXPOSE 3001

CMD ["node", "dist/apps/customer/main.js"]