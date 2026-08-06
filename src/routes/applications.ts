import { Router } from 'express';
import {
  listSeekerApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { applicationStatusSchema } from '../utils/schemas.ts';

export const seekerApplicationRouter = Router();
seekerApplicationRouter.use(authenticate, authorize('seeker'));
seekerApplicationRouter.get('/', listSeekerApplications);

export const hirerApplicationRouter = Router();
hirerApplicationRouter.use(authenticate, authorize('hirer', 'admin'));
hirerApplicationRouter.patch(
  '/:id',
  validateBody(applicationStatusSchema),
  updateApplicationStatus
);
