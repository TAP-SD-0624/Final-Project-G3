import multer, { StorageEngine } from 'multer';

const storage: StorageEngine = multer.memoryStorage();

const memoryUpload = multer({
  storage,
  limits: {
    fileSize: 2000000, // 2 MB limit for file size.
  },
});

export default memoryUpload;
