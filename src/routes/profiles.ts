import { Router } from 'express';
import {
  getSeekerProfile,
  updateSeekerProfile,
  getCompany,
  updateCompany,
  getHirerAccount,
  updateHirerAccount,
} from '../controllers/profileController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import {
  seekerProfileSchema,
  companySchema,
  hirerAccountSchema,
} from '../utils/schemas.ts';

export const seekerProfileRouter = Router();
seekerProfileRouter.use(authenticate, authorize('seeker'));
seekerProfileRouter.get('/', getSeekerProfile);
seekerProfileRouter.patch('/', validateBody(seekerProfileSchema), updateSeekerProfile);

export const hirerCompanyRouter = Router();
hirerCompanyRouter.use(authenticate, authorize('hirer'));
hirerCompanyRouter.get('/', getCompany);
hirerCompanyRouter.patch('/', validateBody(companySchema.partial()), updateCompany);

export const hirerAccountRouter = Router();
hirerAccountRouter.use(authenticate, authorize('hirer'));
hirerAccountRouter.get('/', getHirerAccount);
hirerAccountRouter.patch('/', validateBody(hirerAccountSchema), updateHirerAccount);
