import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import type { ITask } from '../types';
import './TaskDrawer.css';

interface TaskDrawerProps {
    taskId: number;
    onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TaskDrawer: React.FC<TaskDrawerProps> = ({ taskId, onClose }) => {
    const [task, setTask] = useState<ITask | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/tasks/${taskId}`);
                setTask(response.data);
            } catch (err) {
                console.error('Failed to fetch task details:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    if (!taskId) return null;

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <div className="drawer-header-left">
                        {task?.status === 'QA Pass Ready for Stage' && (
                            <span className="status-badge completed">
                                <CheckCircle size={14} /> Done
                            </span>
                        )}
                        <span className="task-id">TASK-{taskId}</span>
                    </div>
                    <button className="drawer-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="drawer-loading">Loading...</div>
                ) : task ? (
                    <div className="drawer-body">
                        <h1 className="drawer-title">{task.title}</h1>

                        <div className="drawer-section">
                            <h3>Description</h3>
                            <p className="drawer-description">{task.description}</p>
                        </div>

                        <div className="drawer-info-grid">
                            <div className="info-item">
                                <label><User size={14} /> Status</label>
                                <span className="info-value">{task.status}</span>
                            </div>
                            <div className="info-item">
                                <label><Calendar size={14} /> Created</label>
                                <span className="info-value">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="info-item">
                                <label><Clock size={14} /> Last Updated</label>
                                <span className="info-value">
                                    {new Date(task.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="drawer-error">Task not found.</div>
                )}
            </div>
        </div>
    );
};

export default TaskDrawer;
