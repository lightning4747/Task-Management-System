import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <nav className="top-nav">
                <div className="nav-container">
                    <Link to="/board" className="nav-logo">
                        Kanban Board
                    </Link>
                    <div className="nav-links">
                        <Link to="/board" className="nav-link">Board</Link>
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
