import React from 'react';
import type { ITask, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
    status: TaskStatus;
    tasks: ITask[];
    onMove: (id: number, newStatus: TaskStatus) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onMove }) => {
    return (
        <div className="column">
            <h2 className="column-header">
                {status.toUpperCase()} ({tasks.length})
            </h2>
            <div className="task-list">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onMove={onMove} />
                ))}
            </div>
        </div>
    );
};

export default Column;
