import { Router } from 'express';
import { jobCategoryController } from '../../../controllers/v1/admin/job-category.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// ==========================================
// CLIENT ROUTES CHO JOB CATEGORY (Người dùng)
// Yêu cầu đăng nhập nhưng không yêu cầu ADMIN
// ==========================================

// GET /api/v1/categories        → Lấy toàn bộ cây danh mục
router.get('/', jobCategoryController.getTree);

// Lấy danh sách danh mục phẳng
router.get('/flat', jobCategoryController.getAll);

// Lấy chi tiết 1 danh mục
router.get('/:id', jobCategoryController.getById);

export default router;
