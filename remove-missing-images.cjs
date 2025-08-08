const fs = require('fs');
const path = require('path');

const blogDir = './src/content/blog';
const publicDir = './public';
const files = fs.readdirSync(blogDir);

let modifiedCount = 0;
let removedImages = [];

files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.mdx')) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // heroImage 확인 및 제거
    const heroMatch = content.match(/heroImage:\s*['"]([^'"]+)['"]/);
    if (heroMatch) {
      const imagePath = heroMatch[1].replace(/^\//, '');
      const fullPath = path.join(publicDir, imagePath);
      
      if (!fs.existsSync(fullPath)) {
        // heroImage 줄 전체 제거
        content = content.replace(/heroImage:\s*['"][^'"]+['"]\n/g, '');
        removedImages.push(`${file}: ${imagePath}`);
      }
    }
    
    // 본문의 이미지 확인 (일단 주석 처리)
    content = content.replace(/\!\[([^\]]*)\]\((content\/images\/[^)]+)\)/g, (match, alt, src) => {
      const imagePath = src.replace(/^\//, '');
      const fullPath = path.join(publicDir, imagePath);
      
      if (!fs.existsSync(fullPath)) {
        removedImages.push(`${file}: ${imagePath}`);
        return `<!-- 이미지 누락: ${match} -->`;
      }
      return match;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedCount++;
      console.log(`✅ 수정됨: ${file}`);
    }
  }
});

console.log(`\n📝 총 ${modifiedCount}개 파일에서 누락된 이미지를 제거했습니다.`);
console.log(`\n❌ 제거된 이미지 목록:`);
removedImages.forEach(img => console.log(`  - ${img}`));