import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Add TypeScript declaration for Buffer in Window
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export interface PostMetadata {
  title: string;
  date?: string;
  slug: string;
  excerpt?: string;
  [key: string]: string | undefined;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

// Simple in-memory cache to reduce redundant fetches
const markdownCache = new Map<string, Post>();

// Helper function to ensure we're using the correct path format
const ensureCorrectPath = (path: string): string => {
  // Make sure path starts with a slash if it doesn't already
  const correctedPath = path.startsWith('/') ? path : `/${path}`;
  return correctedPath;
};

export const loadMarkdownFile = async (path: string): Promise<Post | null> => {
  // Check cache first
  if (markdownCache.has(path)) {
    return markdownCache.get(path)!;
  }

  try {
    const fullPath = ensureCorrectPath(path);
    
    // Use absolute URL to ensure we're fetching from the correct location
    const url = new URL(fullPath, window.location.origin).href;
    
    const response = await fetch(url, {
      // Enable browser caching
      cache: 'force-cache'
    });
    
    if (!response.ok) {
      console.error(`Failed to load markdown file: ${url}`, response.status, response.statusText);
      return null;
    }
    
    const markdown = await response.text();
    
    if (markdown.trim().length === 0) {
      console.error('Markdown file is empty');
      return null;
    }
    
    const { data, content } = matter(markdown);
    
    // Ensure the slug is set - if not present in frontmatter, derive from filename
    if (!data.slug && path.includes('/')) {
      const filename = path.split('/').pop() || '';
      data.slug = filename.replace(/\.md$/, '');
    }
    
    const post = {
      metadata: data as PostMetadata,
      content
    };

    // Cache the result
    markdownCache.set(path, post);
    
    return post;
  } catch (error) {
    console.error(`Error loading markdown file ${path}:`, error);
    return null;
  }
};

// Memoized function to load all posts with caching
let cachedPosts: Post[] | null = null;
export const loadAllPosts = async (): Promise<Post[]> => {
  // Return cached posts if available
  if (cachedPosts) return cachedPosts;

  try {
    const posts = await Promise.all([
      loadMarkdownFile('/content/posts/first-post.md'),
      loadMarkdownFile('/content/posts/second-post.md')
    ]);
    
    const validPosts = posts.filter((post): post is Post => post !== null);
    
    // Sort and cache posts
    cachedPosts = validPosts.sort((a, b) => {
      if (!a.metadata.date || !b.metadata.date) return 0;
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    });
    
    return cachedPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
};

export const loadPage = async (slug: string): Promise<Post | null> => {
  const path = `/content/pages/${slug}.md`;
  return await loadMarkdownFile(path);
};

export const loadPost = async (slug: string): Promise<Post | null> => {
  return await loadMarkdownFile(`/content/posts/${slug}.md`);
}; 