import { Router } from 'express';
import { builderCvController } from '../../../controllers/v1/client/builder-cv.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router = Router();

// Tất cả route đều yêu cầu đăng nhập
router.use(auth);

// ===================== CV TEMPLATES =====================
router.get('/templates', builderCvController.getTemplates);
router.get('/templates/:id', builderCvController.getTemplateById);

// ===================== BUILDER CV =====================
// Danh sách & chi tiết
router.get('/', builderCvController.getMyCvs);
router.get('/:id', builderCvController.getCvById);

// Lưu / Cập nhật
router.post('/', builderCvController.saveCv);
router.put('/:id', builderCvController.saveCv);

// Xoá
router.delete('/:id', builderCvController.deleteCv);

// Export PDF
router.post('/:id/export-pdf', builderCvController.exportPdf);

export default router;
