import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <nav className="top-nav">
                <div className="nav-container">

                    {/* ── Left: Brand ────────────────────────────────── */}
                    <Link to="/tasks" className="nav-logo" id="nav-logo-link">
                        <span className="nav-logo-icon">⬡</span>
                        Kanban
                    </Link>

                    {/* ── Right: Actions ─────────────────────────────── */}
                    <div className="nav-actions">
                        <Link
                            to="/tasks/new"
                            id="nav-new-task-btn"
                            className="nav-btn primary-nav-btn"
                            style={{ textDecoration: 'none' }}
                        >
                            <Plus size={14} strokeWidth={3} />
                            New Task
                        </Link>
                        <ThemeToggle />
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
