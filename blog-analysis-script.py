#!/usr/bin/env python3
"""
Blog Analysis Script for birdspring.com
Analyzes all blog posts to categorize, assess quality, and create improvement plans.
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Any
import yaml

class BlogAnalyzer:
    def __init__(self, blog_dir: str):
        self.blog_dir = Path(blog_dir)
        self.posts = []
        self.analysis_results = {}
        
    def extract_frontmatter_and_content(self, file_path: Path) -> Tuple[Dict, str]:
        """Extract frontmatter and content from markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Split frontmatter and content
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter_str = parts[1].strip()
                    content_body = parts[2].strip()
                    
                    # Parse YAML frontmatter
                    try:
                        frontmatter = yaml.safe_load(frontmatter_str)
                    except yaml.YAMLError:
                        frontmatter = {}
                    
                    return frontmatter, content_body
            
            return {}, content
            
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return {}, ""
    
    def analyze_content_type(self, title: str, content: str) -> str:
        """Categorize content based on title and content analysis"""
        title_lower = title.lower()
        content_lower = content.lower()
        
        # Technical tutorials
        if any(keyword in title_lower for keyword in ['설치', 'tutorial', '가이드', 'guide', '방법', '사용법', 'how to', '하는 법', '하려면']):
            return "technical_tutorial"
        
        # Programming/Development
        if any(keyword in title_lower for keyword in ['javascript', 'python', 'django', 'vue', 'react', 'nodejs', 'git', 'docker', 'jenkins', 'api', '코딩', '프로그래밍', '개발']):
            return "programming"
        
        # Travel/Personal
        if any(keyword in title_lower for keyword in ['여행', 'travel', '캠핑', 'camping', '제주', '휴가', '맛집']):
            return "travel_personal"
        
        # Reviews
        if any(keyword in title_lower for keyword in ['리뷰', 'review', '후기', '사용기']):
            return "review"
        
        # Personal thoughts/opinions
        if any(keyword in title_lower for keyword in ['생각', '의견', '회고', '느낌', '이야기']):
            return "personal_thoughts"
        
        # News/Current events
        if any(keyword in title_lower for keyword in ['뉴스', 'news', '대통령', '정치', '사회', '경제']):
            return "news_opinion"
        
        # Work/Career
        if any(keyword in title_lower for keyword in ['회사', '직장', '근무', '업무', '경력', '이직']):
            return "work_career"
        
        return "general"
    
    def assess_content_quality(self, frontmatter: Dict, content: str, file_name: str) -> Dict:
        """Assess content quality based on various factors"""
        issues = []
        quality_score = 100
        
        # Check required frontmatter fields
        if not frontmatter.get('title'):
            issues.append("Missing title")
            quality_score -= 20
        
        if not frontmatter.get('description'):
            issues.append("Missing description")
            quality_score -= 15
        elif len(frontmatter.get('description', '')) < 50:
            issues.append("Description too short (< 50 chars)")
            quality_score -= 10
        
        if not frontmatter.get('pubDate'):
            issues.append("Missing pubDate")
            quality_score -= 10
        
        # Content quality checks
        word_count = len(content.split())
        if word_count < 100:
            issues.append(f"Very short content ({word_count} words)")
            quality_score -= 20
        elif word_count < 300:
            issues.append(f"Short content ({word_count} words)")
            quality_score -= 10
        
        # Structural issues
        if not re.search(r'^#+ ', content, re.MULTILINE):
            issues.append("No proper headings found")
            quality_score -= 15
        
        # Formatting issues
        if '```' not in content and ('코드' in content or 'code' in content.lower()):
            issues.append("Code mentioned but no code blocks")
            quality_score -= 10
        
        # Image handling
        img_matches = re.findall(r'!\[.*?\]\((.*?)\)', content)
        broken_images = []
        for img_path in img_matches:
            if img_path.startswith('/content/images/') or img_path.startswith('http'):
                broken_images.append(img_path)
        
        if broken_images:
            issues.append(f"Potential broken images: {len(broken_images)}")
            quality_score -= 5 * min(len(broken_images), 5)
        
        # Determine quality level
        if quality_score >= 80:
            quality_level = "good"
        elif quality_score >= 60:
            quality_level = "needs_minor_fixes"
        else:
            quality_level = "needs_major_work"
        
        return {
            'quality_score': max(quality_score, 0),
            'quality_level': quality_level,
            'issues': issues,
            'word_count': word_count,
            'image_count': len(img_matches),
            'has_code_blocks': '```' in content
        }
    
    def analyze_all_posts(self):
        """Analyze all blog posts"""
        print("Starting blog analysis...")
        
        md_files = list(self.blog_dir.glob("*.md")) + list(self.blog_dir.glob("*.mdx"))
        total_files = len(md_files)
        
        for i, file_path in enumerate(md_files, 1):
            print(f"Analyzing {i}/{total_files}: {file_path.name}")
            
            frontmatter, content = self.extract_frontmatter_and_content(file_path)
            
            # Extract year from filename
            year_match = re.match(r'(\d{4})-', file_path.name)
            year = int(year_match.group(1)) if year_match else None
            
            # Analyze content
            content_type = self.analyze_content_type(frontmatter.get('title', ''), content)
            quality_analysis = self.assess_content_quality(frontmatter, content, file_path.name)
            
            post_data = {
                'filename': file_path.name,
                'title': frontmatter.get('title', 'No title'),
                'description': frontmatter.get('description', ''),
                'pubDate': str(frontmatter.get('pubDate', '')),
                'updatedDate': str(frontmatter.get('updatedDate', '')),
                'year': year,
                'content_type': content_type,
                'quality_analysis': quality_analysis,
                'file_path': str(file_path)
            }
            
            self.posts.append(post_data)
        
        print(f"Analysis complete! Processed {len(self.posts)} posts.")
    
    def generate_analysis_report(self) -> Dict:
        """Generate comprehensive analysis report"""
        report = {
            'total_posts': len(self.posts),
            'analysis_date': datetime.now().isoformat(),
            'distribution_by_year': {},
            'distribution_by_type': {},
            'distribution_by_quality': {},
            'priority_matrix': [],
            'posts': self.posts
        }
        
        # Year distribution
        for post in self.posts:
            year = post['year']
            if year:
                report['distribution_by_year'][year] = report['distribution_by_year'].get(year, 0) + 1
        
        # Content type distribution
        for post in self.posts:
            content_type = post['content_type']
            report['distribution_by_type'][content_type] = report['distribution_by_type'].get(content_type, 0) + 1
        
        # Quality distribution
        for post in self.posts:
            quality_level = post['quality_analysis']['quality_level']
            report['distribution_by_quality'][quality_level] = report['distribution_by_quality'].get(quality_level, 0) + 1
        
        # Priority matrix (posts that need attention)
        needs_work = [post for post in self.posts if post['quality_analysis']['quality_level'] in ['needs_major_work', 'needs_minor_fixes']]
        needs_work.sort(key=lambda x: (x['quality_analysis']['quality_score'], -x['year'] if x['year'] else 0))
        
        report['priority_matrix'] = needs_work
        
        return report
    
    def save_analysis(self, output_file: str = 'blog-analysis-report.json'):
        """Save analysis results to JSON file"""
        report = self.generate_analysis_report()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"Analysis report saved to: {output_file}")
        return report

