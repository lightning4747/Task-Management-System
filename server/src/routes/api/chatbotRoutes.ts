import { Router } from 'express';
import ChatbotController from '../../controllers/chatbotController.js';

const router = Router();

// POST /api/chatbot
router.post('/', ChatbotController.processMessage);

export default router;
