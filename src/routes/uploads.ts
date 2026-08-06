import { Router } from 'express';
import {
  uploadImageFile,
  uploadDocumentFile,
  uploadAvatar,
  uploadResume,
  uploadCompanyLogo,
} from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadImage, uploadDocument } from '../middleware/upload.js';

const uploadRouter = Router();
uploadRouter.use(authenticate);

uploadRouter.post('/image', uploadImage, uploadImageFile);
uploadRouter.post('/document', uploadDocument, uploadDocumentFile);

uploadRouter.post('/avatar', authorize('seeker', 'hirer', 'admin'), uploadImage, uploadAvatar);
uploadRouter.post('/resume', authorize('seeker'), uploadDocument, uploadResume);
uploadRouter.post('/logo', authorize('hirer'), uploadImage, uploadCompanyLogo);

export default uploadRouter;
