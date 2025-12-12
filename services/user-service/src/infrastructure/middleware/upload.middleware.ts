import multer from 'multer';
import { Request } from 'express';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIMETYPES.join(', ')}`));
    return;
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
