#!/usr/bin/env node

/**
 * Blog Content Restoration Script
 * Fixes damaged markdown files by restoring content from Ghost backup JSON
 * 
 * This script:
 * 1. Parses Ghost JSON backup to extract original post content
 * 2. Matches posts by slug to existing markdown files
 * 3. Converts Ghost's mobiledoc format to proper markdown
 * 4. Fixes image paths to point to /content/images/ directory
 * 5. Restores proper list formatting, headings, and content structure
 * 6. Creates backups before making changes
 * 7. Generates detailed report of all fixes made
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Configuration
const CONFIG = {
    ghostBackupPath: '/Users/kaflix/Downloads/birdspring.ghost.2025-08-08-00-03-58.json',
    blogDir: '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/src/content/blog',
    imagesDir: '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/content/images',
    backupDir: '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/backup-' + new Date().toISOString().split('T')[0],
    reportFile: '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/content-restoration-report.txt'
};

// Global statistics
const stats = {
    totalFiles: 0,
    damagedFiles: 0,
    fixedFiles: 0,
    errors: 0,
    listItemsFixed: 0,
    imagesFixed: 0,
    contentRestored: 0
};

const report = [];

/**
 * Utility functions
 */
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    report.push(logMessage);
}

function error(message) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(errorMessage);
    report.push(errorMessage);
    stats.errors++;
}

/**
 * Create backup directory and copy files
 */
function createBackup() {
    log(`Creating backup directory: ${CONFIG.backupDir}`);
    
    if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
    
    const files = fs.readdirSync(CONFIG.blogDir);
    files.forEach(file => {
        if (file.endsWith('.md')) {
            const srcPath = path.join(CONFIG.blogDir, file);
            const destPath = path.join(CONFIG.backupDir, file);
            fs.copyFileSync(srcPath, destPath);
        }
    });
    
    log(`Backup completed. ${files.filter(f => f.endsWith('.md')).length} files backed up.`);
}

/**
 * Load and parse Ghost backup JSON
 */
function loadGhostBackup() {
    log('Loading Ghost backup JSON...');
    
    try {
        const jsonContent = fs.readFileSync(CONFIG.ghostBackupPath, 'utf8');
        const ghostData = JSON.parse(jsonContent);
        
        if (!ghostData.db || !ghostData.db[0] || !ghostData.db[0].data || !ghostData.db[0].data.posts) {
            throw new Error('Invalid Ghost backup structure');
        }
        
        const posts = ghostData.db[0].data.posts;
        log(`Loaded ${posts.length} posts from Ghost backup`);
        
        return posts;
    } catch (err) {
        error(`Failed to load Ghost backup: ${err.message}`);
        throw err;
    }
}

/**
 * Convert Ghost mobiledoc to markdown
 */
function convertMobiledocToMarkdown(mobiledocStr, htmlStr) {
    try {
        const mobiledoc = JSON.parse(mobiledocStr);
        let markdown = '';
        
        // Use HTML as fallback for complex content
        if (htmlStr) {
            // Convert HTML to markdown
            markdown = htmlStr
                // Convert paragraphs
                .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
                // Convert headings
                .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n')
                .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n')
                .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n')
                .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1\n\n')
                .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1\n\n')
                .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1\n\n')
                // Convert images
                .replace(/<figure class="kg-card kg-image-card"><img src="__GHOST_URL__\/content\/images\/(.*?)" class="kg-image"[^>]*><\/figure>/g, '![](/content/images/$1)\n\n')
                .replace(/<img src="__GHOST_URL__\/content\/images\/(.*?)"[^>]*>/g, '![](/content/images/$1)\n\n')
                // Convert links
                .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
                // Convert bold and italic
                .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
                .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
                .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
                .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
                // Convert code
                .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
                // Convert horizontal rule
                .replace(/<hr[^>]*>/g, '---\n\n')
                // Remove remaining HTML tags
                .replace(/<[^>]+>/g, '')
                // Clean up whitespace
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .replace(/^\s+|\s+$/g, '');
        }
        
        // If markdown is still empty, try to extract from mobiledoc
        if (!markdown && mobiledoc && mobiledoc.sections) {
            mobiledoc.sections.forEach(section => {
                const [sectionType, tagName, markers] = section;
                
                if (sectionType === 1 && markers && markers.length > 0) {
                    const textContent = markers.map(marker => {
                        if (Array.isArray(marker) && marker.length > 3) {
                            return marker[3] || '';
                        }
                        return '';
                    }).join('');
                    
                    // Add appropriate formatting based on tag
                    switch (tagName) {
                        case 'h1':
                            markdown += `# ${textContent}\n\n`;
                            break;
                        case 'h2':
                            markdown += `## ${textContent}\n\n`;
                            break;
                        case 'h3':
                            markdown += `### ${textContent}\n\n`;
                            break;
                        case 'h4':
                            markdown += `#### ${textContent}\n\n`;
                            break;
                        case 'h5':
                            markdown += `##### ${textContent}\n\n`;
                            break;
                        case 'h6':
                            markdown += `###### ${textContent}\n\n`;
                            break;
                        default:
                            markdown += `${textContent}\n\n`;
                    }
                }
                
                // Handle image cards
                if (sectionType === 10 && mobiledoc.cards) {
                    const cardIndex = section[1];
                    if (mobiledoc.cards[cardIndex]) {
                        const [cardType, cardData] = mobiledoc.cards[cardIndex];
                        if (cardType === 'image' && cardData.src) {
                            const imagePath = cardData.src.replace('__GHOST_URL__/content/images/', '/content/images/');
                            markdown += `![](${imagePath})\n\n`;
                        }
                    }
                }
            });
        }
        
        return markdown.trim();
        
    } catch (err) {
        error(`Error converting mobiledoc: ${err.message}`);
        return '';
    }
}

