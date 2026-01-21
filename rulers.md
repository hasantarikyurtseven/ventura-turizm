STAGE 1 — DOCKER BOOTSTRAP ONLY (NO MODULES YET)

Context
- This is a monorepo.
- We will ONLY set up the Docker-based development environment (hot reload).
- Do NOT implement any business modules, endpoints, DTOs, schemas, integrations, or authentication flows in this stage.

Apps (monorepo folders)
- apps/admin-api       -> NestJS (API)  [must run with hot reload]
- apps/client-api      -> NestJS (API)  [must run with hot reload]
- apps/jobs-service    -> NestJS (Worker) [must run with hot reload]
- apps/admin-dashboard -> Angular CSR (PrimeNG + Bootstrap) [NOT standalone]
- apps/client-web      -> Angular SSR (Angular Material) [NOT standalone]

Infrastructure
- MongoDB
- Redis
- MinIO (object storage / CDN)

IMPORTANT RULES
- Backend framework is NestJS for all backend services.
- Both Angular apps must NOT use standalone component bootstrap. Use classic NgModule structure only.
- Admin UI uses PrimeNG + Bootstrap.
- Client UI uses Angular Material and is SSR.
- In Stage 1, DO NOT create Angular/Nest modules or app code. Only Docker-related setup.

What to produce in Stage 1
- Create ONLY the required Docker files:
  1) docker-compose.yml (development, hot reload)
  2) Dockerfile.dev for each app:
     - apps/admin-api/Dockerfile.dev
     - apps/client-api/Dockerfile.dev
     - apps/jobs-service/Dockerfile.dev
     - apps/admin-dashboard/Dockerfile.dev
     - apps/client-web/Dockerfile.dev
  3) .dockerignore (root)
  4) .env.example (root)

Hot reload requirements
- NestJS services must run in watch mode (e.g. npm run start:dev).
- Angular admin-dashboard must run with ng serve --host 0.0.0.0 --port 4200.
- Angular client-web must run SSR dev server and expose port 4300.
- Use bind mounts for source code and per-service node_modules volumes.
- Enable polling watchers for Docker if needed (CHOKIDAR_USEPOLLING / WATCHPACK_POLLING).

Ports (dev)
- admin-api: 3001
- client-api: 3002
- jobs-service: no public port required (worker), optional internal health port
- admin-dashboard: 4200
- client-web (SSR): 4300
- mongo: 27017
- redis: 6379
- minio: 9000 (api), 9001 (console)

Constraints
- Do NOT generate business code (controllers/services/modules).
- Do NOT add shared DTO/libs. Each app will be independent later.
- Only touch files needed for Docker bootstrap in Stage 1.