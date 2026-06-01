import express from 'express';
import { interviewAIController } from '../../../controllers/v1/client/interview-ai.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { interviewAISchema } from '../../../validations/interview-ai.validation';

const router = express.Router();

// Upload CV (Dùng middleware upload.single('file'))
router.post('/setup', auth, validate(interviewAISchema), interviewAIController.setupInterview);
router.get('/:id', auth, interviewAIController.getInterview);
router.post('/:id/start', auth, interviewAIController.startInterview);
router.post('/:id/chat', auth, interviewAIController.sendChatMessage);
router.post('/:id/submit', auth, interviewAIController.submitInterviewResult);
router.get('/:id/result', auth, interviewAIController.getInterviewResult);

export default router;
