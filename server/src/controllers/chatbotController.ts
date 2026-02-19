import type { Request, Response } from 'express';
import ChatbotService from '../services/chatbotService.js';

class ChatbotController {
    processMessage = async (req: Request, res: Response) => {
        try {
            const { message } = req.body;
            if (!message || typeof message !== 'string') {
                return res.status(400).json({ error: 'Message is required and must be a string' });
            }

            const response = await ChatbotService.processMessage(message);
            res.json({ message: response });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default new ChatbotController();
