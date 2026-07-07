import { Router } from 'express';
import { cvTemplateClientController } from '../../../controllers/v1/client/cv-template.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router = Router();

// Templates có thể được truy cập khi đã đăng nhập
router.use(auth);

router.get('/', cvTemplateClientController.getTemplates);
router.get('/:id', cvTemplateClientController.getTemplateById);

export default router;
