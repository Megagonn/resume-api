import express from 'express';

import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  listHirerJobs,
  listJobApplications,
} from '../controllers/jobController.ts';
import { applyToJob } from '../controllers/applicationController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { jobSchema, applicationSchema } from '../utils/schemas.ts';
import { uploadDocument } from '../middleware/upload.ts';

const router = express.Router();

router.get('/', listJobs);
router.get('/:id', getJob);
router.post(
  '/:id/applications',
  authenticate,
  authorize('seeker'),
  uploadDocument,
  validateBody(applicationSchema),
  applyToJob
);

export const hirerJobRouter = express.Router();
hirerJobRouter.use(authenticate, authorize('hirer'));
hirerJobRouter.get('/', listHirerJobs);
hirerJobRouter.post('/', validateBody(jobSchema), createJob);
hirerJobRouter.patch('/:id', validateBody(jobSchema.partial()), updateJob);
hirerJobRouter.delete('/:id', deleteJob);
hirerJobRouter.get('/:id/applications', listJobApplications);

export default router;
