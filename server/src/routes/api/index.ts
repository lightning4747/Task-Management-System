import { Router } from 'express';
import taskRoutes from './taskRoutes.js';
import chatbotRoutes from './chatbotRoutes.js';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;
