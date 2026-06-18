# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a multi-app repository — each app under `apps/` is managed independently with its own `pnpm` lockfile. The root `package.json` only has two convenience scripts (`pnpm server:dev`, `pnpm web:dev`) that `cd` into an app and run its dev command; there is no shared workspace tooling.

- `apps/server` — NestJS backend API ("kmotion"), the main focus of most work. Uses pnpm, Node v22.2 (see `.nvmrc`).
- `apps/web` — React 19 + Vite frontend: TanStack Router/Query, Zustand stores, Panda CSS. The main player/playlist/admin UI.
- `apps/extension` — Browser extension (React + Vite + Tailwind) for converting/saving YouTube videos as MP3s. Has its own README/ARCHITECTURE.md docs in that directory.

Each app has its own Dockerfile (`apps/server/Dockerfile`, `apps/web/Dockerfile`); there is no root Dockerfile. `apps/server/Dockerfile` is multi-stage: pnpm install → drizzle generate → nest build → slim alpine runner. `apps/web/Dockerfile` is built from the **repo root** as context (so it can also build `apps/extension` and ship the packaged `.zip` as a static download at `/downloads/kmotion-extension.zip`), then serves the Vite build via nginx.

`compose.yml` runs a local Postgres 17 instance for development. `k8s/` contains Kubernetes manifests for deployment: `app/` (server), `web/`, `database/`, `cert-manager/`, plus PodDisruptionBudgets for zero-downtime rollouts. CI (`.github/workflows/docker-publish.yml`) runs server unit tests, builds/pushes both `app`/`web` images to GHCR, and on `master` restarts the `app`/`web` deployments via `kubectl rollout restart`.

## Commands (apps/server)

All commands run from `apps/server`:

- `pnpm install` — install dependencies
- `pnpm start:dev` — run server with watch mode
- `pnpm build` — compile via `nest build`
- `pnpm lint` — eslint with `--fix` over `src`, `apps`, `libs`, `test`
- `pnpm format` — prettier write over `src` and `test`
- `pnpm test` — run unit tests (Jest, files matching `*.spec.ts` under `src`)
- `pnpm test -- <path-or-pattern>` — run a single test file/suite
- `pnpm test:watch` — Jest watch mode
- `pnpm test:cov` — Jest with coverage
- `pnpm test:e2e` — e2e tests (`test/jest-e2e.json` config)
- `pnpm generate` — generate Drizzle migrations from schema (`drizzle-kit generate`)
- `pnpm migrate` — apply Drizzle migrations (`drizzle-kit migrate`)

Local Postgres for development: `docker compose up -d database` from the repo root (exposes Postgres 17 on `5432`, trust auth, db name/user default to `kmotion`).

Code style: Prettier with `semi: false`, `printWidth: 100`, `endOfLine: lf`. ESLint extends `eslint:recommended` + `@typescript-eslint/recommended`, with `prettier/prettier` as an error.

## Commands (apps/web)

- `pnpm dev` — Vite dev server (port 3000, proxies `/api` to `http://localhost:3030`)
- `pnpm build` — `tsc -b && vite build`
- `pnpm lint` — eslint
- `pnpm preview` — preview production build
- `pnpm prepare` — `panda codegen` (regenerates `styled-system/`; runs automatically on install, but must be run manually after `--ignore-scripts` installs)
- `pnpm openapi` — regenerate `types/openapi.ts` from a running server's OpenAPI schema (`http://localhost:3030/api/3.1/openapi.json`)

## Commands (apps/extension)

- `pnpm dev` — Vite dev server
- `pnpm build` — production build
- `pnpm package` — package the built extension via `web-ext` into `build/`
- `pnpm deploy` — build then package
- `pnpm generate:types` — regenerate `src/types/schema.d.ts` from a running server's OpenAPI schema

## Server architecture

`apps/server` follows a hexagonal/CQRS architecture using `@nestjs/cqrs`. Each bounded-context module (`auth`, `user`, `music`, `playlist`, `health`) is structured the same way under `src/<module>/`:

