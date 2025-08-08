#!/usr/bin/env node

/**
 * Tier 1 Post Quality Validation Script
 * Testing Engineer: 충렬 (Chungryeol)
 * Purpose: Automated detection of common quality issues in Tier 1 posts
 */

const fs = require('fs');
const path = require('path');

// Tier 1 critical posts (from priority-action-matrix.md)
const TIER1_POSTS = [
  '2024-07-05-install-vscode.md',
  '2023-01-14-노티드-도넛-스트로베리-맛-후기.md',
  '2024-04-22-오랫만에.md',
  '2024-08-04-자전거-타기.md',
  '2024-02-24-hanmunsiheom-5geub-hanseongdaehaggyoro-gada.md',
  '2023-12-04-kakaotogdeogdamibenteu.md',
  '2023-12-15-계란말이빵이라는-것을-처음-먹어-봤다.md',
  '2022-06-14-toipeurojegteu-roddowineo.md',
  '2022-07-10-편의점-사장님에게서-포켓몬-빵을-입수하였습니다.md',
  '2022-06-14-borakai2019.md',
  '2024-07-31-뱃살은-왜-안빠지는걸까.md',
  '2023-04-15-아들-눈탱이에-프로펠러를-맞다.md',
  '2022-06-14-eorininalseonmul-nintendo-seuwici-eonbagsing.md',
  '2024-08-07-하향평준화-되는-중인-초등학교.md',
  '2024-05-13-헬스-1일차.md',
  '2025-03-11-gaegeom-geomcal-i-hanggo-pogihae.md',
  '2025-01-28-자전거길의-교차점에서.md'
];

const BLOG_DIR = path.join(__dirname, '../src/content/blog');

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const bodyContent = match[2];
  const frontmatter = {};
  
  // Parse YAML-like frontmatter
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, content: bodyContent };
}

