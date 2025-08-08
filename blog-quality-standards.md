# Blog Quality Standards for birdspring.com

## Overview

This document defines comprehensive quality standards for all blog content on birdspring.com, ensuring consistency, readability, and optimal user experience across our diverse content categories.

## Universal Standards (All Content Types)

### Frontmatter Requirements

#### Mandatory Fields
```yaml
---
title: "Clear, descriptive title (10-60 characters)"
description: "Compelling summary for SEO and social sharing (50-160 characters)"
pubDate: 2025-08-08  # ISO date format (YYYY-MM-DD)
updatedDate: 2025-08-08  # Optional, only when significantly updated
heroImage: ./images/hero-image.jpg  # Optional, for visual content
---
```

#### Frontmatter Quality Guidelines
- **Title**: Must be descriptive and searchable
  - ✅ Good: "Vue 3에서 Composition API 사용하기"
  - ❌ Bad: "Vue 3", "오늘의 포스트"
- **Description**: SEO-optimized summary
  - Length: 50-160 characters
  - Include primary keyword
  - Compelling preview text
  - ✅ Good: "Vue 3의 Composition API를 실제 프로젝트에 적용하는 방법과 주의사항을 실습 예제와 함께 설명합니다."
  - ❌ Bad: "Vue에 대한 글", "참고하세요"

### Content Structure Standards

#### Minimum Content Requirements
- **Word Count**: Minimum 200 words (300+ recommended for technical content)
- **Heading Structure**: At least one H2 heading
- **Paragraph Length**: Maximum 4 sentences per paragraph
- **Line Length**: Break long lines for readability

#### Recommended Structure Template
```markdown
# Main Title (H1 - handled by frontmatter)

Brief introduction paragraph explaining what the reader will learn.

## 주요 내용 (H2)

Content sections with clear headings.

### 세부 사항 (H3)

Detailed explanations or subsections.

## 정리

Summary or conclusion section.

## 참고 자료

Optional references or related links.
```

### Language and Style Guidelines

#### Writing Style
- **Tone**: Professional yet approachable
- **Voice**: Maintain personal author voice while being informative
- **Clarity**: Use clear, concise language
- **Consistency**: Consistent terminology throughout

#### Korean Language Standards
- Use standard Korean spelling and grammar
- Avoid excessive foreign language mixing
- Technical terms: Provide Korean explanation when appropriate
  - ✅ "REST API(Representational State Transfer API)"
  - ❌ Just "REST API" without context

#### Code and Technical Content
- Always specify language in code blocks
```javascript
// ✅ Good: Language specified
const example = "Hello World";
```

```
// ❌ Bad: No language specified
const example = "Hello World";
```

## Content-Type Specific Standards

### Technical Tutorials

#### Structure Requirements
```markdown
## 사전 준비사항
- Required software/tools
- Prerequisites knowledge
- Environment setup

## 단계별 가이드
### 1단계: 설치
Detailed steps with code blocks

### 2단계: 설정
Configuration instructions

### 3단계: 구현
Implementation details

## 문제 해결
Common issues and solutions

## 다음 단계
What to learn next
```

#### Quality Criteria
- **Completeness**: All necessary steps included
- **Testability**: Instructions that can be followed and verified
- **Context**: Explain why, not just how
- **Error Handling**: Include troubleshooting section
- **Examples**: Working code examples that can be copied

### Programming Content

#### Code Quality Standards
- **Syntax Highlighting**: Always specify language
- **Completeness**: Full working examples when possible
- **Comments**: Explain complex logic
- **Best Practices**: Follow language conventions
- **Security**: No hardcoded secrets or vulnerabilities

#### Content Structure
```markdown
## 문제 상황
What problem are we solving?

## 해결 방법
Step-by-step solution with code

## 코드 설명
Detailed explanation of the implementation

## 대안 방법
Alternative approaches if applicable

## 마무리
Summary and best practices
```

### Travel and Personal Content

#### Content Requirements
- **Narrative Flow**: Clear chronological or thematic structure
- **Practical Information**: Costs, locations, timing when relevant
- **Personal Insights**: What made the experience unique
- **Visual Elements**: Photos with descriptive alt text

#### Structure Template
```markdown
## 여행 개요
Brief overview and context

## 일정 및 경로
Timeline or itinerary

## 주요 경험
Key experiences and highlights

## 실용 정보
Practical tips for others

## 개인적 소감
Personal reflections and recommendations
```

