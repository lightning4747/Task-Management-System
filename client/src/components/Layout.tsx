import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AddTaskModal from './AddTaskModal';

const Layout: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="app-layout">
            <nav className="top-nav">
                <div className="nav-container">
                    <Link to="/board" className="nav-logo">
                        Kanban Board
                    </Link>
                    <div className="nav-links">
                        <button
                            className="nav-btn primary-nav-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + New Task
                        </button>
                        <Link to="/board" className="nav-link">Back to Tasks</Link>
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Layout;
