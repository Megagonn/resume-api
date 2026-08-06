import express from 'express';

import {
  listHirerPlans,
  getSubscription,
  upgradeSubscription,
} from '../controllers/subscriptionController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

export const hirerPlanPublicRouter = express.Router();
hirerPlanPublicRouter.get('/', listHirerPlans);

export const hirerSubscriptionRouter = express.Router();
hirerSubscriptionRouter.use(authenticate, authorize('hirer'));
hirerSubscriptionRouter.get('/', getSubscription);
hirerSubscriptionRouter.post('/upgrade', upgradeSubscription);
