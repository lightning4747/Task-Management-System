import TaskService from './taskService.js';
import { TASK_STATUSES, type TaskStatus } from '../models/Task.js';

class ChatbotService {
    async processMessage(message: string): Promise<string> {
        const moveRegex = /move (\d+) to (.+)/i;
        const match = message.match(moveRegex);

        if (match) {
            const taskId = parseInt(match[1] as string, 10);
            const newStatus = (match[2] as string).trim();

            // Validate status
            const validStatus = TASK_STATUSES.find(
                (status) => status.toLowerCase() === newStatus.toLowerCase()
            );

            if (!validStatus) {
                return `Invalid status: "${newStatus}". Valid statuses are: ${TASK_STATUSES.join(', ')}`;
            }

            try {
                await TaskService.updateTask(taskId, { status: validStatus as TaskStatus });
                return `Task ${taskId} moved to ${validStatus}`;
            } catch (error: any) {
                return `Error updating task: ${error.message}`;
            }
        }

        return 'I did not understand that command. Try "move [ID] to [Status]".';
    }
}

export default new ChatbotService();