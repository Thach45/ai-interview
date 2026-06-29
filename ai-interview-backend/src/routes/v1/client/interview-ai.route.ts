/**
 * @swagger
 * tags:
 *   name: Interview-ai
 *   description: API cho Interview-ai
 */

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
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/setup
 * # path: {basePath}/setup:
 * #   post:
 * #     summary: API POST /setup
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/setup:
 *   post:
 *     summary: Khởi tạo cấu hình ban đầu.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/setup', auth, validate(interviewAISchema), interviewAIController.setupInterview);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   get:
 * #     summary: API GET /:id
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết phòng phỏng vấn.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', auth, interviewAIController.getInterview);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/messages
 * # path: {basePath}/:id/messages:
 * #   get:
 * #     summary: API GET /:id/messages
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/messages:
 *   get:
 *     summary: Lấy lịch sử chat.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id/messages', auth, interviewAIController.getInterviewMessages); // Bổ sung API lấy lịch sử tin nhắn
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/stream
 * # path: {basePath}/:id/stream:
 * #   get:
 * #     summary: API GET /:id/stream
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/stream:
 *   get:
 *     summary: Nhận tin nhắn AI realtime (SSE).
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id/stream', auth, interviewAIController.streamInterviewEvents); // Bổ sung API SSE stream
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/start
 * # path: {basePath}/:id/start:
 * #   post:
 * #     summary: API POST /:id/start
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/start:
 *   post:
 *     summary: Bắt đầu phiên phỏng vấn.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/:id/start', auth, interviewAIController.startInterview);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/chat
 * # path: {basePath}/:id/chat:
 * #   post:
 * #     summary: API POST /:id/chat
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/chat:
 *   post:
 *     summary: Gửi câu trả lời Text.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/:id/chat', auth, chatRateLimiter, interviewAIController.sendChatMessage);
router.post(
  '/:id/chat-audio',
  auth,
  chatRateLimiter,
  upload.single('audio'),
  validate(chatMessageWithTTSSchema),
  interviewAIController.sendChatMessageWithTTS,
);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/submit
 * # path: {basePath}/:id/submit:
 * #   post:
 * #     summary: API POST /:id/submit
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/submit:
 *   post:
 *     summary: Nộp bài kết thúc.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/:id/submit', auth, interviewAIController.submitInterviewResult);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/result
 * # path: {basePath}/:id/result:
 * #   get:
 * #     summary: API GET /:id/result
 * #     tags: [Interview-ai]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/interview-ai/{id}/result:
 *   get:
 *     summary: Lấy kết quả đánh giá.
 *     tags: [Interview-ai]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id/result', auth, interviewAIController.getInterviewResult);

export default router;
