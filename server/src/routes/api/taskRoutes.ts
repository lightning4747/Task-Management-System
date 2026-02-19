import { Router } from 'express';
import TaskController from '../../controllers/taskController.js';

const router = Router();

// GET /api/tasks
router.get('/', TaskController.getAllTasks);

// POST /api/tasks
router.post('/', TaskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', TaskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', TaskController.deleteTask);

export default router;
