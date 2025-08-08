#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// HTML to Markdown conversion functions
function htmlToMarkdown(html) {
  if (!html) return '';
  
  let markdown = html;
  
  // Convert HTML headings to markdown
  markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, text) => {
    const hashes = '#'.repeat(parseInt(level));
    return `${hashes} ${text.replace(/<[^>]*>/g, '')}`;
  });
  
  // Convert HTML paragraphs to markdown
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n');
  
  // Convert Ghost image cards to markdown images
  markdown = markdown.replace(/<figure class="kg-card kg-image-card"[^>]*>.*?<img src="([^"]*)"[^>]*alt="([^"]*)"[^>]*(?:title="([^"]*)"[^>]*)?[^>]*>.*?<\/figure>/gi, (match, src, alt, title) => {
    // Handle Ghost's __GHOST_URL__ placeholder
    const imageSrc = src.replace('__GHOST_URL__/', '');
    const altText = alt || '';
    const titleText = title || '';
    
    if (titleText) {
      return `![${altText}](${imageSrc} "${titleText}")`;
    } else {
      return `![${altText}](${imageSrc})`;
    }
  });
  
  // Convert regular img tags to markdown
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*(?:title="([^"]*)"[^>]*)?[^>]*>/gi, (match, src, alt, title) => {
    const imageSrc = src.replace('__GHOST_URL__/', '');
    const altText = alt || '';
    const titleText = title || '';
    
    if (titleText) {
      return `![${altText}](${imageSrc} "${titleText}")`;
    } else {
      return `![${altText}](${imageSrc})`;
    }
  });
  
  // Convert strong/bold tags
  markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
  
  // Convert em/italic tags
  markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
  
  // Convert code tags
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  // Convert pre/code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```');
  
  // Convert links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Convert blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
    return content.split('\n').map(line => `> ${line}`).join('\n');
  });
  
  // Convert lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n');
  });
  
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
    let counter = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gis, () => `${counter++}. $1\n`);
  });
  
  // Convert horizontal rules
  markdown = markdown.replace(/<hr[^>]*>/gi, '---');
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.replace(/^\s+|\s+$/g, '');
  
  // Decode HTML entities
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#x27;/g, "'");
  markdown = markdown.replace(/&#x2F;/g, '/');
  
  return markdown;
}

function createSlugFilename(post) {
  // Create date-based filename from published date
  const publishedDate = new Date(post.published_at || post.created_at);
  const year = publishedDate.getFullYear();
  const month = String(publishedDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishedDate.getDate()).padStart(2, '0');
  
  // Clean up slug for filename
  let slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-');
  slug = slug.replace(/--+/g, '-').replace(/^-|-$/g, '');
  
  return `${year}-${month}-${day}-${slug}.md`;
}

function generateAstroFrontmatter(post) {
  const publishedDate = new Date(post.published_at || post.created_at);
  const updatedDate = post.updated_at ? new Date(post.updated_at) : null;
  
  // Escape YAML string properly
  function escapeYaml(str) {
    if (!str) return '';
    // Replace any quotes and newlines that could break YAML
    return str.replace(/'/g, "'").replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '').trim();
  }
  
  let frontmatter = '---\n';
  frontmatter += `title: "${escapeYaml(post.title)}"\n`;
  
  // Use custom_excerpt if available, otherwise create from plaintext
  let description = post.custom_excerpt || '';
  if (!description && post.plaintext) {
    description = post.plaintext.substring(0, 160).replace(/\n/g, ' ').trim();
    if (post.plaintext.length > 160) {
      description += '...';
    }
  }
  
  // Limit description length and clean it up
  description = escapeYaml(description);
  if (description.length > 200) {
    description = description.substring(0, 200) + '...';
  }
  
  frontmatter += `description: "${description}"\n`;
  
  // Format date for Astro
  frontmatter += `pubDate: '${publishedDate.toISOString().split('T')[0]}'\n`;
  
  if (updatedDate && updatedDate.getTime() !== publishedDate.getTime()) {
    frontmatter += `updatedDate: '${updatedDate.toISOString().split('T')[0]}'\n`;
  }
  
  // Add hero image if available
  if (post.feature_image) {
    const imagePath = post.feature_image.replace('__GHOST_URL__/', '');
    frontmatter += `heroImage: '${imagePath}'\n`;
  }
  
  frontmatter += '---\n\n';
  
  return frontmatter;
}

function migrateGhostToAstro(ghostExportPath, targetDirectory) {
  console.log('Starting Ghost to Astro migration...');
  console.log(`Reading Ghost export from: ${ghostExportPath}`);
  console.log(`Target directory: ${targetDirectory}`);
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  }
  
  try {
    // Read and parse Ghost export
    const ghostData = JSON.parse(fs.readFileSync(ghostExportPath, 'utf8'));
    const posts = ghostData.db[0].data.posts;
    
    console.log(`Found ${posts.length} total items in Ghost export`);
    
    // Filter for published posts only (exclude pages and drafts)
    const publishedPosts = posts.filter(post => 
      post.type === 'post' && post.status === 'published'
    );
    
    console.log(`Migrating ${publishedPosts.length} published posts...`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    publishedPosts.forEach((post, index) => {
      try {
        console.log(`Processing ${index + 1}/${publishedPosts.length}: "${post.title}"`);
        
        // Generate filename
        const filename = createSlugFilename(post);
        const filePath = path.join(targetDirectory, filename);
        
        // Generate Astro frontmatter
        const frontmatter = generateAstroFrontmatter(post);
        
        // Convert HTML content to Markdown
        let content = '';
        if (post.html) {
          content = htmlToMarkdown(post.html);
        } else if (post.plaintext) {
          content = post.plaintext;
        }
        
        // Combine frontmatter and content
        const markdownFile = frontmatter + content;
        
        // Write file
        fs.writeFileSync(filePath, markdownFile, 'utf8');
        successCount++;
        
        console.log(`  ✓ Created: ${filename}`);
        
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to process "${post.title}": ${error.message}`;
        errors.push(errorMsg);
        console.error(`  ✗ ${errorMsg}`);
      }
    });
    
    console.log('\nMigration completed!');
    console.log(`Successfully migrated: ${successCount} posts`);
    console.log(`Errors: ${errorCount} posts`);
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log(`\nAll migrated files are in: ${targetDirectory}`);
    
    return {
      success: true,
      totalPosts: publishedPosts.length,
      successCount,
      errorCount,
      errors
    };
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main execution
if (require.main === module) {
  const ghostExportPath = '/Users/kaflix/Downloads/birdspring.ghost.2025-08-08-00-03-58.json';
  const targetDirectory = '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/src/content/blog';
  
  const result = migrateGhostToAstro(ghostExportPath, targetDirectory);
  
  if (result.success) {
    console.log('\n🎉 Migration completed successfully!');
    console.log(`Check your blog posts in: ${targetDirectory}`);
  } else {
    console.error('\n❌ Migration failed:', result.error);
    process.exit(1);
  }
}

module.exports = { migrateGhostToAstro, htmlToMarkdown, createSlugFilename, generateAstroFrontmatter };