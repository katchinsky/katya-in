import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="site-title">
            Markdown Blog
          </Link>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/pages/about">About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="app-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Markdown Blog - Built with React and Vite</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 