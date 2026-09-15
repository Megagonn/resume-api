import express from 'express';

import {
  listPublishedServicePages,
  getPublishedServicePage,
  listAdminServicePages,
  createServicePage,
  updateServicePage,
  deleteServicePage,
} from '../controllers/servicePageController.ts';
import { validateBody } from '../middleware/validate.ts';
import { servicePageSchema } from '../utils/schemas.ts';

const publicServicesRouter = express.Router();
publicServicesRouter.get('/', listPublishedServicePages);
publicServicesRouter.get('/:slug', getPublishedServicePage);

export const adminServicesRouter = express.Router();
adminServicesRouter.get('/', listAdminServicePages);
adminServicesRouter.post('/', validateBody(servicePageSchema), createServicePage);
adminServicesRouter.patch('/:id', validateBody(servicePageSchema.partial()), updateServicePage);
adminServicesRouter.delete('/:id', deleteServicePage);

export default publicServicesRouter;
