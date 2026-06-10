# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a multi-app repository (no shared root `package.json`/workspace tooling — each app under `apps/` is managed independently with its own `pnpm` lockfile):

- `apps/server` — NestJS backend API ("kmotion"), the main focus of most work. Uses pnpm, Node v22.2 (see `.nvmrc`).
- `apps/web` — React 19 + Vite frontend (early scaffold, mostly default Vite template).
- `apps/extension` — Browser extension (React + Vite + Tailwind) for converting/saving YouTube videos as MP3s. Has its own README/architecture docs in that directory.

Top-level `Dockerfile` builds only `apps/server` (multi-stage: pnpm install → drizzle generate → nest build → slim alpine runner). `compose.yml` runs a local Postgres 17 instance for development. `k8s/` contains Kubernetes manifests for deployment (namespace, app deployment/service/ingress, database, cert-manager issuer).

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

- `pnpm dev` — Vite dev server
- `pnpm build` — `tsc -b && vite build`
- `pnpm lint` — eslint
- `pnpm preview` — preview production build

## Commands (apps/extension)

- `pnpm dev` — Vite dev server
- `pnpm build` — production build
- `pnpm package` — package the built extension via `web-ext` into `build/`
- `pnpm deploy` — build then package

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
