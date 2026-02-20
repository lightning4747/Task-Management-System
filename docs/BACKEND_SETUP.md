# Backend Setup Guide

This guide covers how to set up and run the Node.js/Express backend for the Kanban Task Management system.

## Prerequisites

- **Node.js**: v16 or higher
- **MySQL**: Running locally or accessible via network
- **NPM**: Recommended for dependency management

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=kanban_db
```

*Note: If your MySQL root user has no password, leave `DB_PASS` empty.*

## Database Setup

1. **Initialize Schema**: Run the provided SQL script to create the database and tables.
   ```bash
   mysql -u root -p < src/models/schema.sql
   ```
   *(Or use your preferred MySQL client to execute the contents of `src/models/schema.sql`)*

2. **Sequelize Sync**: The server is configured to automatically sync models with the database on startup. It will NOT overwrite existing data unless explicitly configured to do so.

## Running the Server

### Development Mode
Runs the server with hot-reloading using `tsx watch`:
```bash
npm run dev
```

### Production Mode
Builds the TypeScript code and runs the compiled JavaScript:
```bash
npm run build
npm start
```

## Project Structure

- `src/index.ts`: Application entry point and route registration.
- `src/config/connection.ts`: Sequelize connection setup.
- `src/models/`: Database models (Sequelize).
- `src/controllers/`: Route handlers (Controller layer).
- `src/services/`: Business logic and DB operations (Service layer).
- `src/middleware/`: Express middleware (e.g., error handling).
- `src/routes/`: (Optional) Route definitions if extracted from index.ts.

## Troubleshooting

- **Access Denied**: Double-check your `.env` credentials. Ensure the MySQL user has permissions for `kanban_db`.
- **Port Conflict**: If port 8000 is in use, change the `PORT` in `.env`.
- **Import Errors**: Ensure you are using `.js` extensions in your TypeScript imports as required by the `nodenext` configuration.