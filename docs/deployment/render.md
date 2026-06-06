# Backend Deployment (Render / Docker)

The NestJS backend (`apps/api`) is designed to run in a containerized environment like Render.

## Pre-requisites
1. A Render account (or any Docker-compatible host).
2. Connected GitHub Repository.

## Environment Variables
- `DATABASE_URL` (Direct Postgres connection to Supabase)
- `DIRECT_URL` (For Prisma migrations)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (Ensure line breaks are handled correctly)
- `REDIS_URL` (For BullMQ)

## Deployment Steps
1. In Render, create a new "Web Service".
2. Select your repository.
3. Configure the Root Directory to `apps/api` (or configure a Docker build from the root, depending on your Dockerfile placement).
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start:prod`
6. Supply all environment variables.
7. Deploy.
