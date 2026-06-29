/**
 * @swagger
 * tags:
 *   name: Cv
 *   description: API cho Cv
 */

import express from 'express';
import { userController } from '../../../controllers/v1/client/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { upload } from '../../../config/multer';

const router = express.Router();

// Upload CV (Dùng middleware upload.single('file'))
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/upload
 * # path: {basePath}/upload:
 * #   post:
 * #     summary: API POST /upload
 * #     tags: [Cv]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/cvs/upload:
 *   post:
 *     summary: Upload file CV.
 *     tags: [Cv]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/upload', auth, upload.single('file'), userController.uploadCv);

// Lấy danh sách CV của tôi
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/my-cvs
 * # path: {basePath}/my-cvs:
 * #   get:
 * #     summary: API GET /my-cvs
 * #     tags: [Cv]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/cvs/my-cvs:
 *   get:
 *     summary: Lấy danh sách các CV.
 *     tags: [Cv]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/my-cvs', auth, userController.getMyCvs);

export default router;
