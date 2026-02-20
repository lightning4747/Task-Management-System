import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './components/Board';
import AddTaskPage from './components/AddTaskPage';
import TaskDetailPage from './components/TaskDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Redirect root to /tasks (matches GET /api/tasks) */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/* GET /api/tasks → Kanban board showing all tasks */}
          <Route path="/tasks" element={<Board />} />

          {/* POST /api/tasks → Create a new task */}
          <Route path="/tasks/new" element={<AddTaskPage />} />

          {/* GET /api/tasks/:id → Task detail view */}
          <Route path="/tasks/:id" element={<TaskDetailPage />} />

          {/* Legacy /board redirect */}
          <Route path="/board" element={<Navigate to="/tasks" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
