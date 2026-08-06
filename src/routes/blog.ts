import { Router } from 'express';
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

const publicBlogRouter = Router();
publicBlogRouter.get('/', listPublishedPosts);
publicBlogRouter.get('/:slug', getPublishedPost);

export const adminBlogRouter = Router();
adminBlogRouter.get('/', listAdminPosts);
adminBlogRouter.post('/', validateBody(blogPostSchema), createPost);
adminBlogRouter.patch('/:id', validateBody(blogPostSchema.partial()), updatePost);
adminBlogRouter.delete('/:id', deletePost);

export default publicBlogRouter;
