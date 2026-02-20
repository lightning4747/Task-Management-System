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
    createdAt: string;
    updatedAt: string;
    // --- INTEGRATED FRONTEND FIELDS (Optional to prevent DB errors) ---
    category?: string;
    priority?: 'Low' | 'Medium' | 'High';
    comments?: number;
    dueDate?: string;
    assigneeAvatar?: string;
}

export interface IChatbotResponse {
    message: string; // Your Backend Field
    // --- INTEGRATED FRONTEND FIELDS ---
    reply?: string; 
    action?: 'UPDATE_TASK' | 'CREATE_TASK' | 'DELETE_TASK' | null;
    taskId?: number | null;
}