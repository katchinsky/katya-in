import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PostList from './components/PostList';
import Post from './components/Post';
import Page from './components/Page';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PostList />} />
          <Route path="posts/:slug" element={<Post />} />
          <Route path="pages/:slug" element={<Page />} />
          <Route path="*" element={<div className="error">Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 