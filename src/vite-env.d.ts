/// <reference types="vite/client" />

declare module 'react-markdown' {
  import React from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: Record<string, React.ComponentType<any>>;
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element;
}

declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export const Prism: React.ComponentType<any>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const vscDarkPlus: any;
  export { vscDarkPlus };
}

declare module 'rehype-raw' {
  const rehypeRaw: any;
  export default rehypeRaw;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'gray-matter' {
  function matter(content: string): { data: Record<string, any>, content: string };
  export default matter;
}
