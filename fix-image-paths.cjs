const fs = require('fs');
const path = require('path');

const blogDir = './src/content/blog';
const files = fs.readdirSync(blogDir);

let modifiedCount = 0;

files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.mdx')) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // heroImage 경로 수정: 앞에 / 추가
    content = content.replace(/heroImage:\s*['"]content\/images\//g, "heroImage: '/content/images/");
    content = content.replace(/heroImage:\s*"content\/images\//g, 'heroImage: "/content/images/');
    content = content.replace(/heroImage:\s*'content\/images\//g, "heroImage: '/content/images/");
    
    // 본문의 이미지 경로 수정
    content = content.replace(/\!\[([^\]]*)\]\(content\/images\//g, '![$1](/content/images/');
    
    // HTML img 태그의 경로 수정
    content = content.replace(/src="content\/images\//g, 'src="/content/images/');
    content = content.replace(/src='content\/images\//g, "src='/content/images/");
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedCount++;
      console.log(`✅ 수정됨: ${file}`);
    }
  }
});

console.log(`\n📝 총 ${modifiedCount}개 파일의 이미지 경로를 수정했습니다.`);