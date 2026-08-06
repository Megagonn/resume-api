import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const DOC_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const DOC_MAX_BYTES = 10 * 1024 * 1024;

function fileFilter(allowed: Set<string>) {
  return (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowed.has(file.mimetype)) {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
      return;
    }
    cb(null, true);
  };
}

const memory = multer.memoryStorage();

const imageUploader = multer({
  storage: memory,
  limits: { fileSize: IMAGE_MAX_BYTES, files: 1 },
  fileFilter: fileFilter(IMAGE_MIME),
}).single('file');

const documentUploader = multer({
  storage: memory,
  limits: { fileSize: DOC_MAX_BYTES, files: 1 },
  fileFilter: fileFilter(DOC_MIME),
}).single('file');

function wrapMulter(uploader: typeof imageUploader) {
  return (req: Request, res: Response, next: NextFunction): void => {
    uploader(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ message: 'File too large' });
          return;
        }
        res.status(400).json({ message: err.message });
        return;
      }
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
        return;
      }
      next();
    });
  };
}

export const uploadImage = wrapMulter(imageUploader);
export const uploadDocument = wrapMulter(documentUploader);
