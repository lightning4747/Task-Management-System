import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { TaskStatus } from '../types';
import './AddTaskPage.css';

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

const AddTaskPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('New');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await axios.post(`${API_URL}/tasks`, {
                title,
                description,
                status
            });

            // Redirect back to board
            navigate('/board');
        } catch (err: any) {
            console.error('Failed to create task:', err);
            setError('Failed to create task. Please check if the server is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="task-overlay" onClick={() => navigate('/board')}>
            <div className="task-detail-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Task</h2>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="modal-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="task-title">Title</label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-status">Column / Status</label>
                        <select
                            id="task-status"
                            value={status}
                            onChange={e => setStatus(e.target.value as TaskStatus)}
                            className="modal-select"
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-desc">Description</label>
                        <textarea
                            id="task-desc"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={6}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/board')} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskPage;
