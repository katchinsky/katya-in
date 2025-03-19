#!/bin/bash

# Set the directory paths
POSTS_DIR="/Users/kate-chuprun/projects/obsidian-blog/public/content/posts"
OUTPUT_FILE="/Users/kate-chuprun/projects/obsidian-blog/public/content/posts/posts.txt"

# Ensure the output directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Check if posts directory exists
if [ ! -d "$POSTS_DIR" ]; then
    echo "Error: Posts directory not found at $POSTS_DIR"
    exit 1
fi

# Find all markdown files and write their names to the output file
find "$POSTS_DIR" -maxdepth 1 -type f -name "*.md" -exec basename {} \; | sort > "$OUTPUT_FILE"

echo "Updated posts list at $OUTPUT_FILE:"
cat "$OUTPUT_FILE" 