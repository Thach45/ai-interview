import express from 'express';
import { userController } from '../../../controllers/v1/client/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { upload } from '../../../config/multer';

const router = express.Router();

// Upload CV (Dùng middleware upload.single('file'))
router.post('/upload', auth, upload.single('file'), userController.uploadCv);

// Lấy danh sách CV của tôi
router.get('/my-cvs', auth, userController.getMyCvs);

export default router;
