import express from 'express';

import {
  uploadImageFile,
  uploadDocumentFile,
  uploadAvatar,
  uploadResume,
  uploadCompanyLogo,
} from '../controllers/uploadController.ts';
import { authenticate, authorize } from '../middleware/auth.ts';
import { uploadImage, uploadDocument } from '../middleware/upload.ts';

const uploadRouter = express.Router();
uploadRouter.use(authenticate);

uploadRouter.post('/image', authorize('seeker', 'hirer', 'admin'), uploadImage, uploadImageFile);
uploadRouter.post('/document', authorize('seeker', 'hirer', 'admin'), uploadDocument, uploadDocumentFile);
uploadRouter.post(
  '/order-delivery',
  authorize('admin'),
  uploadDocument,
  uploadDocumentFile
);

uploadRouter.post('/avatar', authorize('seeker', 'hirer', 'admin'), uploadImage, uploadAvatar);
uploadRouter.post('/resume', authorize('seeker'), uploadDocument, uploadResume);
uploadRouter.post('/logo', authorize('hirer'), uploadImage, uploadCompanyLogo);

export default uploadRouter;
