import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { ITask, TaskStatus } from '../types';
import Column from './Column';
import Chatbot from './Chatbot';
import TaskDrawer from './TaskDrawer';
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
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

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

        const handleTaskAdded = () => {
            fetchTasks();
            showNotification('Task created successfully!');
        };

        window.addEventListener('task-added', handleTaskAdded);
        return () => window.removeEventListener('task-added', handleTaskAdded);
    }, [fetchTasks]);

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

        // Remove from original element after browser takes a ghost image snapshot
        setTimeout(() => {
            target.classList.remove('dragging-card');
        }, 0);
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
        <div className={`board-container ${selectedTaskId ? 'drawer-open' : ''}`}>
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

            <Chatbot />
        </div>
    );
};

export default Board;
