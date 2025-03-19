import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Post, loadAllPosts } from '../utils/markdown';

// Lazy load the MarkdownRenderer to reduce initial bundle size
const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'));

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await loadAllPosts();
        setPosts(allPosts);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading posts...
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="empty">No posts found.</div>;
  }

  return (
    <div className="post-list">
      <h1>Blog Posts</h1>
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
            Read more
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PostList; 