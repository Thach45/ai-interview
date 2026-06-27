import express from 'express';
import { interviewAIController } from '../../../controllers/v1/client/interview-ai.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  interviewAISchema,
  chatMessageWithTTSSchema,
} from '../../../validations/interview-ai.validation';
import multer from 'multer';
import { chatRateLimiter } from '../../../middlewares/rate-limit.middleware';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Upload CV (Dùng middleware upload.single('file'))
router.post('/setup', auth, validate(interviewAISchema), interviewAIController.setupInterview);
router.get('/:id', auth, interviewAIController.getInterview);
router.post('/:id/start', auth, interviewAIController.startInterview);
router.post('/:id/chat', auth, chatRateLimiter, interviewAIController.sendChatMessage);
router.post(
  '/:id/chat-audio',
  auth,
  chatRateLimiter,
  upload.single('audio'),
  validate(chatMessageWithTTSSchema),
  interviewAIController.sendChatMessageWithTTS,
);
router.post('/:id/submit', auth, interviewAIController.submitInterviewResult);
router.get('/:id/result', auth, interviewAIController.getInterviewResult);

export default router;
