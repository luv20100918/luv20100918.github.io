#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Fix image paths in markdown content
function fixImagePaths(content) {
  // Fix markdown image syntax: ![alt](/content/images/...) stays the same
  // The images are already correctly referenced as /content/images/
  // which maps to public/content/images/ in Astro
  
  // Fix any potential issues with image paths
  let fixed = content;
  
  // Fix if there are any relative paths without leading slash
  fixed = fixed.replace(/!\[([^\]]*)\]\(content\/images\//g, '![$1](/content/images/');
  
  // Fix if there are any with double slashes
  fixed = fixed.replace(/!\[([^\]]*)\]\(\/\/content\/images\//g, '![$1](/content/images/');
  
  // Fix HTML img tags if any
  fixed = fixed.replace(/<img\s+([^>]*?)src="content\/images\//g, '<img $1src="/content/images/');
  fixed = fixed.replace(/<img\s+([^>]*?)src="\/\/content\/images\//g, '<img $1src="/content/images/');
  
  return fixed;
}

// Process all markdown files
function processAllMarkdownFiles() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  console.log(`Found ${files.length} markdown files to process\n`);
  
  let processedCount = 0;
  let modifiedCount = 0;
  let imageCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Count images in this file
    const imageMatches = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];
    const htmlImageMatches = content.match(/<img\s+[^>]*src="[^"]+"/g) || [];
    
    if (imageMatches.length > 0 || htmlImageMatches.length > 0) {
      console.log(`📸 ${file}: ${imageMatches.length + htmlImageMatches.length} images found`);
      imageCount += imageMatches.length + htmlImageMatches.length;
    }
    
    // Fix image paths
    const fixedContent = fixImagePaths(content);
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      console.log(`✅ Fixed image paths in: ${file}`);
      modifiedCount++;
    }
    
    processedCount++;
  });
  
  console.log(`\n📊 Processing complete:`);
  console.log(`   - Total files: ${files.length}`);
  console.log(`   - Processed: ${processedCount}`);
  console.log(`   - Modified: ${modifiedCount}`);
  console.log(`   - Total images found: ${imageCount}`);
}

// Run the script
console.log('🔧 Starting image path fix...\n');
processAllMarkdownFiles();
console.log('\n✨ Done!');