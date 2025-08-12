# GreenCart — Backend (Prisma + TypeScript + Express)

This folder contains the backend implementation scaffold for GreenCart.

## What this includes
- TypeScript Express server
- Prisma schema for PostgreSQL
- Simulation service implementing business rules (fuel, fatigue, penalty, bonus)
- Seed script (prisma/seed.ts)
- Docker + docker-compose setup with Postgres

## Quick local setup (with Docker)
1. Ensure Docker is running.
2. In project root run:
   ```bash
   docker-compose up --build
   ```
3. After DB is ready, in a separate shell run (requires prisma installed locally or in container):
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```
4. Server will be available at http://localhost:4000

## Endpoints
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login
- `POST /api/simulate` — run simulation (body: { available_drivers, max_hours_per_driver })

## Notes
- This scaffold assumes a Postgres DB. Update `.env` or docker-compose if you use remote DB.
- For CI and production, ensure JWT_SECRET is set to a strong secret.
