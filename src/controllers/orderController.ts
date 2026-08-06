import { Response, NextFunction } from 'express';
import { Package } from '../models/Package.js';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';
import { uploadBuffer } from '../services/cloudinary.js';

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
      attachmentFileUrl: req.body.attachmentFileUrl,
      attachmentFileName: req.body.attachmentFileName,
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
    if (req.body.deliveryFileUrl !== undefined) order.deliveryFileUrl = req.body.deliveryFileUrl;
    if (req.body.deliveryFileName !== undefined) {
      order.deliveryFileName = req.body.deliveryFileName;
    }
    if (req.body.status === 'delivered') {
      order.deliveredAt = order.deliveredAt || new Date();
    }
    await order.save();

    const populated = await order.populate(['packageId', 'seekerId']);
    res.json({ order: populated });
  } catch (err) {
    next(err);
  }
}

export async function deliverOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const file = req.file;
    if (!file && !req.body.deliveryFileUrl) {
      res.status(400).json({ message: 'Upload a CV file to deliver this order' });
      return;
    }

    if (file) {
      const uploaded = await uploadBuffer(file.buffer, {
        folder: 'ready-brand/deliveries',
        resourceType: 'raw',
        filename: file.originalname,
      });
      order.deliveryFileUrl = uploaded.url;
      order.deliveryFileName = file.originalname;
    } else if (req.body.deliveryFileUrl) {
      order.deliveryFileUrl = req.body.deliveryFileUrl;
      order.deliveryFileName = req.body.deliveryFileName || 'delivered-cv.pdf';
    }

    if (req.body.deliverables !== undefined) order.deliverables = req.body.deliverables;
    if (req.body.notes !== undefined) order.notes = req.body.notes;

    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();

    const populated = await order.populate(['packageId', 'seekerId']);
    res.json({ order: populated, message: 'Order delivered' });
  } catch (err) {
    next(err);
  }
}
