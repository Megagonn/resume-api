import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { uploadBuffer } from '../services/cloudinary.ts';
import { User } from '../models/User.ts';
import { Company } from '../models/Company.ts';
import { publicUser } from '../utils/auth.ts';

const FOLDER_ROOT = 'ready-brand';

function requireFile(req: AuthRequest, res: Response): Express.Multer.File | null {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded. Use multipart field "file".' });
    return null;
  }
  return req.file;
}

export async function uploadImageFile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = requireFile(req, res);
    if (!file) return;

    const uploaded = await uploadBuffer(file.buffer, {
      folder: `${FOLDER_ROOT}/images`,
      resourceType: 'image',
      filename: file.originalname,
    });

    res.status(201).json({ file: uploaded });
  } catch (err) {
    next(err);
  }
}

export async function uploadDocumentFile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = requireFile(req, res);
    if (!file) return;

    const uploaded = await uploadBuffer(file.buffer, {
      folder: `${FOLDER_ROOT}/documents`,
      resourceType: 'raw',
      filename: file.originalname,
    });

    res.status(201).json({ file: uploaded });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = requireFile(req, res);
    if (!file) return;

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const uploaded = await uploadBuffer(file.buffer, {
      folder: `${FOLDER_ROOT}/avatars`,
      resourceType: 'image',
      filename: file.originalname,
    });

    user.avatarUrl = uploaded.url;
    await user.save();

    res.status(201).json({ file: uploaded, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function uploadResume(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = requireFile(req, res);
    if (!file) return;

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const uploaded = await uploadBuffer(file.buffer, {
      folder: `${FOLDER_ROOT}/resumes`,
      resourceType: 'raw',
      filename: file.originalname,
    });

    user.seekerProfile = { ...user.seekerProfile, resumeUrl: uploaded.url };
    await user.save();

    res.status(201).json({ file: uploaded, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function uploadCompanyLogo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = requireFile(req, res);
    if (!file) return;

    let company = await Company.findOne({ hirerId: req.user!.id });
    if (!company) {
      res.status(404).json({ message: 'Create a company profile first' });
      return;
    }

    const uploaded = await uploadBuffer(file.buffer, {
      folder: `${FOLDER_ROOT}/logos`,
      resourceType: 'image',
      filename: file.originalname,
    });

    company.logo = uploaded.url;
    await company.save();

    res.status(201).json({ file: uploaded, company });
  } catch (err) {
    next(err);
  }
}
