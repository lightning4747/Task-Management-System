import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={<Board />} />
          <Route path="/new-task" element={<Board />} /> {/* Both paths render Board */}
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
