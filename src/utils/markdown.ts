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
const slugToPathCache = new Map<string, string>();
let cachedPosts: Post[] | null = null;
let postsDirectory: string | null = null;

// Helper function to ensure we're using the correct path format
const ensureCorrectPath = (path: string): string => {
  // Make sure path starts with a slash if it doesn't already
  const correctedPath = path.startsWith('/') ? path : `/${path}`;
  return correctedPath;
};

// Function to discover which directory contains our posts
const discoverPostsDirectory = async (): Promise<string | null> => {
  if (postsDirectory) return postsDirectory;
  
  // Definitive list of possible locations for posts
  const possiblePaths = [
    '/public/content/posts',  // Prioritize this path
    'public/content/posts',
    '/content/posts',
    'content/posts'
  ];
  
  // Try each path to see if we can find any markdown files
  for (const basePath of possiblePaths) {
    try {
      // Construct full URL to check
      const url = new URL(basePath, window.location.origin).href;
      
      // Try to fetch a known post
      const knownPostNames = ['first-post.md', 'markdown-guide.md', 'new-post.md', 'sample.md'];
      
      for (const postName of knownPostNames) {
        const testUrl = new URL(`${basePath}/${postName}`, window.location.origin).href;
        
        try {
          const testResponse = await fetch(testUrl, { method: 'HEAD' });
          
          if (testResponse.ok) {
            console.log(`[Markdown Loader] Found posts directory at: ${basePath}`);
            postsDirectory = basePath;
            return basePath;
          }
        } catch (fetchError) {
          console.warn(`[Markdown Loader] Error checking post ${postName} at ${basePath}:`, fetchError);
        }
      }
    } catch (error) {
      console.warn(`[Markdown Loader] Error checking path ${basePath}:`, error);
    }
  }
  
  console.error('[Markdown Loader] Could not find posts directory');
  return null;
};

// Function to list all markdown files in the posts directory
const listMarkdownFiles = async (): Promise<string[]> => {
  const basePath = await discoverPostsDirectory();
  if (!basePath) return [];
  
  // Use the new directory listing method
  const markdownFiles = await listMarkdownFilesInDirectory();
  
  // Prepend the base path to each filename, ensuring correct path construction
  return markdownFiles.map((filename: string) => {
    // Remove any leading slashes from both basePath and filename
    const cleanBasePath = basePath.replace(/^\/+/, '');
    const cleanFilename = filename.replace(/^\/+/, '');
    
    // Construct path ensuring no duplicate slashes
    return `/${cleanBasePath}/${cleanFilename}`;
  });
};

// Function to list all markdown files in the posts directory
const listMarkdownFilesInDirectory = async (): Promise<string[]> => {
  try {
    // Attempt to read the posts list from the text file
    const response = await fetch('/content/posts/posts.txt', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn('[Markdown Loader] Could not fetch posts list, falling back to known posts');
      return ['first-post.md', 'markdown-guide.md', 'second-post.md', 'new-post.md', 'sample.md', 'meowwww.md'];
    }
    
    // Read the text file and split into lines, removing empty lines and trimming whitespace
    const postsText = await response.text();
    const posts = postsText.split('\n')
      .map(post => post.trim())
      .filter(post => post.length > 0 && post.endsWith('.md'));
    
    console.log('[Markdown Loader] Loaded posts from posts.txt:', posts);
    
    return posts.length > 0 ? posts : ['first-post.md', 'markdown-guide.md', 'second-post.md', 'new-post.md', 'sample.md', 'meowwww.md'];
  } catch (error) {
    console.error('[Markdown Loader] Error reading posts list:', error);
    return ['first-post.md', 'markdown-guide.md', 'second-post.md', 'new-post.md', 'sample.md', 'meowwww.md'];
  }
};

export const loadMarkdownFile = async (path: string): Promise<Post | null> => {
  // Check cache first
  if (markdownCache.has(path)) {
    return markdownCache.get(path)!;
  }

  try {
    // Normalize path to remove duplicate slashes and ensure correct format
    const normalizedPath = path
      .replace(/^\/+/, '/')  // Remove multiple leading slashes
      .replace(/\/\/+/g, '/');  // Remove multiple consecutive slashes
        
    let markdown = '';
    // Construct full URL, ensuring no double slashes
    const fullUrl = new URL(normalizedPath, window.location.origin).href
    .replace(/([^:]\/)\/+/g, '$1');  // Remove duplicate slashes, but preserve protocol
      
    console.log(`[Markdown Loader] Trying to fetch from: ${fullUrl}`);
      
    const response = await fetch(fullUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'text/markdown, text/plain, */*'
      }
    });
    
    if (response.ok) {
      markdown = await response.text();
      
      // Detailed check for Vite development response
      const isViteResponse = markdown.includes('<!doctype html>') || 
                            markdown.includes('<script type="module">') || 
                            markdown.includes('import RefreshRuntime');
      
      if (!isViteResponse) {
        console.log(`[Markdown Loader] Successfully fetched markdown from: ${fullUrl}`);
      } else {
        console.warn(`[Markdown Loader] Received Vite HTML response for: ${fullUrl}`);
      }
    }
    
    if (!markdown) {
      console.error(`[Markdown Loader] Failed to load markdown file: ${path}`);
      return null;
    }
    
    if (markdown.trim().length === 0) {
      console.error('[Markdown Loader] Markdown file is empty');
      return null;
    }
    
    // Parse the markdown with gray-matter
    const { data, content } = matter(markdown);
    
    // Derive slug from filename if not present in frontmatter
    let slug = data.slug;
    if (!slug && path.includes('/')) {
      const filename = path.split('/').pop() || '';
      slug = filename.replace(/\.md$/, '');
    }
    
    // Create post metadata
    const metadata: PostMetadata = {
      title: data.title || slug,
      slug: slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 100) + '...'
    };
    
    const post = {
      metadata,
      content
    };

    // Cache the result
    markdownCache.set(path, post);
    slugToPathCache.set(slug, path);
    
    return post;
  } catch (error) {
    console.error(`[Markdown Loader] Comprehensive error loading markdown file ${path}:`, error);
    return null;
  }
};

