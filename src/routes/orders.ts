import express from 'express';

import {
  listPackages,
  createOrder,
  listSeekerOrders,
  updateOrderStatus,
  deliverOrder,
} from '../controllers/orderController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { orderSchema, orderStatusSchema } from '../utils/schemas.ts';
import { uploadDocument } from '../middleware/upload.ts';

export const packageRouter = express.Router();
packageRouter.get('/', listPackages);

export const orderRouter = express.Router();
orderRouter.post(
  '/',
  authenticate,
  authorize('seeker'),
  validateBody(orderSchema),
  createOrder
);

export const seekerOrderRouter = express.Router();
seekerOrderRouter.use(authenticate, authorize('seeker'));
seekerOrderRouter.get('/', listSeekerOrders);

/** Mounted under /api/admin/orders — parent already authenticates admin */
export const adminOrderRouter = express.Router();
adminOrderRouter.patch('/:id', validateBody(orderStatusSchema), updateOrderStatus);
adminOrderRouter.post('/:id/deliver', uploadDocument, deliverOrder);
