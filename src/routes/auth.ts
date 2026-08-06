import express from 'express';

import { signup, login, me } from '../controllers/authController.ts';
import { authenticate } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { signupSchema, loginSchema } from '../utils/schemas.ts';

const router = express.Router();

router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
