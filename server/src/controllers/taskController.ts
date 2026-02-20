import type { Request, Response } from 'express';
import TaskService from '../services/taskService.js';

class TaskController {
    getAllTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await TaskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createTask = async (req: Request, res: Response) => {
        try {
            const { title, description, status } = req.body;
            const task = await TaskService.createTask({ title, description, status });
            res.status(201).json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    updateTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'Task ID is required' });
                return;
            }

            const { title, description, status } = req.body;
            const task = await TaskService.updateTask(parseInt(id as string, 10), { title, description, status });
            res.status(200).json(task);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        await TaskService.deleteTask(parseInt(id, 10));
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};
getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        //Guard clause
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Valid Task ID is required' });
        }

        const task = await TaskService.getTaskById(parseInt(id,10));
        res.status(200).json(task);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};
}

export default new TaskController();