/**
 * Extract slug from filename
 */
function extractSlugFromFilename(filename) {
    // Remove date prefix and .md extension
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

/**
 * Check if file contains damaged content
 */
function isDamagedContent(content) {
    const issues = [];
    
    // Check for $1 instead of proper list content
    if (content.includes('$1')) {
        issues.push('Contains "$1" placeholders instead of list content');
    }
    
    // Check for very short content (likely truncated)
    const contentLines = content.split('\n').filter(line => line.trim() && !line.startsWith('---'));
    if (contentLines.length < 3) {
        issues.push('Content appears truncated (very few lines)');
    }
    
    // Check for missing images (no image references but should have some based on title/content)
    const hasImageReferences = /!\[.*?\]\(.*?\)/.test(content);
    const likelyHasImages = /사진|이미지|캠핑|여행|언박싱/.test(content);
    if (likelyHasImages && !hasImageReferences) {
        issues.push('Likely missing image references');
    }
    
    return issues;
}

/**
 * Fix list formatting in content
 */
function fixListFormatting(content) {
    let fixed = content;
    let fixCount = 0;
    
    // Replace $1, $2, etc. with proper list numbering
    const dollarMatches = fixed.match(/\$\d+/g);
    if (dollarMatches) {
        dollarMatches.forEach((match, index) => {
            const listNumber = index + 1;
            fixed = fixed.replace(match, `${listNumber}.`);
            fixCount++;
        });
    }
    
    stats.listItemsFixed += fixCount;
    return fixed;
}

/**
 * Parse frontmatter and content from markdown file
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: '', content: content };
    }
    
    return {
        frontmatter: match[1],
        content: match[2]
    };
}

/**
 * Process a single markdown file
 */
function processFile(filename, ghostPosts) {
    const filepath = path.join(CONFIG.blogDir, filename);
    log(`Processing: ${filename}`);
    
    try {
        const originalContent = fs.readFileSync(filepath, 'utf8');
        const { frontmatter, content } = parseFrontmatter(originalContent);
        
        const slug = extractSlugFromFilename(filename);
        const ghostPost = ghostPosts.find(post => post.slug === slug);
        
        // Check if content is damaged
        const damageIssues = isDamagedContent(content);
        if (damageIssues.length > 0) {
            stats.damagedFiles++;
            log(`  Damage detected: ${damageIssues.join(', ')}`);
        }
        
        let newContent = content;
        let wasFixed = false;
        
        // Fix list formatting issues
        const fixedListContent = fixListFormatting(newContent);
        if (fixedListContent !== newContent) {
            newContent = fixedListContent;
            wasFixed = true;
            log(`  Fixed list formatting`);
        }
        
        // If we have a matching Ghost post, restore content
        if (ghostPost && (damageIssues.length > 0 || newContent.trim().length < 100)) {
            log(`  Found matching Ghost post, restoring content...`);
            
            const restoredMarkdown = convertMobiledocToMarkdown(ghostPost.mobiledoc, ghostPost.html);
            
            if (restoredMarkdown && restoredMarkdown.length > newContent.length) {
                newContent = restoredMarkdown;
                wasFixed = true;
                stats.contentRestored++;
                log(`  Content restored from Ghost backup`);
            }
        }
        
        // Fix image paths
        const fixedImageContent = newContent.replace(/__GHOST_URL__\/content\/images\//g, '/content/images/');
        if (fixedImageContent !== newContent) {
            newContent = fixedImageContent;
            wasFixed = true;
            stats.imagesFixed++;
            log(`  Fixed image paths`);
        }
        
        // Write back if changes were made
        if (wasFixed) {
            const finalContent = `---\n${frontmatter}\n---\n\n${newContent}`;
            fs.writeFileSync(filepath, finalContent, 'utf8');
            stats.fixedFiles++;
            log(`  File successfully fixed`);
        } else {
            log(`  No fixes needed`);
        }
        
    } catch (err) {
        error(`Failed to process ${filename}: ${err.message}`);
    }
}

/**
 * Generate and save report
 */
function generateReport() {
    const reportContent = [
        '='.repeat(80),
        'BLOG CONTENT RESTORATION REPORT',
        `Generated: ${new Date().toISOString()}`,
        '='.repeat(80),
        '',
        'SUMMARY:',
        `Total files processed: ${stats.totalFiles}`,
        `Damaged files detected: ${stats.damagedFiles}`,
        `Files successfully fixed: ${stats.fixedFiles}`,
        `Content restored from backup: ${stats.contentRestored}`,
        `List items fixed: ${stats.listItemsFixed}`,
        `Image paths fixed: ${stats.imagesFixed}`,
        `Errors encountered: ${stats.errors}`,
        '',
        'DETAILED LOG:',
        ''.padEnd(40, '-'),
        ...report,
        '',
        'CONFIGURATION USED:',
        `Ghost backup: ${CONFIG.ghostBackupPath}`,
        `Blog directory: ${CONFIG.blogDir}`,
        `Images directory: ${CONFIG.imagesDir}`,
        `Backup directory: ${CONFIG.backupDir}`,
        '',
        '='.repeat(80)
    ].join('\n');
    
    fs.writeFileSync(CONFIG.reportFile, reportContent, 'utf8');
    log(`Report saved to: ${CONFIG.reportFile}`);
}

/**
 * Main execution function
 */
async function main() {
    try {
        log('Starting blog content restoration process...');
        
        // Check if directories exist
        if (!fs.existsSync(CONFIG.blogDir)) {
            throw new Error(`Blog directory not found: ${CONFIG.blogDir}`);
        }
        
        if (!fs.existsSync(CONFIG.ghostBackupPath)) {
            throw new Error(`Ghost backup not found: ${CONFIG.ghostBackupPath}`);
        }
        
        // Create backup
        createBackup();
        
        // Load Ghost posts
        const ghostPosts = loadGhostBackup();
        
        // Get all markdown files
        const files = fs.readdirSync(CONFIG.blogDir)
            .filter(file => file.endsWith('.md'))
            .sort();
        
        stats.totalFiles = files.length;
        log(`Found ${files.length} markdown files to process`);
        
        // Process each file
        for (const file of files) {
            processFile(file, ghostPosts);
        }
        
        // Generate report
        generateReport();
        
        log('Blog content restoration completed successfully!');
        console.log('\n=== FINAL SUMMARY ===');
        console.log(`Total files: ${stats.totalFiles}`);
        console.log(`Damaged files: ${stats.damagedFiles}`);
        console.log(`Fixed files: ${stats.fixedFiles}`);
        console.log(`Content restored: ${stats.contentRestored}`);
        console.log(`List items fixed: ${stats.listItemsFixed}`);
        console.log(`Image paths fixed: ${stats.imagesFixed}`);
        console.log(`Errors: ${stats.errors}`);
        console.log(`\nBackup location: ${CONFIG.backupDir}`);
        console.log(`Report location: ${CONFIG.reportFile}`);
        
    } catch (err) {
        error(`Script failed: ${err.message}`);
        process.exit(1);
    }
}

// Execute the script
if (require.main === module) {
    main().catch(err => {
        console.error('Unhandled error:', err);
        process.exit(1);
    });
}

module.exports = {
    main,
    convertMobiledocToMarkdown,
    isDamagedContent,
    fixListFormatting
};