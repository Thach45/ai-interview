import express from 'express';
import { builderCvController } from '../../../controllers/v1/client/builder-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { upload } from '../../../config/multer';

const router = express.Router();

// Upload CV (Dùng middleware upload.single('file'))
router.post('/upload', auth, upload.single('file'), builderCvController.uploadCv);

// Lấy danh sách CV của tôi
router.get('/my-cvs', auth, builderCvController.getMyCvs);

// Xóa CV của tôi
router.delete('/:id', auth, builderCvController.deleteCv);

export default router;
