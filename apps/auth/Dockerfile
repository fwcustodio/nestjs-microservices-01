FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/apps/auth ./dist/apps/auth
COPY apps/auth/tsconfig.app.json ./apps/auth/

EXPOSE 3004

CMD ["node", "dist/apps/auth/main.js"]