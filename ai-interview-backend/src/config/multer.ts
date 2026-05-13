import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ tạm thời (trước khi đẩy lên cloud hoặc xử lý)
const storage = multer.memoryStorage();

// Kiểm tra định dạng file
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF, DOC hoặc DOCX'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});
