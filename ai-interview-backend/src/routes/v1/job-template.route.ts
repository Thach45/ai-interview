import { Router } from 'express';
import { jobTemplateController } from '../../controllers/v1/job-template.controller';

const router: Router = Router();

// Các route cho admin quản lý job templates
router.get('/', jobTemplateController.getAll);
router.get('/:id', jobTemplateController.getById);
router.post('/', jobTemplateController.create);
router.put('/:id', jobTemplateController.update);
router.delete('/:id', jobTemplateController.delete);

export default router;
