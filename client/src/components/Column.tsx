import React from 'react';
import type { ITask, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
    status: TaskStatus;
    tasks: ITask[];
    onMove: (id: number, newStatus: TaskStatus) => void;
    onDelete: (id: number) => void;
    onDragStart: (e: React.DragEvent, taskId: number) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onTaskClick: (id: number) => void;
    onTaskAdded: () => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onMove, onDelete, onDragStart, onDragEnd, onDrop, onTaskClick }) => {

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        (e.currentTarget as HTMLElement).classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove('drag-over');
    };

    const handleDropInternal = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove('drag-over');
        onDrop(e);
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
                    <span className="column-title">{status}</span>
                    <span className="column-count">{tasks.length}</span>
                </div>
            </div>

            <div className="task-list">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onMove={onMove}
                        onDelete={onDelete}
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
