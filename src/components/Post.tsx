import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post as PostType, loadPost } from '../utils/markdown';
import MarkdownRenderer from './MarkdownRenderer';

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      try {
        const postData = await loadPost(slug);
        if (postData) {
          setPost(postData);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error loading post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !post) {
    return <div className="error">{error || 'Post not found'}</div>;
  }

  return (
    <article className="post">
      <header>
        <h1>{post.metadata.title}</h1>
        {post.metadata.date && (
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </header>
      <MarkdownRenderer content={post.content} />
    </article>
  );
};

export default Post; 