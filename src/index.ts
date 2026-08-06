import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { seed } from './seed/index.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import jobRoutes, { hirerJobRouter } from './routes/jobs.js';
import {
  seekerApplicationRouter,
  hirerApplicationRouter,
} from './routes/applications.js';
import {
  packageRouter,
  orderRouter,
  seekerOrderRouter,
} from './routes/orders.js';
import { seekerProfileRouter, hirerCompanyRouter, hirerAccountRouter } from './routes/profiles.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';
import {
  hirerPlanPublicRouter,
  hirerSubscriptionRouter,
} from './routes/subscriptions.js';
import publicBlogRouter from './routes/blog.js';

async function main() {
  await connectDb();
  await seed();

  const app = express();
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'ready-brand-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/hirer/jobs', hirerJobRouter);
  app.use('/api/hirer/applications', hirerApplicationRouter);
  app.use('/api/hirer/company', hirerCompanyRouter);
  app.use('/api/hirer/profile', hirerAccountRouter);
  app.use('/api/hirer/subscription', hirerSubscriptionRouter);
  app.use('/api/hirer-plans', hirerPlanPublicRouter);
  app.use('/api/seeker/applications', seekerApplicationRouter);
  app.use('/api/seeker/orders', seekerOrderRouter);
  app.use('/api/seeker/profile', seekerProfileRouter);
  app.use('/api/packages', packageRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/blog', publicBlogRouter);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`The Ready Brand API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
