import { Response, NextFunction } from 'express';
import { Package } from '../models/Package.js';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

export async function listPackages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.all !== 'true';
    const filter = activeOnly ? { active: true } : {};
    const packages = await Package.find(filter).sort({ price: 1 });
    res.json({ packages });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const pkg = await Package.findById(req.body.packageId);
    if (!pkg || !pkg.active) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    const order = await Order.create({
      seekerId: req.user!.id,
      packageId: pkg._id,
      amount: pkg.price,
      currency: pkg.currency,
      status: req.body.markPaid ? 'paid' : 'pending',
      paymentRef: req.body.markPaid ? `mock_${Date.now()}` : undefined,
      notes: req.body.notes,
    });

    const populated = await order.populate('packageId');
    res.status(201).json({ order: populated });
  } catch (err) {
    next(err);
  }
}

export async function listSeekerOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({ seekerId: req.user!.id })
      .populate('packageId')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = req.body.status;
    if (req.body.deliverables !== undefined) order.deliverables = req.body.deliverables;
    if (req.body.notes !== undefined) order.notes = req.body.notes;
    await order.save();

    const populated = await order.populate(['packageId', 'seekerId']);
    res.json({ order: populated });
  } catch (err) {
    next(err);
  }
}
