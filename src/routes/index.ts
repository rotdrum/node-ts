import { Router } from 'express';
import { homeController, homeAboutController } from '../controllers/home.controller';
import AuthMiddleware from '../middleware/authentication.middleware';

const router = Router();

router.get('/', homeController);
router.get('/about', AuthMiddleware , homeAboutController);

export default router;
