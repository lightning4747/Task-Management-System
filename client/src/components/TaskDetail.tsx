import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { ITask, TaskStatus } from '../types';
import './TaskDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const STATUSES: TaskStatus[] = [
    'New',
    'Ready for Implementation',
    'Assigned',
    'In Progress',
    'Moved to QA',
    'QA Failed',
    'QA Pass Ready for Stage',
];

// ── Delete Confirmation Dialog ─────────────────────────────────────────────
interface ConfirmDialogProps {
    taskTitle: string;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ taskTitle, isDeleting, onCancel, onConfirm }) => (
    <div className="confirm-overlay" onClick={onCancel}>
        <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <span className="confirm-icon">🗑️</span>
            <h3>Delete Task?</h3>
            <p>
                "<strong>{taskTitle}</strong>" will be permanently deleted.
                This action cannot be undone.
            </p>
            <div className="confirm-actions">
                <button className="confirm-cancel-btn" onClick={onCancel} disabled={isDeleting}>
                    Cancel
                </button>
                <button className="confirm-delete-btn" onClick={onConfirm} disabled={isDeleting}>
                    {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
            </div>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────
const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const close = () => navigate('/tasks');

    // ── Fetch state ──────────────────────────────────────────────────────
    const [task, setTask] = useState<ITask | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // ── Edit state ───────────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState<TaskStatus>('New');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // ── Delete state ─────────────────────────────────────────────────────
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── GET /api/tasks/:id ────────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        const fetchTask = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const { data } = await axios.get<ITask>(`${API_URL}/tasks/${id}`);
                setTask(data);
            } catch (err: any) {
                console.error('Failed to fetch task:', err);
                setFetchError('Task not found or the server is unavailable.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    // ── Enter edit mode ──────────────────────────────────────────────────
    const handleEditStart = () => {
        if (!task) return;
        setEditTitle(task.title);
        setEditDescription(task.description ?? '');
        setEditStatus(task.status);
        setSaveError(null);
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setSaveError(null);
    };

    // ── PUT /api/tasks/:id ────────────────────────────────────────────────
const handleSave = async () => {
    if (!editTitle.trim()) { setSaveError('Title cannot be empty.'); return; }
    setIsSaving(true);
    setSaveError(null);
    try {
        const { data } = await axios.put<ITask>(`${API_URL}/tasks/${id}`, {
            title: editTitle.trim(),
            description: editDescription.trim(),
            status: editStatus,
        });
        
        setTask(data);
        
        // --- ADD THIS LINE ---
        window.dispatchEvent(new CustomEvent('task-updated'));
        // ---------------------

        setIsEditing(false);
    } catch (err: any) {
        // ... error handling
    } finally {
        setIsSaving(false);
    }
};

    // ── DELETE /api/tasks/:id ─────────────────────────────────────────────
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            navigate('/tasks');
        } catch (err: any) {
            console.error('Failed to delete task:', err);
            setIsDeleting(false);
            setShowConfirm(false);
            setSaveError('Failed to delete the task. Please try again.');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <>
            {showConfirm && (
                <ConfirmDialog
                    taskTitle={task?.title ?? ''}
                    isDeleting={isDeleting}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleDelete}
                />
            )}

            {/* Backdrop — click outside closes the modal */}
            <div className="task-overlay" onClick={close}>
                <div className="task-detail-modal" onClick={e => e.stopPropagation()}>

                    {/* ── Modal header bar ──────────────────────────────── */}
                    <div className="modal-header">
                        <span className="task-id-badge">TASK-{id}</span>
                        <button className="modal-close-btn" onClick={close}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* ── Body ─────────────────────────────────────────── */}
                    {isLoading ? (
                        <div className="modal-loading">Loading…</div>
                    ) : fetchError ? (
                        <div className="modal-form">
                            <div className="detail-feedback error">{fetchError}</div>
                            <button className="cancel-btn" onClick={close}>Close</button>
                        </div>
                    ) : task ? (
                        <div className="modal-form">

                            {saveError && (
                                <div className="detail-feedback error">{saveError}</div>
                            )}

                            {/* Title */}
                            {isEditing ? (
                                <div className="form-group">
                                    <label htmlFor="edit-title" className="detail-edit-label">Title</label>
                                    <input
                                        id="edit-title"
                                        className="detail-edit-input"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        placeholder="Task title…"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <h2 className="modal-task-title">{task.title}</h2>
                            )}

                            {/* Status */}
                            <div className="form-group">
                                <label className="detail-edit-label">Status</label>
                                {isEditing ? (
                                    <select
                                        id="edit-status"
                                        className="modal-select"
                                        value={editStatus}
                                        onChange={e => setEditStatus(e.target.value as TaskStatus)}
                                    >
                                        {STATUSES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="status-value">{task.status}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label className="detail-edit-label">Description</label>
                                {isEditing ? (
                                    <textarea
                                        id="edit-description"
                                        className="detail-edit-textarea"
                                        value={editDescription}
                                        onChange={e => setEditDescription(e.target.value)}
                                        placeholder="Add more details…"
                                        rows={5}
                                    />
                                ) : (
                                    <p className="modal-task-desc">
                                        {task.description || <em style={{ opacity: 0.5 }}>No description provided.</em>}
                                    </p>
                                )}
                            </div>

                            {/* Timestamps */}
                            <div className="modal-meta-row">
                                <span className="meta-label">Created:</span>
                                <span className="meta-value">{new Date(task.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="modal-meta-row">
                                <span className="meta-label">Last Updated:</span>
                                <span className="meta-value">{new Date(task.updatedAt).toLocaleString()}</span>
                            </div>

                            {/* ── Actions ─────────────────────────────────── */}
                            <div className="task-detail-actions">
                                {isEditing ? (
                                    /* Edit mode: Save · Cancel · Delete */
                                    <>
                                        <button
                                            className="submit-btn"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            <Check size={14} />
                                            {isSaving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={handleEditCancel}
                                            disabled={isSaving}
                                        >
                                            <X size={14} />
                                            Cancel
                                        </button>
                                        <button
                                            className="detail-delete-btn"
                                            onClick={() => setShowConfirm(true)}
                                            disabled={isSaving}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    /* View mode: Edit only */
                                    <button className="submit-btn" onClick={handleEditStart}>
                                        <Pencil size={14} />
                                        Edit Task
                                    </button>
                                )}
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default TaskDetail;
