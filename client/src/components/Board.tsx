import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import type { ITask, TaskStatus } from '../types';
import Column from './Column';
import Chatbot from './Chatbot';
import TaskDrawer from './TaskDrawer';
import AddTaskPage from './AddTaskPage';
import { MOCK_TASKS } from '../constants/mockData';
import './Board.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUSES: TaskStatus[] = [
    'New',
    'Ready for Implementation',
    'Assigned',
    'In Progress',
    'Moved to QA',
    'QA Failed',
    'QA Pass Ready for Stage'
];

const Board: React.FC = () => {
    const [tasks, setTasks] = useState<ITask[]>(MOCK_TASKS);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const location = useLocation();
    const isAddingNew = location.pathname === '/new-task';

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            setTasks(response.data);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load tasks. Using mock data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();

        window.addEventListener('task-added', fetchTasks);
        return () => window.removeEventListener('task-added', fetchTasks);
    }, [fetchTasks]);

    const moveTask = async (id: number, newStatus: TaskStatus) => {
        try {
            await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
            await fetchTasks();
        } catch (err: any) {
            console.error('Failed to move task:', err);
            alert('Failed to move task. Please try again.');
        }
    };

    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.setData('taskId', taskId.toString());
        e.dataTransfer.effectAllowed = 'move';

        const target = e.target as HTMLElement;
        target.classList.add('dragging-card');
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove('dragging-card');
    };

    const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const task = tasks.find(t => t.id === taskId);

        if (task && task.status !== newStatus) {
            moveTask(taskId, newStatus);
        }
    };

    const handleOpenDetail = (id: number) => {
        setSelectedTaskId(id);
    };

    if (isLoading && tasks.length === 0) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className={`board-container ${selectedTaskId || isAddingNew ? 'drawer-open' : ''}`}>
            {error && <div className="error-banner">{error}</div>}
            <div className={`board-grid ${isAddingNew ? 'content-blur' : ''}`}>
                {STATUSES.map(status => (
                    <Column
                        key={status}
                        status={status}
                        tasks={tasks.filter(t => t.status === status)}
                        onMove={moveTask}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, status)}
                        onTaskClick={handleOpenDetail}
                        onTaskAdded={fetchTasks}
                    />
                ))}
            </div>

            {selectedTaskId && (
                <TaskDrawer
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}

            {isAddingNew && <AddTaskPage />}

            <Chatbot />
        </div>
    );
};

export default Board;
