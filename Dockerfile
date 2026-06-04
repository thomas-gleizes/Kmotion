FROM node:24.16.0-alpine3.23 AS base

RUN corepack enable && corepack prepare pnpm --activate

FROM base AS builder

WORKDIR /app

COPY ./apps/server .

RUN CI=true pnpm install --frozen-lockfile
RUN pnpm generate
RUN pnpm build

FROM base AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S kmotion && adduser -S kmotion -u 1001

WORKDIR /app

COPY --from=builder --chown=kmotion:kmotion /app/dist/src ./src
COPY --from=builder --chown=kmotion:kmotion /app/node_modules ./node_modules
COPY --from=builder --chown=kmotion:kmotion /app/drizzle ./drizzle
COPY --from=builder --chown=kmotion:kmotion /app/drizzle.config.ts ./drizzle.config.ts

USER 1001

CMD ["dumb-init", "node", "src/main.js"]
