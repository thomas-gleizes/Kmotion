# Build context is the repository root (see .github workflow / `docker build .`)
# so we can build the browser extension and ship it as a static download
# alongside the web app.
FROM node:24.16.0-alpine3.23 AS base

RUN corepack enable && corepack prepare pnpm --activate

# --- Build the browser extension against the production API URL ---
FROM base AS extension

# Production API URL baked into the extension build. Vite reads VITE_* from the
# environment at build time, so no .env file is needed. Override at build time
# with --build-arg VITE_API_URL=...
ARG VITE_API_URL=https://kmotion.thomasgleizes.fr/api/3.1

# Mirror the repo layout so the extension's tsconfig can resolve its
# `extends: ../../tsconfig.base.json`.
WORKDIR /repo/apps/extension

COPY tsconfig.base.json /repo/tsconfig.base.json
COPY apps/extension/ ./

RUN CI=true pnpm install --frozen-lockfile --ignore-scripts
# Vite injects VITE_API_URL from the environment into the build.
RUN VITE_API_URL="$VITE_API_URL" pnpm build
# Packages dist/ into build/kmotion-extension.zip (web-ext).
RUN pnpm package

# --- Build the web app ---
FROM base AS builder

WORKDIR /app

COPY apps/web/ ./

# --ignore-scripts skips dependency build scripts (pnpm's default in CI) and our
# `prepare` hook, so run panda codegen explicitly before building.
RUN CI=true pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec panda codegen

# Ship the packaged extension as a downloadable static asset. Vite copies
# everything under public/ into dist/, so nginx serves it at
# /downloads/kmotion-extension.zip.
COPY --from=extension /repo/apps/extension/build/kmotion-extension.zip ./public/downloads/kmotion-extension.zip

RUN pnpm build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
