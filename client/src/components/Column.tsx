import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, X } from 'lucide-react';
import type { ITask, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
    status: TaskStatus;
    tasks: ITask[];
    onMove: (id: number, newStatus: TaskStatus) => void;
    onDragStart: (e: React.DragEvent, taskId: number) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onTaskClick: (id: number) => void;
    onTaskAdded: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Column: React.FC<ColumnProps> = ({ status, tasks, onMove, onDragStart, onDragEnd, onDrop, onTaskClick, onTaskAdded }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAdding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAdding]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const target = e.currentTarget as HTMLElement;
        target.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('drag-over');
    };

    const handleDropInternal = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('drag-over');
        onDrop(e);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await axios.post(`${API_URL}/tasks`, {
                title: newTitle,
                description: '',
                status: status
            });
            setNewTitle('');
            setIsAdding(false);
            onTaskAdded();
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    return (
        <div
            className="column"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropInternal}
        >
            <div className="column-header">
                <div className="column-header-info">
                    {status.toUpperCase()} ({tasks.length})
                </div>
                <button className="add-task-btn" onClick={() => setIsAdding(true)}>
                    <Plus size={14} />
                </button>
            </div>

            <div className={`task-list ${isAdding ? 'dim-background' : ''}`}>
                {isAdding && (
                    <form className="inline-add-card" onSubmit={handleCreateTask}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Task Title..."
                            className="inline-input"
                        />
                        <div className="inline-actions">
                            <button type="submit" className="save-btn"><Check size={14} /></button>
                            <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}><X size={14} /></button>
                        </div>
                    </form>
                )}

                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onMove={onMove}
                        onDragStart={(e) => onDragStart(e, task.id)}
                        onDragEnd={onDragEnd}
                        onClick={() => onTaskClick(task.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Column;
