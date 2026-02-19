export type TaskStatus =
    | 'New'
    | 'Ready for Implementation'
    | 'Assigned'
    | 'In Progress'
    | 'Moved to QA'
    | 'QA Failed'
    | 'QA Pass Ready for Stage';

export interface ITask {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    updatedAt: string; // ISO 8601 date string, e.g. "2023-10-27T10:00:00Z"
}

export interface IChatbotResponse {
    reply: string;
    action: 'UPDATE_TASK' | 'CREATE_TASK' | 'DELETE_TASK' | null;
    taskId: number | null;
}
