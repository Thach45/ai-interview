import { Router } from 'express';
import { ttsController } from '../../../shared/controllers/tts.controller';
import { auth } from '../../../middlewares/auth.middleware';
const router: Router = Router();

// POST /api/v1/tts -> Chuyển đổi văn bản thành giọng nói (cần truyền { "text": "..." } trong body)
router.post('/', auth, ttsController.synthesizeSpeech);

// GET /api/v1/tts -> Hoặc có thể dùng query parameters: ?text=...
router.get('/', auth, ttsController.synthesizeSpeech);

export default router;
