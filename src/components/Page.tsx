import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Post as PostType, loadPage } from '../utils/markdown';
import MarkdownRenderer from './MarkdownRenderer';

const Page: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [page, setPage] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      console.log(`Page component mounted with slug: ${slug}`);
      console.log(`Current location: ${location.pathname}`);
      
      if (!slug) {
        console.error('No slug provided in URL params');
        setError('Page slug not provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`Attempting to load page with slug: ${slug}`);
        const pageData = await loadPage(slug);
        
        if (pageData) {
          console.log('Page loaded successfully:', pageData.metadata);
          setPage(pageData);
        } else {
          console.error(`Page not found for slug: ${slug}`);
          // Try to diagnose the issue
          fetch(`/content/pages/${slug}.md`)
            .then(response => {
              console.log(`Direct fetch status for ${slug}.md:`, response.status, response.statusText);
              return response.text();
            })
            .then(text => {
              console.log(`First 100 chars of response:`, text.substring(0, 100));
            })
            .catch(e => {
              console.error('Direct fetch error:', e);
            });
            
          setError(`Page "${slug}" not found. Check if the file exists at /content/pages/${slug}.md`);
        }
      } catch (err) {
        console.error('Error loading page:', err);
        setError(`Failed to load page: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    fetchPage();
  }, [slug, location.pathname]);

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (error || !page) {
    return <div className="error">{error || 'Page not found'}</div>;
  }

  return (
    <article className="page">
      <header>
        <h1>{page.metadata.title}</h1>
      </header>
      <MarkdownRenderer content={page.content} />
    </article>
  );
};

export default Page; 