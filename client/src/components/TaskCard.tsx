import React from 'react';
import { Link } from 'react-router-dom';
import type { ITask, TaskStatus } from '../types';

interface TaskCardProps {
    task: ITask;
    onMove: (id: number, newStatus: TaskStatus) => void;
}

const STATUS_ORDER: TaskStatus[] = [
    'New',
    'Ready for Implementation',
    'Assigned',
    'In Progress',
    'Moved to QA',
    'QA Failed',
    'QA Pass Ready for Stage'
];

const TaskCard: React.FC<TaskCardProps> = ({ task, onMove }) => {
    const currentIndex = STATUS_ORDER.indexOf(task.status);
    const prevStatus = currentIndex > 0 ? STATUS_ORDER[currentIndex - 1] : null;
    const nextStatus = currentIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIndex + 1] : null;

    return (
        <div className="task-card">
            <Link to={`/task/${task.id}`} className="task-card-title">
                {task.title}
            </Link>
            <p className="task-card-desc">{task.description}</p>

            <div className="task-card-actions">
                {prevStatus && (
                    <button
                        className="move-btn back-btn"
                        onClick={() => onMove(task.id, prevStatus)}
                    >
                        ← Back
                    </button>
                )}
                {nextStatus && (
                    <button
                        className="move-btn forward-btn"
                        onClick={() => onMove(task.id, nextStatus)}
                    >
                        Forward →
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
