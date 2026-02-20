import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { ITask, TaskStatus } from '../types';
import Column from './Column';
import Chatbot from './Chatbot';
import { MOCK_TASKS } from '../constants/mockData';
import './Board.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const [tasks, setTasks] = useState<ITask[]>(MOCK_TASKS);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            setTasks(response.data);
        } catch (err: any) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load tasks. Using mock data.');
            // Keep MOCK_TASKS if fetch fails
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const moveTask = async (id: number, newStatus: TaskStatus) => {
        try {
            await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
            await fetchTasks();
        } catch (err: any) {
            console.error('Failed to move task:', err);
            alert('Failed to move task. Please try again.');
        }
    };

    if (isLoading && tasks.length === 0) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="board-container">
            {error && <div className="error-banner">{error}</div>}
            <div className="board-grid">
                {STATUSES.map(status => (
                    <Column
                        key={status}
                        status={status}
                        tasks={tasks.filter(t => t.status === status)}
                        onMove={moveTask}
                    />
                ))}
            </div>
            <Chatbot onTaskChange={fetchTasks} />
        </div>
    );
};

export default Board;
