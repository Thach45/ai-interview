import express from 'express';
import { analysisCVController } from '../../../controllers/v1/client/analysis-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { analyzeCvSchema } from '../../../validations/analysis-cv.validation';

const router = express.Router();

router.post('/analyze', auth, validate(analyzeCvSchema), analysisCVController.analyzeCV);

export default router;
