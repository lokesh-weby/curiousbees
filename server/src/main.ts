import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';






// Dynamically locate .env when the API is started from either the repo root
// or the apps/api workspace directory.
const envCandidates = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'apps/api/.env'),
  path.join(process.cwd(), 'apps/web/.env'),
  path.join(process.cwd(), '..', '.env'),
  path.join(process.cwd(), '../..', '.env'),
  path.join(process.cwd(), '../web/.env'),
  path.join(process.cwd(), '../../apps/api/.env'),
  path.join(process.cwd(), '../../apps/web/.env'),
];
const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  dotenv.config({ path: envPath });
  console.log(`[CuriousBees] Loaded environment from ${envPath}`);
} else {
  dotenv.config();
  console.warn('[CuriousBees] No .env file found in the root locations.');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';

// ─── Shared app bootstrap ────────────────────────────────────────────────────

async function createApp(expressInstance?: express.Express) {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

  // Keep API resources under /api while allowing a lightweight root message.
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'api', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
      { path: 'api/health', method: RequestMethod.GET },
    ],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS — supports local dev + all Vercel preview/production deployments
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.WEB_URL,
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : []),
  ].filter(Boolean) as string[];

  const allowedOrigins = Array.from(new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://curiousbees.vercel.app',
    ...configuredOrigins,
  ]));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.DEVELOPMENT_MODE === 'true' && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  return app;
}

// ─── Local dev: start HTTP server ────────────────────────────────────────────

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 CuriousBees API running on: http://localhost:${port}`);
}

// ─── Vercel serverless: export a request handler ─────────────────────────────
// Vercel calls the default export with (req, res) — it does NOT bind a TCP port.

let serverHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!serverHandler) {
    console.log('[CuriousBees] Cold start — initialising NestJS...');
    const expressApp = express();
    const nestApp = await createApp(expressApp);
    await nestApp.init(); // init WITHOUT listen
    serverHandler = expressApp;
    console.log('[CuriousBees] NestJS ready.');
  }
  serverHandler(req, res);
}

// ─── Entry point ─────────────────────────────────────────────────────────────
// In Vercel, the file is imported and `handler` is used.
// In local dev / production node process, bootstrap() is called directly.

if (process.env.VERCEL !== '1') {
  bootstrap();
}
