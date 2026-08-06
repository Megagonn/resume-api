import express from 'express';

import {
  listPublishedPosts,
  getPublishedPost,
  listAdminPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.ts';
import { validateBody } from '../middleware/validate.ts';
import { blogPostSchema } from '../utils/schemas.ts';

const publicBlogRouter = express.Router();
publicBlogRouter.get('/', listPublishedPosts);
publicBlogRouter.get('/:slug', getPublishedPost);

export const adminBlogRouter = express.Router();
adminBlogRouter.get('/', listAdminPosts);
adminBlogRouter.post('/', validateBody(blogPostSchema), createPost);
adminBlogRouter.patch('/:id', validateBody(blogPostSchema.partial()), updatePost);
adminBlogRouter.delete('/:id', deletePost);

export default publicBlogRouter;
