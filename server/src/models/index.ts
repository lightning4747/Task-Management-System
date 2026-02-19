import sequelize from '../config/connection.js';
import Task from './Task.js';

// Re-export models so the rest of the app imports from one place
export { Task };

// Sync all models with the database.
// `force: false` means it will NOT drop and re-create existing tables.
// Run this once at startup via src/index.ts (sequelize.sync is called there).
export default sequelize;
