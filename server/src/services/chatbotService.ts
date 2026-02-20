import TaskService from './taskService.js';
import { TASK_STATUSES, type TaskStatus } from '../models/Task.js';

// ── Command regexes ──────────────────────────────────────────────────────────
const MOVE_RE = /^move\s+(\d+)\s+to\s+(.+)/i;
const DELETE_RE = /^delete\s+(\d+)$/i;
const UPDATE_RE = /^update\s+(\d+)\s+title:\s*(.+)/i;

// ── Help text ────────────────────────────────────────────────────────────────
const HELP = `Available commands:
• move [ID] to [Status]         — move a task to a new status column
• delete [ID]                   — permanently delete a task
• update [ID] title: [New Title] — rename a task

Valid statuses: ${TASK_STATUSES.join(' | ')}`;

class ChatbotService {
    async processMessage(message: string): Promise<string> {
        const text = message.trim();

        // ── MOVE ──────────────────────────────────────────────────────────
        const moveMatch = text.match(MOVE_RE);
        if (moveMatch) {
            const taskId = parseInt(moveMatch[1]!, 10);
            const rawStatus = moveMatch[2]!.trim();

            const validStatus = TASK_STATUSES.find(
                s => s.toLowerCase() === rawStatus.toLowerCase()
            );

            if (!validStatus) {
                return `Unknown status: "${rawStatus}".\nValid statuses: ${TASK_STATUSES.join(', ')}`;
            }

            try {
                const task = await TaskService.updateTask(taskId, { status: validStatus as TaskStatus });
                return `✓ Task #${taskId} moved to "${validStatus}".`;
            } catch (err: any) {
                const notFound = err.message?.toLowerCase().includes('not found');
                return notFound
                    ? `Task #${taskId} not found.`
                    : `Error: ${err.message}`;
            }
        }

        // ── DELETE ────────────────────────────────────────────────────────
        const deleteMatch = text.match(DELETE_RE);
        if (deleteMatch) {
            const taskId = parseInt(deleteMatch[1]!, 10);

            try {
                await TaskService.deleteTask(taskId);
                return `✓ Task #${taskId} has been deleted.`;
            } catch (err: any) {
                const notFound = err.message?.toLowerCase().includes('not found');
                return notFound
                    ? `Task #${taskId} not found.`
                    : `Error: ${err.message}`;
            }
        }

        // ── UPDATE TITLE ──────────────────────────────────────────────────
        const updateMatch = text.match(UPDATE_RE);
        if (updateMatch) {
            const taskId = parseInt(updateMatch[1]!, 10);
            const newTitle = updateMatch[2]!.trim();

            if (!newTitle) {
                return 'Title cannot be empty.';
            }

            try {
                await TaskService.updateTask(taskId, { title: newTitle });
                return `✓ Task #${taskId} renamed to "${newTitle}".`;
            } catch (err: any) {
                const notFound = err.message?.toLowerCase().includes('not found');
                return notFound
                    ? `Task #${taskId} not found.`
                    : `Error: ${err.message}`;
            }
        }

        // ── HELP / UNKNOWN ────────────────────────────────────────────────
        if (/^help$/i.test(text)) {
            return HELP;
        }

        return `I didn't understand that. Type "help" to see available commands.`;
    }
}

export default new ChatbotService();