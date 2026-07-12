import express from 'express';
import { analysisCVController } from '../../../controllers/v1/client/analysis-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  analyzeCvWithTemplateSchema,
  analyzeCvWithExternalJobSchema,
} from '../../../validations/analysis-cv.validation';

import { cvOptimizationController } from '../../../controllers/v1/client/cv-optimization.controller';
import { analysisCVRateLimiter } from '../../../middlewares/rate-limit.middleware';

const router = express.Router();

router.get('/result', auth, analysisCVController.getAnalysisCV);
router.get('/history', auth, analysisCVController.getHistoryAnalysisCvResult);
router.get('/:id', auth, analysisCVController.getAnalysisCvById);
router.post(
  '/analyze/template',
  auth,
  analysisCVRateLimiter,
  validate(analyzeCvWithTemplateSchema),
  analysisCVController.analyzeCVWithTemplate,
);
router.post(
  '/analyze/external',
  auth,
  analysisCVRateLimiter,
  validate(analyzeCvWithExternalJobSchema),
  analysisCVController.analyzeCVWithExternalJob,
);
router.post('/optimize', auth, analysisCVRateLimiter, cvOptimizationController.optimizeCV); // Tạm thời chưa có validate schema để test nhanh
router.post('/export-pdf', auth, analysisCVRateLimiter, cvOptimizationController.exportPdf);

export default router;
