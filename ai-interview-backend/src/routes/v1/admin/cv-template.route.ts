import { Router } from 'express';
import { CvTemplateController } from '../../../controllers/v1/admin/cv-template.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router = Router();

// Tất cả các route này yêu cầu quyền Admin
router.use(auth, authorize('ADMIN'));

router.get('/', CvTemplateController.getTemplates);
router.get('/:id', CvTemplateController.getTemplateById);
router.post('/', CvTemplateController.createTemplate);
router.put('/:id', CvTemplateController.updateTemplate);
router.delete('/:id', CvTemplateController.deleteTemplate);

export default router;
