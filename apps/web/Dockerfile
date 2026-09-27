# Build context is apps/web (see .forgejo/workflows/build.yml / `docker build apps/web`).
# The browser extension is no longer bundled here: CI uploads it to MinIO and
# the backend serves it at /api/3.1/extension/download.
FROM node:24.16.0-alpine3.23 AS base

RUN corepack enable && corepack prepare pnpm --activate

# --- Build the web app ---
FROM base AS builder

WORKDIR /app

COPY . ./

# --ignore-scripts skips dependency build scripts (pnpm's default in CI) and our
# `prepare` hook, so run panda codegen explicitly before building.
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec panda codegen

RUN pnpm build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
