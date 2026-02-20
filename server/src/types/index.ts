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
}

export interface IChatbotResponse {
    message: string;
}
