#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class MarkdownFormatter {
  constructor() {
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      errors: 0,
      fixes: {
        headingSpacing: 0,
        listFormatting: 0,
        codeBlockLanguage: 0,
        tableFormatting: 0,
        paragraphSpacing: 0,
        boldFormatting: 0,
        escapeCharacters: 0,
        blankLines: 0
      }
    };
  }

  /**
   * 헤딩 포맷팅 수정
   * - 헤딩 마커(#) 뒤에 공백 추가
   * - 헤딩 앞뒤 적절한 빈 줄 추가
   */
  fixHeadingFormatting(content) {
    let fixes = 0;
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 헤딩 라인 감지
      const headingMatch = line.match(/^(#{1,6})([^\s#])/);
      if (headingMatch) {
        // 헤딩 마커 뒤에 공백 추가
        const level = headingMatch[1];
        const text = line.substring(level.length);
        const fixedLine = `${level} ${text.trim()}`;
        
        // 헤딩 앞에 빈 줄 추가 (첫 줄이거나 frontmatter 다음이 아닌 경우)
        if (i > 0 && result.length > 0 && result[result.length - 1].trim() !== '' && 
            !result[result.length - 1].startsWith('---')) {
          result.push('');
        }
        
        result.push(fixedLine);
        fixes++;
        
        // 헤딩 뒤에 빈 줄 추가 (다음 줄이 있고 비어있지 않은 경우)
        if (i < lines.length - 1 && lines[i + 1].trim() !== '' && 
            !lines[i + 1].startsWith('#')) {
          result.push('');
        }
      } else {
        result.push(line);
      }
    }

    this.stats.fixes.headingSpacing += fixes;
    return result.join('\n');
  }

  /**
   * 리스트 포맷팅 수정
   * - 리스트 마커(*, -, +, 숫자.) 뒤에 공백 추가
   * - 중첩 리스트 들여쓰기 수정
   */
  fixListFormatting(content) {
    let fixes = 0;
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 순서 없는 리스트 수정
      const unorderedMatch = line.match(/^(\s*)([-*+])([^\s])/);
      if (unorderedMatch) {
        const indent = unorderedMatch[1];
        const marker = unorderedMatch[2];
        const text = line.substring(indent.length + 1);
        lines[i] = `${indent}${marker} ${text.trim()}`;
        fixes++;
      }
      
      // 순서 있는 리스트 수정
      const orderedMatch = line.match(/^(\s*)(\d+\.)([^\s])/);
      if (orderedMatch) {
        const indent = orderedMatch[1];
        const marker = orderedMatch[2];
        const text = line.substring(indent.length + marker.length);
        lines[i] = `${indent}${marker} ${text.trim()}`;
        fixes++;
      }
    }

    this.stats.fixes.listFormatting += fixes;
    return lines.join('\n');
  }

  /**
   * 코드블록 언어 지정
   * - 언어가 지정되지 않은 코드블록에 자동으로 언어 추가
   */
  fixCodeBlockLanguages(content) {
    let fixes = 0;
    
    // 백틱 코드블록 처리
    content = content.replace(/^```\s*\n([\s\S]*?)^```$/gm, (match, code) => {
      const detectedLanguage = this.detectCodeLanguage(code);
      if (detectedLanguage) {
        fixes++;
        return `\`\`\`${detectedLanguage}\n${code}\`\`\``;
      }
      return match;
    });

    this.stats.fixes.codeBlockLanguage += fixes;
    return content;
  }

  /**
   * 코드 언어 감지
   */
  detectCodeLanguage(code) {
    const trimmedCode = code.trim().toLowerCase();
    
    // JavaScript/TypeScript 패턴
    if (trimmedCode.includes('function') || 
        trimmedCode.includes('const ') || 
        trimmedCode.includes('let ') ||
        trimmedCode.includes('var ') ||
        trimmedCode.includes('=>') ||
        trimmedCode.includes('console.log') ||
        trimmedCode.includes('require(') ||
        trimmedCode.includes('import ') ||
        trimmedCode.includes('export ')) {
      return 'javascript';
    }
    
    // Python 패턴
    if (trimmedCode.includes('def ') || 
        trimmedCode.includes('import ') || 
        trimmedCode.includes('print(') ||
        trimmedCode.includes('if __name__') ||
        trimmedCode.match(/^\s*#/m)) {
      return 'python';
    }
    
    // Java 패턴
    if (trimmedCode.includes('public class') || 
        trimmedCode.includes('public static void main') ||
        trimmedCode.includes('System.out.println')) {
      return 'java';
    }
    
    // CSS 패턴
    if (trimmedCode.includes('{') && 
        trimmedCode.includes('}') && 
        (trimmedCode.includes(':') || trimmedCode.includes('color') || trimmedCode.includes('font'))) {
      return 'css';
    }
    
    // HTML 패턴
    if (trimmedCode.includes('<') && trimmedCode.includes('>') && 
        (trimmedCode.includes('<!DOCTYPE') || trimmedCode.includes('<html') || trimmedCode.includes('<div'))) {
      return 'html';
    }
    
    // SQL 패턴
    if (trimmedCode.match(/\b(select|insert|update|delete|create|alter|drop)\b/i)) {
      return 'sql';
    }
    
    // Shell/Bash 패턴
    if (trimmedCode.startsWith('$') || 
        trimmedCode.includes('#!/bin/bash') || 
        trimmedCode.includes('cd ') ||
        trimmedCode.includes('ls ') ||
        trimmedCode.includes('mkdir ')) {
      return 'bash';
    }
    
    // JSON 패턴
    if ((trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
        (trimmedCode.startsWith('[') && trimmedCode.endsWith(']'))) {
      try {
        JSON.parse(trimmedCode);
        return 'json';
      } catch (e) {
        // JSON이 아님
      }
    }
    
    return null;
  }

  /**
   * 테이블 포맷팅 수정
   */
  fixTableFormatting(content) {
    let fixes = 0;
    const lines = content.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 테이블 행 감지
      if (line.includes('|') && line.trim().startsWith('|')) {
        // 테이블 구분자 정리
        const cells = line.split('|').map(cell => cell.trim());
        const fixedLine = '| ' + cells.slice(1, -1).join(' | ') + ' |';
        result.push(fixedLine);
        fixes++;
      } else {
        result.push(line);
      }
    }

    this.stats.fixes.tableFormatting += fixes;
    return result.join('\n');
  }

  /**
   * 텍스트 포맷팅 수정
   * - 과도한 볼드 텍스트 정리
   * - 문단 사이 적절한 빈 줄 추가
   */
  fixTextFormatting(content) {
    let fixes = 0;
    
    // 과도한 볼드 제거 (연속된 볼드 텍스트)
    const boldPattern = /\*\*([^*]+)\*\*\s*\*\*([^*]+)\*\*/g;
    content = content.replace(boldPattern, (match, text1, text2) => {
      fixes++;
      return `**${text1} ${text2}**`;
    });

    this.stats.fixes.boldFormatting += fixes;
    return content;
  }

  /**
   * 특수문자 이스케이프 처리
   */
  fixEscapeCharacters(content) {
    let fixes = 0;
    
    // 특정 특수문자들을 이스케이프 (백틱 코드블록 외부에서만)
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = [];
    let tempContent = content;
    
    // 코드블록 임시 저장
    tempContent = tempContent.replace(codeBlockRegex, (match, index) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(match);
      return placeholder;
    });
    
    // 인라인 코드 임시 저장
    const inlineCodeRegex = /`[^`]+`/g;
    const inlineCodes = [];
    tempContent = tempContent.replace(inlineCodeRegex, (match) => {
      const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(match);
      return placeholder;
    });
    
    // 특수문자 이스케이프 (매우 제한적으로)
    // tempContent = tempContent.replace(/([<>])/g, '\\$1');
    
    // 코드블록과 인라인 코드 복원
    inlineCodes.forEach((code, index) => {
      tempContent = tempContent.replace(`__INLINE_CODE_${index}__`, code);
    });
    
    codeBlocks.forEach((block, index) => {
      tempContent = tempContent.replace(`__CODE_BLOCK_${index}__`, block);
    });

    this.stats.fixes.escapeCharacters += fixes;
    return tempContent;
  }

  /**
   * 문단 간격 정리
   */
  fixParagraphSpacing(content) {
    let fixes = 0;
    
    // 3개 이상의 연속된 빈 줄을 2개로 줄임
    content = content.replace(/\n{4,}/g, () => {
      fixes++;
      return '\n\n\n';
    });
    
    // 문서 끝의 과도한 빈 줄 제거
    content = content.replace(/\n{3,}$/, () => {
      fixes++;
      return '\n';
    });

    this.stats.fixes.paragraphSpacing += fixes;
    return content;
  }

  /**
   * 전체 빈 줄 정리
   */
  fixBlankLines(content) {
    let fixes = 0;
    const lines = content.split('\n');
    const result = [];
    let inFrontmatter = false;
    let frontmatterCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Frontmatter 구분
      if (line.trim() === '---') {
        frontmatterCount++;
        if (frontmatterCount <= 2) {
          inFrontmatter = frontmatterCount === 1;
        }
      }

      // Frontmatter 내부는 그대로 유지
      if (inFrontmatter || frontmatterCount < 2) {
        result.push(line);
        continue;
      }

      // 빈 줄이 아닌 경우 그대로 추가
      if (line.trim() !== '') {
        result.push(line);
        continue;
      }

      // 빈 줄 처리
      const lastLine = result[result.length - 1];
      if (lastLine && lastLine.trim() !== '') {
        result.push(line);
      } else if (lastLine && lastLine.trim() === '') {
        // 연속된 빈 줄은 추가하지 않음
        fixes++;
      } else {
        result.push(line);
      }
    }

    this.stats.fixes.blankLines += fixes;
    return result.join('\n');
  }

  /**
   * 단일 파일 처리
   */
  async processFile(filePath) {
    try {
      console.log(`Processing: ${path.basename(filePath)}`);
      
      const content = await fs.readFile(filePath, 'utf-8');
      let processedContent = content;

      // 각 수정 단계 실행
      processedContent = this.fixHeadingFormatting(processedContent);
      processedContent = this.fixListFormatting(processedContent);
      processedContent = this.fixCodeBlockLanguages(processedContent);
      processedContent = this.fixTableFormatting(processedContent);
      processedContent = this.fixTextFormatting(processedContent);
      processedContent = this.fixEscapeCharacters(processedContent);
      processedContent = this.fixParagraphSpacing(processedContent);
      processedContent = this.fixBlankLines(processedContent);

      // 변경사항이 있는 경우만 파일 저장
      if (processedContent !== content) {
        await fs.writeFile(filePath, processedContent, 'utf-8');
        console.log(`  ✓ Fixed and saved: ${path.basename(filePath)}`);
      } else {
        console.log(`  • No changes needed: ${path.basename(filePath)}`);
      }

      this.stats.processedFiles++;
    } catch (error) {
      console.error(`  ✗ Error processing ${filePath}: ${error.message}`);
      this.stats.errors++;
    }
  }

  /**
   * 디렉토리 내 모든 마크다운 파일 찾기
   */
  async findMarkdownFiles(dir) {
    const files = [];
    
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          // 하위 디렉토리 재귀 탐색
          const subFiles = await this.findMarkdownFiles(fullPath);
          files.push(...subFiles);
        } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}: ${error.message}`);
    }
    
    return files;
  }

  /**
   * 통계 출력
   */
  printStats() {
    console.log('\n' + '='.repeat(60));
    console.log('MARKDOWN FORMATTING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files found: ${this.stats.totalFiles}`);
    console.log(`Successfully processed: ${this.stats.processedFiles}`);
    console.log(`Errors: ${this.stats.errors}`);
    console.log('\nFixes applied:');
    console.log(`  • Heading spacing fixes: ${this.stats.fixes.headingSpacing}`);
    console.log(`  • List formatting fixes: ${this.stats.fixes.listFormatting}`);
    console.log(`  • Code block language additions: ${this.stats.fixes.codeBlockLanguage}`);
    console.log(`  • Table formatting fixes: ${this.stats.fixes.tableFormatting}`);
    console.log(`  • Paragraph spacing fixes: ${this.stats.fixes.paragraphSpacing}`);
    console.log(`  • Bold formatting fixes: ${this.stats.fixes.boldFormatting}`);
    console.log(`  • Escape character fixes: ${this.stats.fixes.escapeCharacters}`);
    console.log(`  • Blank line cleanups: ${this.stats.fixes.blankLines}`);
    
    const totalFixes = Object.values(this.stats.fixes).reduce((sum, count) => sum + count, 0);
    console.log(`\nTotal fixes applied: ${totalFixes}`);
    console.log('='.repeat(60));
  }

  /**
   * 메인 실행 함수
   */
  async run(blogDir) {
    console.log('🔧 Starting comprehensive markdown formatting...');
    console.log(`Target directory: ${blogDir}`);
    
    const startTime = Date.now();
    
    try {
      // 마크다운 파일 찾기
      const markdownFiles = await this.findMarkdownFiles(blogDir);
      this.stats.totalFiles = markdownFiles.length;
      
      if (markdownFiles.length === 0) {
        console.log('No markdown files found in the specified directory.');
        return;
      }
      
      console.log(`Found ${markdownFiles.length} markdown files\n`);
      
      // 각 파일 처리
      for (const file of markdownFiles) {
        await this.processFile(file);
      }
      
      // 처리 완료
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      this.printStats();
      console.log(`\n⏱️  Processing completed in ${duration} seconds`);
      
    } catch (error) {
      console.error('Error during processing:', error);
    }
  }
}

// 실행
async function main() {
  const blogDirectory = path.resolve(__dirname, '../src/content/blog');
  const formatter = new MarkdownFormatter();
  await formatter.run(blogDirectory);
}

if (require.main === module) {
  main();
}

module.exports = MarkdownFormatter;