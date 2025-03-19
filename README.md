# Obsidian-like Markdown Blog

A simple static blog built with React.js + Vite that supports Markdown content. It loads content from an Obsidian-like directory structure.

## Features

- Markdown rendering with syntax highlighting
- Front matter support for metadata
- Responsive design
- Support for blog posts and static pages
- Simple navigation

## Directory Structure

The content is organized in an Obsidian-like structure:

```
public/
  content/
    posts/       # Blog posts
      first-post.md
      second-post.md
    pages/       # Static pages
      about.md
```

## Post Format

Posts should be written in Markdown with front matter at the top:

```markdown
---
title: My First Blog Post
date: 2023-06-01
slug: first-post
excerpt: This is a summary of my post.
---

# Content starts here

This is my blog post content...
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Building and Running

1. Clone the repository
```bash
git clone https://github.com/katchinsky/katya-in.git
cd katya-in
```

2. Build and run the container
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Development with Docker
- To rebuild the image: `docker-compose build`
- To start the container: `docker-compose up`
- To stop the container: `docker-compose down`

### Adding Content
- Place markdown files in the `public/content/posts/` directory
- The content will be automatically served by the container

## Technologies Used

- React.js
- TypeScript
- Vite
- React Router
- React Markdown
- gray-matter (for front matter parsing)

## License

MIT
