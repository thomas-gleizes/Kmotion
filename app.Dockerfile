FROM node:20-alpine3.17

WORKDIR /app

COPY . /app

RUN corepack enable \
 && corepack prepare pnpm@latest --activate \
 && pnpm install

ENV PORT=80
ENV NODE_ENV=production

EXPOSE 80

ENTRYPOINT ["pnpm", "start"]
