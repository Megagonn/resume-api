import type { Response, NextFunction } from 'express';

import { ServicePage } from '../models/ServicePage.ts';
import type { AuthRequest } from '../middleware/auth.ts';

export async function listPublishedServicePages(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const pages = await ServicePage.find({ published: true })
      .select('slug metaTitle metaDescription eyebrow headline subheadline sortOrder published')
      .sort({ sortOrder: 1, slug: 1 });

    res.json({ pages });
  } catch (err) {
    next(err);
  }
}

export async function getPublishedServicePage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = await ServicePage.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!page) {
      res.status(404).json({ message: 'Service page not found' });
      return;
    }

    res.json({ page });
  } catch (err) {
    next(err);
  }
}

export async function listAdminServicePages(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const pages = await ServicePage.find().sort({ sortOrder: 1, slug: 1 });
    res.json({ pages });
  } catch (err) {
    next(err);
  }
}

export async function createServicePage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const slug = req.body.slug?.trim().toLowerCase();
    const existing = await ServicePage.findOne({ slug });
    if (existing) {
      res.status(409).json({ message: 'Slug already exists' });
      return;
    }

    const page = await ServicePage.create({ ...req.body, slug });
    res.status(201).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function updateServicePage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = await ServicePage.findById(req.params.id);
    if (!page) {
      res.status(404).json({ message: 'Service page not found' });
      return;
    }

    if (req.body.slug !== undefined) page.slug = req.body.slug;
    if (req.body.published !== undefined) page.published = req.body.published;
    if (req.body.sortOrder !== undefined) page.sortOrder = req.body.sortOrder;
    if (req.body.metaTitle !== undefined) page.metaTitle = req.body.metaTitle;
    if (req.body.metaDescription !== undefined) page.metaDescription = req.body.metaDescription;
    if (req.body.keywords !== undefined) page.keywords = req.body.keywords;
    if (req.body.eyebrow !== undefined) page.eyebrow = req.body.eyebrow;
    if (req.body.headline !== undefined) page.headline = req.body.headline;
    if (req.body.subheadline !== undefined) page.subheadline = req.body.subheadline;
    if (req.body.benefits !== undefined) page.benefits = req.body.benefits;
    if (req.body.processSteps !== undefined) page.processSteps = req.body.processSteps;
    if (req.body.faqs !== undefined) page.faqs = req.body.faqs;
    if (req.body.testimonials !== undefined) page.testimonials = req.body.testimonials;
    if (req.body.examples !== undefined) page.examples = req.body.examples;
    if (req.body.recommendedPackageSlug !== undefined) {
      page.recommendedPackageSlug = req.body.recommendedPackageSlug;
    }
    if (req.body.primaryCtaLabel !== undefined) page.primaryCtaLabel = req.body.primaryCtaLabel;
    if (req.body.primaryCtaHref !== undefined) page.primaryCtaHref = req.body.primaryCtaHref;

    await page.save();
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

export async function deleteServicePage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = await ServicePage.findByIdAndDelete(req.params.id);
    if (!page) {
      res.status(404).json({ message: 'Service page not found' });
      return;
    }
    res.json({ message: 'Service page deleted' });
  } catch (err) {
    next(err);
  }
}
