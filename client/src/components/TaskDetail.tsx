import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { ITask } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<ITask | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/tasks/${id}`);
                setTask(response.data);
            } catch (err: any) {
                console.error('Failed to fetch task detail:', err);
                setError('Task not found or the server is unavailable.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTask();
        }
    }, [id]);

    if (isLoading) return <div className="loading">Loading task details...</div>;
    if (error || !task) return (
        <div className="error">
            {error ?? 'Task not found.'} <Link to="/tasks">Go back</Link>
        </div>
    );

    return (
        <div className="task-detail-container">
            <Link to="/tasks" className="back-link">← Back to Board</Link>

            <div className="task-detail-card">
                <h1 className="task-detail-title">{task.title}</h1>
                <div className="task-detail-status">
                    <span className="status-label">Status:</span>
                    <span className="status-value">{task.status}</span>
                </div>
                <div className="task-detail-desc">
                    <h2>Description</h2>
                    <p>{task.description}</p>
                </div>
                <div className="task-detail-meta">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{new Date(task.createdAt).toLocaleString()}</span>
                </div>
                <div className="task-detail-meta">
                    <span className="meta-label">Last Updated:</span>
                    <span className="meta-value">{new Date(task.updatedAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