def main():
    blog_dir = "/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/src/content/blog"
    
    if not os.path.exists(blog_dir):
        print(f"Blog directory not found: {blog_dir}")
        return
    
    analyzer = BlogAnalyzer(blog_dir)
    analyzer.analyze_all_posts()
    report = analyzer.save_analysis()
    
    # Print summary
    print("\n" + "="*60)
    print("BLOG ANALYSIS SUMMARY")
    print("="*60)
    print(f"Total posts analyzed: {report['total_posts']}")
    print(f"\nDistribution by year:")
    for year, count in sorted(report['distribution_by_year'].items()):
        print(f"  {year}: {count} posts")
    
    print(f"\nDistribution by content type:")
    for content_type, count in sorted(report['distribution_by_type'].items(), key=lambda x: x[1], reverse=True):
        print(f"  {content_type}: {count} posts")
    
    print(f"\nDistribution by quality level:")
    for quality, count in report['distribution_by_quality'].items():
        print(f"  {quality}: {count} posts")
    
    print(f"\nPosts needing attention: {len(report['priority_matrix'])}")
    print("\nTop 10 posts needing immediate attention:")
    for i, post in enumerate(report['priority_matrix'][:10], 1):
        print(f"  {i}. {post['filename']} (Score: {post['quality_analysis']['quality_score']}, Issues: {len(post['quality_analysis']['issues'])})")

if __name__ == "__main__":
    main()