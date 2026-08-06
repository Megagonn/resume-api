import { Router } from 'express';
import {
  listPackages,
  createOrder,
  listSeekerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { orderSchema, orderStatusSchema } from '../utils/schemas.js';

export const packageRouter = Router();
packageRouter.get('/', listPackages);

export const orderRouter = Router();
orderRouter.post(
  '/',
  authenticate,
  authorize('seeker'),
  validateBody(orderSchema),
  createOrder
);

export const seekerOrderRouter = Router();
seekerOrderRouter.use(authenticate, authorize('seeker'));
seekerOrderRouter.get('/', listSeekerOrders);

/** Mounted under /api/admin/orders — parent already authenticates admin */
export const adminOrderRouter = Router();
adminOrderRouter.patch('/:id', validateBody(orderStatusSchema), updateOrderStatus);
