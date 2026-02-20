import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './components/Board';
import AddTaskPage from './components/AddTaskPage';
import TaskDetail from './components/TaskDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/*
           * /tasks        → Kanban board  (GET /api/tasks)
           *   /tasks/new  → Create modal  (POST /api/tasks)   — rendered ON TOP of the board
           *   /tasks/:id  → Detail modal  (PUT·DELETE /api/tasks/:id) — rendered ON TOP of the board
           * Both child routes render as overlays via Board's <Outlet />
           */}
          <Route path="/tasks" element={<Board />}>
            <Route path="new" element={<AddTaskPage />} />
            <Route path=":id" element={<TaskDetail />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/board" element={<Navigate to="/tasks" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
