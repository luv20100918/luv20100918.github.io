#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// 마크다운 파일 포맷 수정 함수
function fixMarkdownFormatting(content) {
  let lines = content.split('\n');
  let fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // 헤딩과 리스트가 한 줄에 붙어있는 경우 분리
    // 예: "## 제목1. **항목**" -> "## 제목\n\n1. **항목**"
    const headingListPattern = /^(#{1,6}\s+[^0-9]+?)(\d+\.\s+)/;
    const match = line.match(headingListPattern);
    if (match) {
      fixedLines.push(match[1].trim());
      fixedLines.push('');
      fixedLines.push(match[2] + line.substring(match[0].length));
      continue;
    }
    
    // 테이블 헤더 패턴 감지 및 포맷팅
    // "**출처/인물 AGI 예상 시점 근거" 같은 패턴을 테이블로 변환
    if (line.includes('**') && (
      line.includes('출처') || 
      line.includes('시점') || 
      line.includes('근거') ||
      line.includes('분류') ||
      line.includes('항목')
    )) {
      // 연속된 **로 구분된 항목들을 테이블 헤더로 변환
      const tablePattern = /\*\*([^*]+)\*\*\s*/g;
      const headers = [];
      let match;
      while ((match = tablePattern.exec(line)) !== null) {
        headers.push(match[1].trim());
      }
      
      if (headers.length >= 2) {
        // 테이블 헤더 생성
        fixedLines.push('');
        fixedLines.push('| ' + headers.join(' | ') + ' |');
        fixedLines.push('|' + headers.map(() => ' --- ').join('|') + '|');
        
        // 다음 줄들이 테이블 내용인지 확인
        let j = i + 1;
        while (j < lines.length && lines[j].trim() && !lines[j].startsWith('#')) {
          let dataLine = lines[j].trim();
          if (dataLine.includes('**')) {
            const cells = dataLine.split('**').filter((_, idx) => idx % 2 === 1);
            if (cells.length === headers.length) {
              fixedLines.push('| ' + cells.join(' | ') + ' |');
              i = j; // 처리된 줄 건너뛰기
            }
          }
          j++;
          if (j - i > 10) break; // 최대 10줄까지만 테이블로 처리
        }
        fixedLines.push('');
        continue;
      }
    }
    
    // 과도한 볼드 텍스트 정리
    // 문장 전체가 볼드인 경우 제거
    if (line.startsWith('**') && line.endsWith('**') && !line.includes('|')) {
      line = line.substring(2, line.length - 2);
    }
    
    // 리스트 항목 포맷 개선
    // "1. **항목**: 설명" 패턴 유지 (이미 잘 되어있음)
    if (/^\d+\.\s+\*\*/.test(line)) {
      // 리스트 번호와 볼드 사이 공백 확인
      line = line.replace(/^(\d+\.)\s*(\*\*)/, '$1 $2');
    }
    
    // 불릿 리스트도 동일하게 처리
    if (/^[\*\-]\s+\*\*/.test(line)) {
      line = line.replace(/^([\*\-])\s*(\*\*)/, '$1 $2');
    }
    
    // 헤딩 뒤 여백 확인
    if (i > 0 && /^#{1,6}\s+/.test(line) && fixedLines[fixedLines.length - 1].trim() !== '') {
      fixedLines.push('');
    }
    
    fixedLines.push(line);
    
    // 헤딩 다음 줄 여백 확인
    if (/^#{1,6}\s+/.test(line) && i < lines.length - 1 && lines[i + 1].trim() !== '') {
      fixedLines.push('');
    }
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
    const fixedBody = fixMarkdownFormatting(body);
    
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
console.log('🔧 Starting markdown formatting fix...\n');
processAllMarkdownFiles();
console.log('\n✨ Done!');