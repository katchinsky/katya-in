import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage for saved theme preference on initial load
    const savedTheme = localStorage.getItem('theme');
    
    // Determine initial theme
    const initialIsDarkMode = savedTheme === null ? true : savedTheme === 'dark';
    
    // Set the initial theme state
    setIsDarkMode(initialIsDarkMode);

    // Apply the initial theme to the body
    if (initialIsDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    
    // Update state
    setIsDarkMode(newMode);
    
    // Update local storage
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    // Update body class
    if (newMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
}; 