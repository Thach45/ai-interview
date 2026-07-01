import { Router } from 'express';
import { CvTemplateController } from '../../../controllers/v1/admin/cv-template.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router = Router();

router.get('/', CvTemplateController.getTemplates);
router.get('/:id', CvTemplateController.getTemplateById);
router.post('/', auth, authorize('ADMIN'), CvTemplateController.createTemplate);
router.put('/:id', auth, authorize('ADMIN'), CvTemplateController.updateTemplate);
router.delete('/:id', CvTemplateController.deleteTemplate);

export default router;
