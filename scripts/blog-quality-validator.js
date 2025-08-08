#!/usr/bin/env node

/**
 * Blog Quality Validator
 * Automated script to validate and analyze all blog posts
 * Author: 하은 (Project Manager)
 * Date: 2025-08-08
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const REPORT_DIR = path.join(__dirname, '..', 'quality-reports');

// Quality scoring weights
const QUALITY_WEIGHTS = {
    frontmatter: 40,
    markdown: 30,
    content: 20,
    structure: 10
};

class BlogQualityValidator {
    constructor() {
        this.results = [];
        this.summaryStats = {
            total: 0,
            passed: 0,
            warnings: 0,
            errors: 0,
            averageScore: 0
        };
    }

    async validateAllPosts() {
        console.log('🚀 Starting blog quality validation...');
        
        // Ensure report directory exists
        if (!fs.existsSync(REPORT_DIR)) {
            fs.mkdirSync(REPORT_DIR, { recursive: true });
        }

        const files = fs.readdirSync(BLOG_DIR)
            .filter(file => file.endsWith('.md') && !file.endsWith('.bak'))
            .sort();

        console.log(`📄 Found ${files.length} blog posts to validate`);

        for (const file of files) {
            const result = await this.validatePost(file);
            this.results.push(result);
        }

        this.generateSummaryStats();
        this.generateReports();

        console.log('✅ Validation complete!');
        this.printSummary();
    }

    async validatePost(filename) {
        const filepath = path.join(BLOG_DIR, filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        
        const result = {
            filename,
            filepath,
            scores: {},
            issues: [],
            warnings: [],
            metadata: {},
            overallScore: 0,
            tier: 'FAIL'
        };

        // Parse frontmatter and content
        const { frontmatter, body } = this.parseFrontmatter(content);
        result.metadata = frontmatter;

        // Run validation checks
        result.scores.frontmatter = this.validateFrontmatter(frontmatter, result);
        result.scores.markdown = this.validateMarkdown(body, result);
        result.scores.content = this.validateContent(body, result);
        result.scores.structure = this.validateStructure(body, result);

        // Calculate overall score
        result.overallScore = this.calculateOverallScore(result.scores);
        result.tier = this.determineTier(result);

        return result;
    }

    parseFrontmatter(content) {
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
        
        if (!frontmatterMatch) {
            return { frontmatter: {}, body: content };
        }

        const frontmatterText = frontmatterMatch[1];
        const body = frontmatterMatch[2];
        const frontmatter = {};

        // Simple YAML parsing for basic fields
        frontmatterText.split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
            if (match) {
                frontmatter[match[1]] = match[2];
            }
        });

        return { frontmatter, body };
    }

    validateFrontmatter(frontmatter, result) {
        let score = 100;
        const required = ['title', 'description', 'pubDate'];
        
        // Check required fields
        required.forEach(field => {
            if (!frontmatter[field]) {
                result.issues.push(`Missing required frontmatter field: ${field}`);
                score -= 30;
            }
        });

        // Validate title
        if (frontmatter.title) {
            const titleLength = frontmatter.title.length;
            if (titleLength < 10) {
                result.warnings.push('Title too short (< 10 characters)');
                score -= 5;
            } else if (titleLength > 100) {
                result.warnings.push('Title too long (> 100 characters)');
                score -= 5;
            }
        }

        // Validate description
        if (frontmatter.description) {
            const descLength = frontmatter.description.length;
            if (descLength < 50) {
                result.warnings.push('Description too short (< 50 characters)');
                score -= 5;
            } else if (descLength > 300) {
                result.warnings.push('Description too long (> 300 characters)');
                score -= 5;
            }
        }

        // Validate date
        if (frontmatter.pubDate) {
            const date = new Date(frontmatter.pubDate);
            if (isNaN(date.getTime())) {
                result.issues.push('Invalid pubDate format');
                score -= 15;
            }
        }

        return Math.max(0, score);
    }

    validateMarkdown(body, result) {
        let score = 100;
        
        // Check heading hierarchy
        const headings = body.match(/^#{1,6}\s+.+$/gm) || [];
        if (headings.length === 0) {
            result.warnings.push('No headings found in content');
            score -= 10;
        }

        // Check for broken links
        const links = body.match(/\[([^\]]*)\]\(([^)]*)\)/g) || [];
        links.forEach(link => {
            const urlMatch = link.match(/\[([^\]]*)\]\(([^)]*)\)/);
            if (urlMatch && urlMatch[2].startsWith('http')) {
                // Note: We're not checking external links in this basic validation
                // This would require network requests
            }
        });

        // Check for proper code blocks
        const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
        const inlineCode = body.match(/`[^`]+`/g) || [];
        
        if (codeBlocks.length === 0 && inlineCode.length === 0 && 
            (body.includes('function') || body.includes('const') || body.includes('<'))) {
            result.warnings.push('Code detected but no code blocks used');
            score -= 5;
        }

        // Check for consistent list formatting
        const lists = body.match(/^[\s]*[-*+]\s+.+$/gm) || [];
        if (lists.length > 0) {
            const markers = lists.map(list => list.match(/^[\s]*[-*+]/)[0]);
            const uniqueMarkers = [...new Set(markers)];
            if (uniqueMarkers.length > 1) {
                result.warnings.push('Inconsistent list marker usage');
                score -= 3;
            }
        }

        return Math.max(0, score);
    }

    validateContent(body, result) {
        let score = 100;
        
        // Check content length
        const wordCount = body.split(/\s+/).length;
        if (wordCount < 100) {
            result.warnings.push('Content too short (< 100 words)');
            score -= 20;
        }

        // Check for proper paragraphs
        const paragraphs = body.split('\n\n').filter(p => p.trim().length > 0);
        if (paragraphs.length < 3) {
            result.warnings.push('Content lacks proper paragraph structure');
            score -= 10;
        }

        // Check for introduction
        const firstParagraph = paragraphs[0];
        if (firstParagraph && firstParagraph.length < 50) {
            result.warnings.push('Introduction paragraph too short');
            score -= 5;
        }

        return Math.max(0, score);
    }

    validateStructure(body, result) {
        let score = 100;
        
        // Check heading structure
        const headings = body.match(/^(#{1,6})\s+(.+)$/gm) || [];
        let prevLevel = 0;
        
        headings.forEach(heading => {
            const level = heading.match(/^#{1,6}/)[0].length;
            if (level > prevLevel + 1 && prevLevel > 0) {
                result.warnings.push('Heading hierarchy skip detected');
                score -= 5;
            }
            prevLevel = level;
        });

        return Math.max(0, score);
    }

    calculateOverallScore(scores) {
        return Math.round(
            (scores.frontmatter * QUALITY_WEIGHTS.frontmatter / 100) +
            (scores.markdown * QUALITY_WEIGHTS.markdown / 100) +
            (scores.content * QUALITY_WEIGHTS.content / 100) +
            (scores.structure * QUALITY_WEIGHTS.structure / 100)
        );
    }

    determineTier(result) {
        if (result.issues.length > 0) return 'FAIL';
        if (result.overallScore >= 90) return 'TIER1';
        if (result.overallScore >= 75) return 'TIER2';
        if (result.overallScore >= 60) return 'TIER3';
        return 'NEEDS_IMPROVEMENT';
    }

    generateSummaryStats() {
        this.summaryStats.total = this.results.length;
        this.summaryStats.passed = this.results.filter(r => r.tier !== 'FAIL').length;
        this.summaryStats.warnings = this.results.reduce((sum, r) => sum + r.warnings.length, 0);
        this.summaryStats.errors = this.results.reduce((sum, r) => sum + r.issues.length, 0);
        this.summaryStats.averageScore = Math.round(
            this.results.reduce((sum, r) => sum + r.overallScore, 0) / this.results.length
        );
    }

    generateReports() {
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Detailed JSON report
        const detailedReport = {
            generatedAt: new Date().toISOString(),
            summary: this.summaryStats,
            results: this.results
        };
        
        fs.writeFileSync(
            path.join(REPORT_DIR, `detailed-report-${timestamp}.json`),
            JSON.stringify(detailedReport, null, 2)
        );

        // Summary markdown report
        const summaryMd = this.generateSummaryMarkdown();
        fs.writeFileSync(
            path.join(REPORT_DIR, `summary-report-${timestamp}.md`),
            summaryMd
        );

        // Priority action matrix
        const priorityMatrix = this.generatePriorityMatrix();
        fs.writeFileSync(
            path.join(REPORT_DIR, `priority-matrix-${timestamp}.json`),
            JSON.stringify(priorityMatrix, null, 2)
        );
    }

    generateSummaryMarkdown() {
        const tierCounts = {
            TIER1: 0,
            TIER2: 0,
            TIER3: 0,
            NEEDS_IMPROVEMENT: 0,
            FAIL: 0
        };

        this.results.forEach(r => tierCounts[r.tier]++);

        return `# Blog Quality Validation Report

## Summary Statistics
- **Total Posts**: ${this.summaryStats.total}
- **Passed Posts**: ${this.summaryStats.passed}
- **Total Warnings**: ${this.summaryStats.warnings}
- **Total Errors**: ${this.summaryStats.errors}
- **Average Score**: ${this.summaryStats.averageScore}/100

## Quality Distribution
- **TIER1 (90-100)**: ${tierCounts.TIER1} posts
- **TIER2 (75-89)**: ${tierCounts.TIER2} posts
- **TIER3 (60-74)**: ${tierCounts.TIER3} posts
- **NEEDS_IMPROVEMENT (40-59)**: ${tierCounts.NEEDS_IMPROVEMENT} posts
- **FAIL (<40)**: ${tierCounts.FAIL} posts

## Top Issues
${this.getTopIssues()}

## Recommendations
1. **Priority 1**: Fix all FAIL tier posts (${tierCounts.FAIL} posts)
2. **Priority 2**: Improve NEEDS_IMPROVEMENT posts (${tierCounts.NEEDS_IMPROVEMENT} posts)
3. **Priority 3**: Enhance TIER3 posts to TIER2 standard (${tierCounts.TIER3} posts)

Generated on: ${new Date().toISOString()}`;
    }

    generatePriorityMatrix() {
        return {
            priority1: this.results.filter(r => r.tier === 'FAIL').map(r => ({
                filename: r.filename,
                issues: r.issues,
                score: r.overallScore
            })),
            priority2: this.results.filter(r => r.tier === 'NEEDS_IMPROVEMENT').map(r => ({
                filename: r.filename,
                warnings: r.warnings,
                score: r.overallScore
            })),
            priority3: this.results.filter(r => r.tier === 'TIER3').map(r => ({
                filename: r.filename,
                score: r.overallScore
            }))
        };
    }

    getTopIssues() {
        const issueCount = {};
        this.results.forEach(r => {
            [...r.issues, ...r.warnings].forEach(issue => {
                issueCount[issue] = (issueCount[issue] || 0) + 1;
            });
        });

        return Object.entries(issueCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([issue, count]) => `- ${issue}: ${count} posts`)
            .join('\n');
    }

    printSummary() {
        console.log('\n📊 VALIDATION SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Posts: ${this.summaryStats.total}`);
        console.log(`Passed: ${this.summaryStats.passed}`);
        console.log(`Average Score: ${this.summaryStats.averageScore}/100`);
        console.log(`Total Issues: ${this.summaryStats.errors}`);
        console.log(`Total Warnings: ${this.summaryStats.warnings}`);
        console.log('\n📋 Reports generated in quality-reports/ directory');
    }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new BlogQualityValidator();
    validator.validateAllPosts().catch(console.error);
}

export default BlogQualityValidator;