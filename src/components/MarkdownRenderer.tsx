import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  onError?: (errorMsg: string) => void;
}

// Create a type declaration file for react-markdown
declare module 'react-markdown' {
  interface CodeProps {
    node: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onError }) => {
  // Log content for debugging
  console.log('Rendering markdown content:', content.substring(0, 100) + '...');
  
  try {
    return (
      <div className="markdown-content">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error('Error rendering markdown:', error);
    
    // Call onError callback if provided
    if (onError) {
      onError(error instanceof Error ? error.message : 'Unknown markdown rendering error');
    }
    
    // Fallback to plain text rendering
    return (
      <div className="markdown-content error">
        <p>Error rendering markdown content. Unable to display.</p>
      </div>
    );
  }
};

export default MarkdownRenderer; 