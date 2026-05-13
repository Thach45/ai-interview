import express, { Router } from 'express';
import { jobCategoryController } from '../../../controllers/v1/admin/job-category.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  createJobCategorySchema,
  updateJobCategorySchema,
} from '../../../validations/job-category.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

// GET /api/v1/admin/categories        → Cây 3 tầng đầy đủ
router.get('/', jobCategoryController.getTree);

// GET /api/v1/admin/categories/flat   → Flat list, filter ?type=GROUP|INDUSTRY|POSITION
router.get('/flat', jobCategoryController.getAll);

// GET /api/v1/admin/categories/:id    → Chi tiết 1 danh mục
router.get('/:id', jobCategoryController.getById);

// POST /api/v1/admin/categories       → Tạo mới
router.post('/', validate(createJobCategorySchema), jobCategoryController.create);

// PUT /api/v1/admin/categories/:id    → Cập nhật tên
router.put('/:id', validate(updateJobCategorySchema), jobCategoryController.update);

// DELETE /api/v1/admin/categories/:id → Xóa (từ chối nếu còn children)
router.delete('/:id', jobCategoryController.delete);

export default router;
