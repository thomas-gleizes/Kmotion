FROM node:24.16.0-alpine3.23 AS base

RUN corepack enable && corepack prepare pnpm --activate

FROM base AS builder

WORKDIR /app

COPY . .

# --ignore-scripts skips dependency build scripts (pnpm's default in CI) and our
# `prepare` hook, so run panda codegen explicitly before building.
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec panda codegen
RUN pnpm build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
