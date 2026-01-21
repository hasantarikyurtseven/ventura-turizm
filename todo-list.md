# STAGE 1 — Docker Bootstrap (Hot Reload Only)

## Goal
Set up a Docker Compose development environment for the monorepo with hot reload.
No business modules, no endpoints, no schemas, no integrations in this stage.

---

## Stack Summary
- Backend: NestJS
  - admin-api (port 3001)
  - client-api (port 3002)
  - jobs-service (worker)
- Frontend:
  - admin-dashboard: Angular CSR + PrimeNG + Bootstrap (NOT standalone) (port 4200)
  - client-web: Angular SSR + Angular Material (NOT standalone) (port 4300)
- Infra:
  - MongoDB (port 27017)
  - Redis (port 6379)
  - MinIO (ports 9000/9001)

---

## Deliverables (Create these files)

### Root
- [ ] `docker-compose.yml` (dev)
- [ ] `.dockerignore`
- [ ] `.env.example`

### App Dockerfiles (dev)
- [ ] `apps/admin-api/Dockerfile.dev` (NestJS watch)
- [ ] `apps/client-api/Dockerfile.dev` (NestJS watch)
- [ ] `apps/jobs-service/Dockerfile.dev` (NestJS worker watch)
- [ ] `apps/admin-dashboard/Dockerfile.dev` (Angular ng serve 4200)
- [ ] `apps/client-web/Dockerfile.dev` (Angular SSR dev server 4300)

---

## Compose Requirements
- [ ] Services: mongo, redis, minio, admin-api, client-api, jobs-service, admin-dashboard, client-web
- [ ] Each node-based service uses bind mount `.:/app`
- [ ] Each node-based service uses its own `node_modules` named volume
- [ ] Use internal hostnames: mongo, redis, minio
- [ ] Provide env placeholders via `.env.example`
- [ ] Enable polling watchers when needed:
  - `CHOKIDAR_USEPOLLING=true`
  - `WATCHPACK_POLLING=true`

---

## Smoke Test (after Stage 1)
- [ ] `cp .env.example .env`
- [ ] `docker compose up --build`
- [ ] Verify URLs:
  - Admin UI: http://localhost:4200
  - Client SSR: http://localhost:4300
  - Admin API: http://localhost:3001
  - Client API: http://localhost:3002
  - MinIO Console: http://localhost:9001
  - MongoDB Compass: mongodb://<root>:<pass>@localhost:27017/<db>?authSource=admin

---

## Non-Goals (Do NOT do in Stage 1)
- No authentication logic
- No RBAC modules
- No customer flows
- No DB models/collections
- No integrations (pool, payment, invoice)
- No shared DTO/libs
- No Angular standalone