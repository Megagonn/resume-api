import { Router } from 'express';
import {
  getStats,
  listUsers,
  updateUser,
  listAllJobs,
  listAllApplications,
  listAllOrders,
  listAdminPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/adminController.js';
import {
  listAdminHirerPlans,
  updateAdminHirerPlan,
  listAdminCompanies,
  updateCompanySubscription,
} from '../controllers/subscriptionController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  adminUserPatchSchema,
  packageSchema,
  hirerPlanPatchSchema,
  companySubscriptionSchema,
} from '../utils/schemas.js';
import { adminOrderRouter } from './orders.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', listUsers);
router.patch('/users/:id', validateBody(adminUserPatchSchema), updateUser);
router.get('/jobs', listAllJobs);
router.get('/applications', listAllApplications);
router.get('/orders', listAllOrders);
router.use('/orders', adminOrderRouter);

router.get('/packages', listAdminPackages);
router.post('/packages', validateBody(packageSchema), createPackage);
router.patch('/packages/:id', validateBody(packageSchema.partial()), updatePackage);
router.delete('/packages/:id', deletePackage);

router.get('/hirer-plans', listAdminHirerPlans);
router.patch('/hirer-plans/:id', validateBody(hirerPlanPatchSchema), updateAdminHirerPlan);
router.get('/companies', listAdminCompanies);
router.patch(
  '/companies/:id/subscription',
  validateBody(companySubscriptionSchema),
  updateCompanySubscription
);

export default router;
