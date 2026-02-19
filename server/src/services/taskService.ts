import Task from '../models/Task.js';

class TaskService {
    async getAllTasks() {
        return await Task.findAll();
    }

    async createTask(data: { title: string; description?: string; status?: Task['status'] }) {
        return await Task.create(data);
    }

    async updateTask(id: number, data: { title?: string; description?: string; status?: Task['status'] }) {
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
