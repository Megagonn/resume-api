import { Router } from 'express';
import {
  listHirerPlans,
  getSubscription,
  upgradeSubscription,
} from '../controllers/subscriptionController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

export const hirerPlanPublicRouter = Router();
hirerPlanPublicRouter.get('/', listHirerPlans);

export const hirerSubscriptionRouter = Router();
hirerSubscriptionRouter.use(authenticate, authorize('hirer'));
hirerSubscriptionRouter.get('/', getSubscription);
hirerSubscriptionRouter.post('/upgrade', upgradeSubscription);
