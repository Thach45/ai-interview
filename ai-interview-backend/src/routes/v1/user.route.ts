import express, { Router } from 'express';
import { userController } from '../../controllers/v1/user.controller';
import { auth, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
} from '../../validations/user.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin)
 */
router.get('/', userController.getAll);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
router.get('/:id', userController.getById);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
router.post('/', validate(adminCreateUserSchema), userController.create);

/**
 * @route   PATCH /api/v1/admin/users/:id
 * @desc    Update user
 * @access  Private (Admin)
 */
router.patch('/:id', validate(adminUpdateUserSchema), userController.update);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/:id', userController.delete);

export default router;
