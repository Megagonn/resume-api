import { Router } from 'express';
import {
  getSeekerProfile,
  updateSeekerProfile,
  getCompany,
  updateCompany,
} from '../controllers/profileController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { seekerProfileSchema, companySchema } from '../utils/schemas.js';

export const seekerProfileRouter = Router();
seekerProfileRouter.use(authenticate, authorize('seeker'));
seekerProfileRouter.get('/', getSeekerProfile);
seekerProfileRouter.patch('/', validateBody(seekerProfileSchema), updateSeekerProfile);

export const hirerCompanyRouter = Router();
hirerCompanyRouter.use(authenticate, authorize('hirer'));
hirerCompanyRouter.get('/', getCompany);
hirerCompanyRouter.patch('/', validateBody(companySchema.partial()), updateCompany);
