FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json /app/
RUN pnpm install

COPY src /app/src/
COPY .env /app/
# COPY resources /app/resources/
COPY config /app/config/
COPY tsconfig.json /app/

RUN pnpm build

ENV TZ=UTC
CMD node dist/api-server/ApiServer.js
