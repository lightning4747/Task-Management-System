-- 1. Setup the environment
DROP DATABASE IF EXISTS kanban_db;
CREATE DATABASE kanban_db;

USE kanban_db;

-- 2. Create the Tasks table with your specific logic
CREATE TABLE tasks (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Using ENUM ensures only your 7 specific stages are allowed
    status ENUM(
        'New',
        'Ready for Implementation',
        'Assigned',
        'In Progress',
        'Moved to QA',
        'QA Failed',
        'QA Pass Ready for Stage'
    ) DEFAULT 'New' NOT NULL,

    -- Timestamps for auditing and board sorting
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Optional: Basic Index for performance as the board grows
CREATE INDEX idx_status ON tasks(status);