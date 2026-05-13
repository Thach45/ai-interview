import { Router } from 'express';
import { jobCategoryController } from '../../../controllers/v1/admin/job-category.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// ==========================================
// CLIENT ROUTES CHO JOB CATEGORY (Người dùng)
// Yêu cầu đăng nhập nhưng không yêu cầu ADMIN
// ==========================================

// GET /api/v1/categories        → Lấy toàn bộ cây danh mục
router.get('/', auth, jobCategoryController.getTree);

// GET /api/v1/categories/flat   → Lấy danh sách phẳng (có hỗ trợ filter)
router.get('/flat', auth, jobCategoryController.getAll);

// GET /api/v1/categories/:id    → Lấy chi tiết 1 danh mục
router.get('/:id', auth, jobCategoryController.getById);

export default router;
