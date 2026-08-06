import { Router } from 'express';
import { signup, login, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../utils/schemas.js';

const router = Router();

router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
