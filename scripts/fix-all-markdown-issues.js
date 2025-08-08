#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// 포괄적인 마크다운 포맷 수정 함수
function fixMarkdownFormatting(content) {
  let lines = content.split('\n');
  let fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // 헤딩 레벨 뒤에 붙은 텍스트 분리
    // "## 제목###" -> "## 제목"
    // "### 제목텍스트" -> "### 제목\n\n텍스트"
    const headingWithExtraPattern = /^(#{1,6}\s+[^#\n]+?)(#{1,6})\s*$/;
    if (headingWithExtraPattern.test(line)) {
      line = line.replace(headingWithExtraPattern, '$1').trim();
    }
    
    // 헤딩과 바로 붙은 텍스트 분리
    // "### 3. 제목텍스트추가내용" -> "### 3. 제목\n\n텍스트추가내용"
    const headingWithTextPattern = /^(#{1,6}\s+\d+\.\s+[^.!?]+?)([가-힣A-Za-z][^#\n]*)/;
    const match = line.match(headingWithTextPattern);
    if (match && match[2].length > 0) {
      fixedLines.push(match[1].trim());
      fixedLines.push('');
      fixedLines.push(match[2].trim());
      continue;
    }
    
    // 리스트 번호와 텍스트가 붙은 경우 분리
    // "1. 항목설명이여기에" -> "1. 항목\n\n설명이여기에"
    const listWithLongTextPattern = /^(\d+\.\s+)([^:：.!?]{20,})([가-힣A-Za-z].{20,})/;
    const listMatch = line.match(listWithLongTextPattern);
    if (listMatch) {
      const firstPart = listMatch[1] + listMatch[2];
      const secondPart = listMatch[3];
      // 첫 부분이 완전한 문장처럼 보이면 분리
      if (secondPart && /^[A-Z가-힣]/.test(secondPart)) {
        fixedLines.push(firstPart.trim());
        fixedLines.push(secondPart.trim());
        continue;
      }
    }
    
    // 코드 블록 언어 지정 확인
    if (line.trim() === '```' && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      // 코드 블록 시작인데 언어가 지정되지 않은 경우
      if (nextLine && !nextLine.startsWith('```') && 
          (nextLine.includes('function') || nextLine.includes('def') || 
           nextLine.includes('class') || nextLine.includes('const') ||
           nextLine.includes('var') || nextLine.includes('let'))) {
        // JavaScript/TypeScript 패턴
        if (nextLine.includes('function') || nextLine.includes('const') || 
            nextLine.includes('var') || nextLine.includes('let') || 
            nextLine.includes('async')) {
          line = '```javascript';
        }
        // Python 패턴
        else if (nextLine.includes('def ') || nextLine.includes('class ')) {
          line = '```python';
        }
        // Ruby 패턴
        else if (nextLine.includes('def ') || nextLine.includes('class ') || 
                 nextLine.includes('Rails')) {
          line = '```ruby';
        }
        // SQL 패턴
        else if (nextLine.toUpperCase().includes('SELECT') || 
                 nextLine.toUpperCase().includes('INSERT') ||
                 nextLine.toUpperCase().includes('UPDATE')) {
          line = '```sql';
        }
      }
    }
    
    // 헤딩 앞뒤 여백 확인
    if (/^#{1,6}\s+/.test(line)) {
      // 헤딩 앞에 빈 줄이 없으면 추가
      if (i > 0 && fixedLines[fixedLines.length - 1].trim() !== '') {
        fixedLines.push('');
      }
      fixedLines.push(line);
      // 헤딩 다음에 빈 줄 추가 (다음 줄이 빈 줄이 아닌 경우)
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        fixedLines.push('');
      }
      continue;
    }
    
    // 문단이 너무 길면 적절히 나누기 (코드 블록 제외)
    if (!line.startsWith('```') && !line.startsWith('    ') && 
        !line.startsWith('\t') && line.length > 500) {
      // 문장 단위로 나누기
      const sentences = line.match(/[^.!?]+[.!?]+/g) || [line];
      if (sentences.length > 1) {
        sentences.forEach(sentence => {
          fixedLines.push(sentence.trim());
        });
        continue;
      }
    }
    
    fixedLines.push(line);
  }
  
  // 연속된 빈 줄 제거 (최대 2개까지만 허용)
  let result = [];
  let emptyCount = 0;
  for (let line of fixedLines) {
    if (line.trim() === '') {
      emptyCount++;
      if (emptyCount <= 2) {
        result.push(line);
      }
    } else {
      emptyCount = 0;
      result.push(line);
    }
  }
  
  return result.join('\n');
}

// 특정 파일의 문제 수정
function fixSpecificIssues(filePath, content) {
  const fileName = path.basename(filePath);
  
  // Rails 8 포스트의 특정 문제 수정
  if (fileName.includes('rails-8') || fileName.includes('모놀리식')) {
    // 잘못된 헤딩 레벨 수정
    content = content.replace(/^# MSA:/gm, '## MSA:');
    content = content.replace(/^# 모놀리식:/gm, '## 모놀리식:');
    content = content.replace(/^# (Rails|별도의|Memcached|Redis|config|단)/gm, '### $1');
    
    // 코드 블록 언어 지정
    content = content.replace(/```\n(class |def |Rails)/gm, '```ruby\n$1');
    content = content.replace(/```\n(async function|const |var |let )/gm, '```javascript\n$1');
    content = content.replace(/```\n(BEGIN|SELECT|INSERT|UPDATE)/gm, '```sql\n$1');
  }
  
  return content;
}

// 모든 마크다운 파일 처리
function processAllMarkdownFiles() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  console.log(`Found ${files.length} markdown files to process\n`);
  
  let processedCount = 0;
  let modifiedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // frontmatter 분리
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      console.log(`⚠️  Skipping ${file} - no frontmatter found`);
      return;
    }
    
    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];
    
    // 본문 포맷 수정
    let fixedBody = fixMarkdownFormatting(body);
    
    // 파일별 특정 문제 수정
    fixedBody = fixSpecificIssues(filePath, fixedBody);
    
    if (fixedBody !== body) {
      const newContent = `---\n${frontmatter}\n---\n${fixedBody}`;
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Fixed: ${file}`);
      modifiedCount++;
    } else {
      console.log(`⏭️  No changes needed: ${file}`);
    }
    
    processedCount++;
  });
  
  console.log(`\n📊 Processing complete:`);
  console.log(`   - Total files: ${files.length}`);
  console.log(`   - Processed: ${processedCount}`);
  console.log(`   - Modified: ${modifiedCount}`);
}

// 실행
console.log('🔧 Starting comprehensive markdown formatting fix...\n');
processAllMarkdownFiles();
console.log('\n✨ Done!');