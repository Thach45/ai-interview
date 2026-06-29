/**
 * @swagger
 * tags:
 *   name: Analysis-cv
 *   description: API cho Analysis-cv
 */

import express from 'express';
import { analysisCVController } from '../../../controllers/v1/client/analysis-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { analyzeCvSchema } from '../../../validations/analysis-cv.validation';

import { cvOptimizationController } from '../../../controllers/v1/client/cv-optimization.controller';

const router = express.Router();

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/analyze
 * # path: {basePath}/analyze:
 * #   post:
 * #     summary: API POST /analyze
 * #     tags: [Analysis-cv]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/analysis-cv/analyze:
 *   post:
 *     summary: Phân tích điểm mạnh, yếu của CV.
 *     tags: [Analysis-cv]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/analyze', auth, validate(analyzeCvSchema), analysisCVController.analyzeCV);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/optimize
 * # path: {basePath}/optimize:
 * #   post:
 * #     summary: API POST /optimize
 * #     tags: [Analysis-cv]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/analysis-cv/optimize:
 *   post:
 *     summary: Tối ưu hóa nội dung CV.
 *     tags: [Analysis-cv]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/optimize', auth, cvOptimizationController.optimizeCV); // Tạm thời chưa có validate schema để test nhanh
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/export-pdf
 * # path: {basePath}/export-pdf:
 * #   post:
 * #     summary: API POST /export-pdf
 * #     tags: [Analysis-cv]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/analysis-cv/export-pdf:
 *   post:
 *     summary: Xuất CV ra định dạng PDF.
 *     tags: [Analysis-cv]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/export-pdf', auth, cvOptimizationController.exportPdf);

export default router;
