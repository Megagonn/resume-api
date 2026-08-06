import { Response, NextFunction } from 'express';
import { BlogPost } from '../models/BlogPost.js';
import { AuthRequest } from '../middleware/auth.js';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function listPublishedPosts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query.q ? String(req.query.q) : '';
    const filter: Record<string, unknown> = { published: true };
    if (q) filter.$text = { $search: q };

    const posts = await BlogPost.find(filter)
      .populate('authorId', 'name')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

export async function getPublishedPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    }).populate('authorId', 'name');

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function listAdminPosts(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await BlogPost.find()
      .populate('authorId', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const slug = req.body.slug?.trim() || slugify(req.body.title);
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      res.status(409).json({ message: 'Slug already exists' });
      return;
    }

    const published = Boolean(req.body.published);
    const post = await BlogPost.create({
      title: req.body.title,
      slug,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage,
      authorId: req.user!.id,
      published,
      publishedAt: published ? new Date() : undefined,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.slug !== undefined) post.slug = req.body.slug;
    if (req.body.excerpt !== undefined) post.excerpt = req.body.excerpt;
    if (req.body.content !== undefined) post.content = req.body.content;
    if (req.body.coverImage !== undefined) post.coverImage = req.body.coverImage;

    if (req.body.published !== undefined) {
      const nextPublished = Boolean(req.body.published);
      if (nextPublished && !post.published) {
        post.publishedAt = new Date();
      }
      if (!nextPublished) {
        post.publishedAt = undefined;
      }
      post.published = nextPublished;
    }

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}
