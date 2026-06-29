/**
 * @swagger
 * tags:
 *   name: User
 *   description: API cho User
 */

import express, { Router } from 'express';
import { userController } from '../../../controllers/v1/admin/user.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { adminCreateUserSchema, adminUpdateUserSchema } from '../../../validations/user.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin)
 */
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Lấy danh sách tài khoản.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', userController.getAll);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Xem chi tiết người dùng.
 *     tags: [User]
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
router.get('/:id', userController.getById);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Tạo tài khoản mới.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', validate(adminCreateUserSchema), userController.create);

/**
 * @route   PATCH /api/v1/admin/users/:id
 * @desc    Update user
 * @access  Private (Admin)
 */
/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   patch:
 *     summary: Khóa/mở khóa người dùng.
 *     tags: [User]
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
router.patch('/:id', validate(adminUpdateUserSchema), userController.update);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Xóa người dùng.
 *     tags: [User]
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
router.delete('/:id', userController.delete);

export default router;
