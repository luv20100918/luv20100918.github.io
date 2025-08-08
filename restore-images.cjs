const fs = require('fs');
const path = require('path');

// Ghost 마이그레이션 시 제거했던 이미지들을 다시 복구
const blogDir = './src/content/blog';
const files = fs.readdirSync(blogDir);

let restoredCount = 0;

files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.mdx')) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // 주석 처리된 이미지 복구
    content = content.replace(/<!-- 이미지 누락: (!\[[^\]]*\]\([^)]+\)) -->/g, '$1');
    
    // 이미지 경로 앞에 / 추가 (아직 안 되어 있다면)
    content = content.replace(/!\[([^\]]*)\]\(content\/images\//g, '![$1](/content/images/');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      restoredCount++;
      console.log(`✅ 복구됨: ${file}`);
    }
  }
});

// heroImage 복구를 위한 원본 데이터 (remove-missing-images.cjs 실행 전 백업 필요)
// 수동으로 frontmatter에 heroImage 추가 필요

console.log(`\n📝 총 ${restoredCount}개 파일의 이미지를 복구했습니다.`);
console.log('\n⚠️  heroImage는 수동으로 추가해야 합니다.');