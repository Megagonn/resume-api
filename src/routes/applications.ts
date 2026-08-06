import { Router } from 'express';
import {
  listSeekerApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { applicationStatusSchema } from '../utils/schemas.js';

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
