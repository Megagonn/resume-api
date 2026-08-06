import { Router } from 'express';
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  listHirerJobs,
  listJobApplications,
} from '../controllers/jobController.js';
import { applyToJob } from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { jobSchema, applicationSchema } from '../utils/schemas.js';

const router = Router();

router.get('/', listJobs);
router.get('/:id', getJob);
router.post(
  '/:id/applications',
  authenticate,
  authorize('seeker'),
  validateBody(applicationSchema),
  applyToJob
);

export const hirerJobRouter = Router();
hirerJobRouter.use(authenticate, authorize('hirer'));
hirerJobRouter.get('/', listHirerJobs);
hirerJobRouter.post('/', validateBody(jobSchema), createJob);
hirerJobRouter.patch('/:id', validateBody(jobSchema.partial()), updateJob);
hirerJobRouter.delete('/:id', deleteJob);
hirerJobRouter.get('/:id/applications', listJobApplications);

export default router;