function validatePost(filename) {
  const filepath = path.join(BLOG_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    return {
      filename,
      score: 0,
      issues: ['CRITICAL: File not found'],
      status: 'MISSING'
    };
  }
  
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const { frontmatter, content } = parseFrontmatter(fileContent);
  
  const issues = [];
  let score = 100;
  
  // Frontmatter validation (25 points)
  if (!frontmatter.title) {
    issues.push('CRITICAL: Missing title');
    score -= 10;
  } else if (frontmatter.title.length < 10 || frontmatter.title.length > 60) {
    issues.push(`HIGH: Title length suboptimal (${frontmatter.title.length} chars)`);
    score -= 5;
  }
  
  if (!frontmatter.description) {
    issues.push('CRITICAL: Missing description');
    score -= 15;
  } else {
    const descLength = frontmatter.description.length;
    if (descLength < 50) {
      issues.push(`CRITICAL: Description too short (${descLength} chars, need 50-160)`);
      score -= 15;
    } else if (descLength > 160) {
      issues.push(`HIGH: Description too long (${descLength} chars, max 160)`);
      score -= 10;
    }
    
    // Check for Ghost migration artifacts
    if (frontmatter.description.includes('content/images/')) {
      issues.push('CRITICAL: Description contains broken content/images reference');
      score -= 10;
    }
    if (frontmatter.description.includes('---')) {
      issues.push('CRITICAL: Description contains corrupted frontmatter');
      score -= 10;
    }
  }
  
  if (!frontmatter.pubDate) {
    issues.push('CRITICAL: Missing pubDate');
    score -= 5;
  }
  
  // Content structure validation (25 points)
  const words = content.trim().split(/\s+/).length;
  if (words < 50) {
    issues.push(`CRITICAL: Extremely short content (${words} words, need 200+)`);
    score -= 20;
  } else if (words < 200) {
    issues.push(`HIGH: Content too short (${words} words, need 200+)`);
    score -= 10;
  }
  
  // Check for H2 headings
  const h2Regex = /^##\s+(.+)$/gm;
  const h2Matches = content.match(h2Regex);
  if (!h2Matches || h2Matches.length === 0) {
    issues.push('HIGH: No H2 headings found - poor structure');
    score -= 10;
  }
  
  // Check paragraph length (very long paragraphs)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split('.').length > 6);
  if (longParagraphs.length > 0) {
    issues.push(`MEDIUM: ${longParagraphs.length} very long paragraphs found - reduce for readability`);
    score -= 5;
  }
  
  // Technical quality validation (25 points)
  const brokenImageRegex = /!\[[^\]]*\]\(\/content\/images\/[^)]+\)/g;
  const brokenImages = content.match(brokenImageRegex);
  if (brokenImages) {
    issues.push(`CRITICAL: ${brokenImages.length} broken /content/images/ references`);
    score -= 20;
  }
  
  // Check for images without alt text
  const imagesWithoutAltRegex = /!\[\s*\]\([^)]+\)/g;
  const imagesWithoutAlt = content.match(imagesWithoutAltRegex);
  if (imagesWithoutAlt) {
    issues.push(`MEDIUM: ${imagesWithoutAlt.length} images missing alt text`);
    score -= 5;
  }
  
  // Check for code blocks without language
  const codeBlockRegex = /```\s*\n/g;
  const unspecifiedCodeBlocks = content.match(codeBlockRegex);
  if (unspecifiedCodeBlocks) {
    issues.push(`LOW: ${unspecifiedCodeBlocks.length} code blocks without language specification`);
    score -= 2;
  }
  
  // SEO & UX validation (25 points)
  if (!content.includes('##') && !content.includes('#')) {
    issues.push('HIGH: No headings for content organization');
    score -= 10;
  }
  
  // Determine overall status
  let status = 'EXCELLENT';
  if (score < 60) status = 'CRITICAL';
  else if (score < 70) status = 'NEEDS_IMPROVEMENT';
  else if (score < 80) status = 'GOOD';
  
  return {
    filename,
    score: Math.max(0, score),
    issues,
    status,
    wordCount: words,
    frontmatter
  };
}

function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('TIER 1 POST QUALITY VALIDATION REPORT');
  console.log('Testing Engineer: 충렬 (Chungryeol)');
  console.log(`Generated: ${new Date().toISOString().split('T')[0]}`);
  console.log('='.repeat(80) + '\n');
  
  const totalPosts = results.length;
  const criticalPosts = results.filter(r => r.status === 'CRITICAL').length;
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalPosts;
  
  console.log(`SUMMARY:`);
  console.log(`- Total Posts Tested: ${totalPosts}`);
  console.log(`- Critical Issues (Score < 60): ${criticalPosts}`);
  console.log(`- Average Quality Score: ${averageScore.toFixed(1)}/100`);
  console.log(`- Posts Meeting Standards (60+): ${totalPosts - criticalPosts}\n`);
  
  // Sort by score (worst first)
  results.sort((a, b) => a.score - b.score);
  
  console.log('DETAILED RESULTS:\n');
  
  results.forEach((result, index) => {
    const statusIcon = {
      'CRITICAL': '🔴',
      'NEEDS_IMPROVEMENT': '🟡', 
      'GOOD': '🟢',
      'EXCELLENT': '✅',
      'MISSING': '❌'
    }[result.status];
    
    console.log(`${index + 1}. ${statusIcon} ${result.filename}`);
    console.log(`   Score: ${result.score}/100 | Status: ${result.status} | Words: ${result.wordCount || 'N/A'}`);
    
    if (result.issues.length > 0) {
      console.log('   Issues:');
      result.issues.forEach(issue => {
        const priority = issue.startsWith('CRITICAL') ? '🔴' : 
                        issue.startsWith('HIGH') ? '🟠' : 
                        issue.startsWith('MEDIUM') ? '🟡' : '🔵';
        console.log(`     ${priority} ${issue}`);
      });
    }
    console.log('');
  });
  
  console.log('RECOMMENDATIONS:');
  console.log('1. 🔴 URGENT: Fix all CRITICAL issues first (posts scoring < 60)');
  console.log('2. 🟠 HIGH: Address structural and content issues');
  console.log('3. 🟡 MEDIUM: Improve readability and technical quality');
  console.log('4. 🔵 LOW: Polish and optimize for better user experience\n');
  
  const criticalFiles = results.filter(r => r.status === 'CRITICAL').map(r => r.filename);
  if (criticalFiles.length > 0) {
    console.log('IMMEDIATE ACTION REQUIRED:');
    criticalFiles.forEach(filename => {
      console.log(`- ${filename}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
}

// Main execution
console.log('Starting Tier 1 post quality validation...\n');

const results = TIER1_POSTS.map(filename => {
  console.log(`Analyzing: ${filename}`);
  return validatePost(filename);
});

generateReport(results);

// Export results for other scripts if needed
if (require.main === module) {
  // Save results to JSON file for further analysis
  const outputFile = path.join(__dirname, '../tier1-validation-results.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${outputFile}`);
}