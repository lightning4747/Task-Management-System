import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import type { ITask, TaskStatus } from '../types';
import Column from './Column';
import Chatbot from './Chatbot';
import './Board.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // GET /api/tasks
    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            setTasks(response.data);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load tasks. Please check if the server is running.');
        } finally {
            setIsLoading(false);
        }
    }, []);

useEffect(() => {
    fetchTasks();

    const handleRefresh = () => {
        fetchTasks();
        showNotification('Board updated!');
    };

    // Listen for both adding and updating
    window.addEventListener('task-added', handleRefresh);
    window.addEventListener('task-updated', handleRefresh); // Add this line

    return () => {
        window.removeEventListener('task-added', handleRefresh);
        window.removeEventListener('task-updated', handleRefresh); // Add this line
    };
}, [fetchTasks]);

    // PUT /api/tasks/:id  (status change via drag-and-drop or move buttons)
    const moveTask = async (id: number, newStatus: TaskStatus) => {
        try {
            await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
            await fetchTasks();
            showNotification(`Task moved to ${newStatus}`);
        } catch (err: any) {
            console.error('Failed to move task:', err);
            showNotification('Failed to move task');
        }
    };

    // DELETE /api/tasks/:id  (quick delete from card)
    const deleteTask = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            await fetchTasks();
            showNotification('Task deleted successfully');
        } catch (err: any) {
            console.error('Failed to delete task:', err);
            showNotification('Failed to delete task');
        }
    };

    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.setData('taskId', taskId.toString());
        e.dataTransfer.effectAllowed = 'move';
        const target = e.target as HTMLElement;
        target.classList.add('dragging-card');
        setTimeout(() => target.classList.remove('dragging-card'), 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).classList.remove('dragging-card');
    };

    const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) moveTask(taskId, newStatus);
    };

    // Navigate to /tasks/:id — TaskDetail renders as an overlay via <Outlet />
    const handleTaskClick = (id: number) => {
        navigate(`/tasks/${id}`);
    };

    if (isLoading && tasks.length === 0) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="board-container">
            {error && <div className="error-banner">{error}</div>}

            {notification && (
                <div className="success-toast">
                    <span className="toast-icon">✓</span>
                    {notification}
                </div>
            )}

            <div className="board-grid">
                {STATUSES.map(status => (
                    <Column
                        key={status}
                        status={status}
                        tasks={tasks.filter(t => t.status === status)}
                        onMove={moveTask}
                        onDelete={deleteTask}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, status)}
                        onTaskClick={handleTaskClick}
                        onTaskAdded={fetchTasks}
                    />
                ))}
            </div>

            {/*
             * Child routes (/tasks/new, /tasks/:id) render here as overlays.
             * The board grid stays fully mounted and visible underneath.
             */}
            <Outlet />

            <Chatbot />
        </div>
    );
};

export default Board;
