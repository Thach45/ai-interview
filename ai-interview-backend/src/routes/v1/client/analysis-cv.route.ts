import express from 'express';
import { analysisCVController } from '../../../controllers/v1/client/analysis-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { analyzeCvSchema } from '../../../validations/analysis-cv.validation';

import { cvOptimizationController } from '../../../controllers/v1/client/cv-optimization.controller';

const router = express.Router();

router.post('/analyze', auth, validate(analyzeCvSchema), analysisCVController.analyzeCV);
router.post('/optimize', auth, cvOptimizationController.optimizeCV); // Tạm thời chưa có validate schema để test nhanh
router.post('/export-pdf', auth, cvOptimizationController.exportPdf);

export default router;
