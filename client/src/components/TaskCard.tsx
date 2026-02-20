import React from 'react';
import type { ITask, TaskStatus } from '../types';

interface TaskCardProps {
    task: ITask;
    onMove: (id: number, newStatus: TaskStatus) => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onClick: () => void;
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

const TaskCard: React.FC<TaskCardProps> = ({ task, onMove, onDragStart, onDragEnd, onClick }) => {
    const currentIndex = STATUS_ORDER.indexOf(task.status);
    const prevStatus = currentIndex > 0 ? STATUS_ORDER[currentIndex - 1] : null;
    const nextStatus = currentIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIndex + 1] : null;

    return (
        <div
            className="task-card"
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
        >
            <h3 className="task-card-title">
                {task.title}
            </h3>
            <p className="task-card-desc">{task.description}</p>

            <div className="task-card-actions" onClick={e => e.stopPropagation()}>
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
