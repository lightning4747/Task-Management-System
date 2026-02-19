import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';

export const TASK_STATUSES = [
    'New',
    'Ready for Implementation',
    'Assigned',
    'In Progress',
    'Moved to QA',
    'QA Failed',
    'QA Pass Ready for Stage',
] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

class Task extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: TaskStatus;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...TASK_STATUSES),
            defaultValue: 'New',
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks',
    }
);

export default Task;