### Review Content

#### Review Standards
- **Objectivity**: Balance pros and cons
- **Context**: Explain use case and comparison points
- **Specificity**: Concrete examples and details
- **Usefulness**: Help readers make informed decisions

#### Required Elements
```markdown
## 제품/서비스 개요
What is being reviewed

## 사용 환경
Context of usage

## 장점
Positive aspects with specific examples

## 단점
Areas for improvement

## 총평
Overall assessment and recommendation
```

## Technical Standards

### Image Guidelines

#### Image Quality
- **Format**: WebP preferred, JPG/PNG acceptable
- **Resolution**: Minimum 800px width for featured images
- **Optimization**: Compressed for web delivery
- **Alt Text**: Descriptive alternative text for accessibility
- **Captions**: Informative captions when needed

#### Implementation
```markdown
![Vue 3 Composition API 예제 코드 스크린샷](./images/vue3-composition-example.webp "Vue 3에서 reactive와 ref를 사용한 상태 관리 예제")
```

### Link Standards

#### Internal Links
- Use relative paths for internal content
- Link to relevant related posts
- Maintain link validity through site updates

#### External Links
- Open external links in new tabs when appropriate
- Verify link validity before publication
- Use descriptive link text
  - ✅ Good: "Vue 3 공식 문서의 Composition API 가이드"
  - ❌ Bad: "여기 링크", "이 사이트"

### SEO Standards

#### Meta Information
- **Title Tag**: Included via frontmatter title
- **Meta Description**: Frontmatter description
- **Keywords**: Naturally integrated in content
- **URL Structure**: Clean, descriptive slugs

#### Content SEO
- **Keyword Density**: Natural keyword integration (2-3% density)
- **Semantic Structure**: Proper heading hierarchy
- **Internal Linking**: Connect related content
- **Featured Snippets**: Structure content for search features

## Quality Assurance Process

### Pre-Publication Checklist

#### Content Review
- [ ] Frontmatter complete and accurate
- [ ] Minimum word count met
- [ ] Proper heading structure
- [ ] Code blocks with language specification
- [ ] Images optimized with alt text
- [ ] Links verified and functional
- [ ] Spelling and grammar checked
- [ ] SEO optimization complete

#### Technical Validation
- [ ] Markdown syntax valid
- [ ] Build process successful
- [ ] Mobile responsive design
- [ ] Page load speed acceptable
- [ ] Accessibility standards met

### Post-Publication Monitoring

#### Performance Metrics
- Page load speed
- User engagement (time on page, bounce rate)
- Search ranking performance
- Social sharing metrics
- Comment engagement

#### Quality Maintenance
- Quarterly content audits
- Annual comprehensive reviews
- Link validation checks
- Image optimization updates
- SEO performance analysis

## Automated Quality Checks

### Validation Scripts

#### Frontmatter Validation
```python
def validate_frontmatter(post):
    required_fields = ['title', 'description', 'pubDate']
    issues = []
    
    for field in required_fields:
        if not post.get(field):
            issues.append(f"Missing required field: {field}")
    
    if len(post.get('description', '')) < 50:
        issues.append("Description too short")
    
    return issues
```

#### Content Quality Checks
```python
def check_content_quality(content):
    issues = []
    
    word_count = len(content.split())
    if word_count < 200:
        issues.append(f"Content too short: {word_count} words")
    
    if not re.search(r'^##\s', content, re.MULTILINE):
        issues.append("No H2 headings found")
    
    return issues
```

## Exception Handling

### Legacy Content
- Grandfather clause for historical posts with different standards
- Gradual improvement during regular updates
- Priority given to high-traffic content

### Personal Content
- More flexibility in structure for personal narratives
- Maintain authenticity while improving technical aspects
- Focus on readability and accessibility improvements

## Continuous Improvement

### Review Process
- Monthly quality reports
- Quarterly standard updates
- Annual comprehensive review
- Team feedback integration

### Standards Evolution
- Monitor industry best practices
- Update based on user feedback
- Adapt to platform changes
- Incorporate new technologies

---

**Document Version**: 1.0  
**Last Updated**: August 8, 2025  
**Review Schedule**: Monthly  
**Next Update**: September 8, 2025