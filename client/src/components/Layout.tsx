import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const location = useLocation();

    // Consider the board page as: /tasks (the main board route)
    const isBoardPage = location.pathname === '/tasks' || location.pathname === '/';

    return (
        <div className="app-layout">
            <nav className="top-nav">
                <div className="nav-container">
                    <Link to="/tasks" className="nav-logo">
                        Kanban Board
                    </Link>
                    <div className="nav-links">
                        <Link
                            to="/tasks/new"
                            className="nav-btn primary-nav-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            + New Task
                        </Link>
                        {!isBoardPage && (
                            <Link to="/tasks" className="nav-link">Back to Tasks</Link>
                        )}
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
