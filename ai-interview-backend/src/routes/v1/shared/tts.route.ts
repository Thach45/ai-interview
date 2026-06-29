/**
 * @swagger
 * tags:
 *   name: Tts
 *   description: API cho Tts
 */

import { Router } from 'express';
import { ttsController } from '../../../shared/controllers/tts.controller';
import { auth } from '../../../middlewares/auth.middleware';
const router: Router = Router();

// POST /api/v1/tts -> Chuyển đổi văn bản thành giọng nói (cần truyền { "text": "..." } trong body)
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   post:
 * #     summary: API POST /
 * #     tags: [Tts]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/tts:
 *   post:
 *     summary: Chuyển đổi Text sang Audio.
 *     tags: [Tts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', auth, ttsController.synthesizeSpeech);

// GET /api/v1/tts -> Hoặc có thể dùng query parameters: ?text=...
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Tts]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/tts:
 *   get:
 *     summary: Lấy stream âm thanh TTS.
 *     tags: [Tts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', auth, ttsController.synthesizeSpeech);

export default router;