export const loadAllPosts = async (): Promise<Post[]> => {
  // Return cached posts if available
  if (cachedPosts) return cachedPosts;

  try {
    console.log('[Markdown Loader] Starting to load all posts');
    
    // Get the posts directory
    const basePath = await discoverPostsDirectory();
    if (!basePath) {
      console.error('[Markdown Loader] Could not determine posts directory');
      return [];
    }
    
    // List all markdown files in the directory
    const markdownFiles = await listMarkdownFiles();
    console.log('[Markdown Loader] Found markdown files:', markdownFiles);
    
    if (markdownFiles.length === 0) {
      console.warn('[Markdown Loader] No markdown files found');
      return [];
    }
    
    // Load each markdown file
    const posts: Post[] = [];
    const loadErrors: string[] = [];
    
    for (const filename of markdownFiles) {
      try {
        const post = await loadMarkdownFile(filename);
        if (post) {
          posts.push(post);
          console.log(`[Markdown Loader] Successfully loaded post: ${filename}`);
        } else {
          loadErrors.push(filename);
        }
      } catch (error) {
        console.error(`[Markdown Loader] Error loading post ${filename}:`, error);
        loadErrors.push(filename);
      }
    }
    
    if (loadErrors.length > 0) {
      console.warn(`[Markdown Loader] Failed to load ${loadErrors.length} files:`, loadErrors);
    }
    
    if (posts.length === 0 && markdownFiles.length > 0) {
      console.error('[Markdown Loader] Found markdown files but failed to load any posts');
    }
    
    // Sort posts by date (most recent first)
    cachedPosts = posts.sort((a, b) => {
      if (!a.metadata.date || !b.metadata.date) return 0;
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    });
    
    console.log(`[Markdown Loader] Successfully loaded ${posts.length} posts`);
    
    return cachedPosts;
  } catch (error) {
    console.error('[Markdown Loader] Error loading all posts:', error);
    return [];
  }
};

export const loadPost = async (slug: string): Promise<Post | null> => {
  console.log(`[Markdown Loader] Loading post with slug: ${slug}`);
  
  try {
    // Check if we already know the path for this slug
    if (slugToPathCache.has(slug)) {
      const cachedPath = slugToPathCache.get(slug)!;
      const post = await loadMarkdownFile(cachedPath);
      if (post) return post;
    }
    
    // Get posts directory
    const basePath = await discoverPostsDirectory();
    if (!basePath) {
      console.error('[Markdown Loader] Could not determine posts directory');
      return null;
    }
    
    // Try different possible filenames for this slug
    const possibleFilenames = [
      `${slug}.md`,                  // slug exactly matches filename
      `${slug.replace(/-/g, '_')}.md`, // replace hyphens with underscores
      `${slug.replace(/_/g, '-')}.md`  // replace underscores with hyphens
    ];
    
    for (const filename of possibleFilenames) {
      const path = `${basePath}/${filename}`;
      const post = await loadMarkdownFile(path);
      if (post) return post;
    }
    
    // If not found by filename, try loading all posts and find by slug
    const allPosts = await loadAllPosts();
    const matchingPost = allPosts.find(post => post.metadata.slug === slug);
    
    if (matchingPost) {
      return matchingPost;
    }
    
    console.error(`[Markdown Loader] Post not found with slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(`[Markdown Loader] Error loading post with slug: ${slug}`, error);
    return null;
  }
};

export const loadPage = async (slug: string): Promise<Post | null> => {
  // Try to discover pages directory similar to posts
  const possiblePaths = [
    `/content/pages/${slug}.md`,
    `/public/content/pages/${slug}.md`,
    `content/pages/${slug}.md`,
    `public/content/pages/${slug}.md`
  ];
  
  // Try each path
  for (const path of possiblePaths) {
    const post = await loadMarkdownFile(path);
    if (post) return post;
  }
  
  return null;
};
        