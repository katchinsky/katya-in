import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="site-title">
            Katya In
          </Link>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/pages/about">About</Link>
              </li>
              <li>
                <Link to="/pages/now">Now</Link>
              </li>
            </ul>
          </nav>
          <div className="theme-toggle-container">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="app-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Katya In - Built with React and Vite</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 