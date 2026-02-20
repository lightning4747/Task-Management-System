// server/src/services/taskService.ts
import Task from '../models/Task.js';

class TaskService {
    async getAllTasks() {
        return await Task.findAll();
    }

    // New method to support your friend's popup/modal logic
    async getTaskById(id: number) {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        return task;
    }

    async createTask(data: { title: string; description?: string; status?: any }) {
        return await Task.create(data);
    }

    async updateTask(id: number, data: { title?: string; description?: string; status?: any }) {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        return await task.update(data);
    }

    async deleteTask(id: number) {
        const task = await Task.findByPk(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        await task.destroy();
        return { message: 'Task deleted successfully' };
    }
}

export default new TaskService();