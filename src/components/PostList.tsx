import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Post, loadAllPosts } from '../utils/markdown';

// Lazy load the MarkdownRenderer to reduce initial bundle size
const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'));

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      console.log('[PostList] Starting to fetch posts');
      
      const allPosts = await loadAllPosts();
      
      console.log('[PostList] Loaded posts:', allPosts);
      
      if (allPosts.length === 0) {
        console.warn('[PostList] No posts were loaded');
        // This is not really an error, just an empty state
        setError(null);
      } else {
        setError(null);
      }
      
      setPosts(allPosts);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading posts...</p>
        <p className="loading-detail">Dynamically discovering markdown files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Posts</h2>
        <p>{error}</p>
        <details>
          <summary>Troubleshooting Tips</summary>
          <ul>
            <li>Ensure markdown files are in the correct directory (public/content/posts)</li>
            <li>Check that frontmatter is correctly formatted</li>
            <li>Verify file permissions and server configuration</li>
            <li>Try refreshing the page</li>
          </ul>
        </details>
        <div className="actions">
          <button onClick={refreshPosts} className="action-button">
            Retry Loading Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h1>Home</h1>
        <div className="header-underline">vvvvvvvvv</div>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty">
          <h2>No Posts Found</h2>
          <p>There are currently no blog posts available.</p>
          <p>To add a post, create a markdown file in the <code>public/content/posts</code> directory.</p>
          <details>
            <summary>Common Issues</summary>
            <ul>
              <li>The blog is looking for markdown files in <code>public/content/posts/*.md</code></li>
              <li>Make sure your markdown files have the <code>.md</code> extension</li>
              <li>Make sure your development server has the correct permissions</li>
              <li>During development, Vite may need to be restarted to detect new files</li>
            </ul>
          </details>
        </div>
      ) : (
        <div className="post-list-content">
          {posts.map((post) => (
            <article key={post.metadata.slug} className="post-preview">
              <h2>
                <Link to={`/posts/${post.metadata.slug}`}>{post.metadata.title}</Link>
              </h2>
              {post.metadata.date && (
                <time dateTime={post.metadata.date}>
                  {new Date(post.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {post.metadata.excerpt && (
                <Suspense fallback={<div>Loading content...</div>}>
                  <div className="excerpt">
                    <MarkdownRenderer content={post.metadata.excerpt} />
                  </div>
                </Suspense>
              )}
              <Link to={`/posts/${post.metadata.slug}`} className="read-more">
                Read More
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 