- `domain/` — entities (e.g. `playlist.entity.ts`), value objects, domain exceptions, and **ports** (interfaces) that the domain depends on (e.g. `domain/port/playlist-write-repository.port.ts`).
- `application/` — use cases, split into `commands/` and `queries/`, each as `<name>.command.ts`/`<name>.query.ts` + `<name>.handler.ts` (and often `<name>.handler.spec.ts`). Application-level ports also live here (e.g. `application/port/playlist-query-repository.port.ts`). `index.ts` files in `commands/`/`queries/` export arrays of handler providers (e.g. `playlistCommandHandlers`, `playlistQueryHandlers`) for module registration.
- `infrastructure/` — concrete adapters: Drizzle persistence repositories/schemas (`infrastructure/persistance/...`), external service adapters (e.g. `converter-service.adapter.ts`), scheduled tasks (`infrastructure/tasks/`), and factories.
- `presentation/` — NestJS controllers and DTOs (`presentation/dto/input`, `presentation/dto/output`), validated with `class-validator`/`class-transformer`.
- `<module>.module.ts` — wires everything together, binding port tokens (e.g. `PLAYLIST_WRITE_REPOSITORY`, `MUSIC_READ_REPOSITORY_PORT`) to their infrastructure implementations via `provide`/`useClass`.

Cross-cutting code lives in `src/shared/` (domain exceptions like `DomainException`/`RessourceNotFoundException`, presentation guards/decorators/interceptors/exception filters) and `src/core/` (config/environment validation via Zod in `core/config/environment.ts`, Drizzle DB setup in `core/database/`, the converter HTTP client module, and CQRS type augmentations in `core/cqrs/`).

Key points:
- All environment variables are validated and typed through the Zod schema in `src/core/config/environment.ts` (`environment` export) — add new env vars there rather than reading `process.env` directly.
- `src/core/database/schemas.ts` re-exports all Drizzle table schemas from each module's `infrastructure/persistance/schemas/`; this combined `schema` object is passed to `drizzle()` in `core/database/database.ts`.
- Auth: `AuthGuard` (in `src/shared/presentation/guards/auth.guard.ts`) verifies JWTs via the `AUTH_SERVICE_PORT` and attaches the decoded payload to `request.user`; use the `@CurrentUser()` decorator (`src/shared/presentation/decorators/current-user.decorator.ts`) to access it in controllers.
- Errors: throw `DomainException` / `RessourceNotFoundException` (or NestJS HTTP exceptions) — `GlobalExceptionFilters` (`src/shared/presentation/exception-filters/global-exception.filter.ts`) maps these to HTTP responses, hiding stack traces unless `NODE_ENV !== 'production'`.
- The `core/cqrs` module augments `@nestjs/cqrs`'s `CommandBus`/`QueryBus` types so `execute()` infers the result type from `Command<X>`/`Query<X>` generics — define new commands/queries by extending those types.
- API routes are globally prefixed via `API_PREFIX` (`src/core/config/constants.ts`, currently `/api/3.1`); Swagger UI/JSON/YAML are served under `API_OPENAPI` (`/api/3.1/openapi[.json|.yaml]`). Both `apps/web` and `apps/extension` generate their typed API clients from this OpenAPI schema (`pnpm openapi` / `pnpm generate:types`).

## Web architecture (apps/web)

- Routing is file-based via TanStack Router (`src/routes/*.page.tsx`, wired in `src/router.ts`); `app.layout.tsx`/`root.tsx` provide the shell. Data fetching uses TanStack Query (`src/api/queries.ts`, `src/api/client.ts` — an `openapi-fetch` client typed from `types/openapi.ts`).
- Client state (auth, player, equalizer) lives in Zustand stores: `src/auth/auth.ts`, `src/player/playerStore.ts`, `src/player/equalizerStore.ts`. `src/player/PlayerContext.tsx` wires the `<audio>` element, `audioCache.ts`, and `equalizer.ts` (Web Audio API filter chain) together.
- Styling uses Panda CSS (`panda.config.ts` → generated `styled-system/`, aliased in `vite.config.ts`); theming/dark-mode-style variants (`base`/`light`/`spotify`/`ocean`) are driven by `src/theme/ThemeContext.tsx` via semantic tokens and a `data-theme` attribute.
