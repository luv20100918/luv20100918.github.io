const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 이미지 디렉토리
const imageDir = './public/content/images';

// 재귀적으로 이미지 파일 찾기
function findImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findImages(filePath));
    } else {
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

console.log('🔍 이미지 파일 찾는 중...');
const images = findImages(imageDir);
console.log(`📦 총 ${images.length}개의 이미지를 찾았습니다.`);

let optimizedCount = 0;
let totalSaved = 0;

images.forEach((imagePath, index) => {
  const stats = fs.statSync(imagePath);
  const sizeMB = stats.size / 1024 / 1024;
  
  // 100KB 이상인 이미지만 최적화
  if (stats.size > 100 * 1024) {
    try {
      const beforeSize = stats.size;
      
      if (/\.(jpg|jpeg)$/i.test(imagePath)) {
        // JPEG 이미지: 품질 85%, 최대 너비 1600px
        execSync(`convert "${imagePath}" -quality 85 -resize "1600>" "${imagePath}"`, { stdio: 'ignore' });
      } else if (/\.png$/i.test(imagePath)) {
        // PNG 이미지: 압축 최적화, 최대 너비 1600px
        execSync(`convert "${imagePath}" -strip -resize "1600>" "${imagePath}"`, { stdio: 'ignore' });
      }
      
      const afterStats = fs.statSync(imagePath);
      const saved = beforeSize - afterStats.size;
      
      if (saved > 0) {
        totalSaved += saved;
        optimizedCount++;
        const savedMB = (saved / 1024 / 1024).toFixed(2);
        console.log(`✅ ${path.basename(imagePath)}: ${savedMB}MB 절약`);
      }
      
    } catch (error) {
      console.error(`❌ ${path.basename(imagePath)} 최적화 실패:`, error.message);
    }
  }
  
  if ((index + 1) % 100 === 0) {
    console.log(`진행중... ${index + 1}/${images.length}`);
  }
});

const totalSavedMB = (totalSaved / 1024 / 1024).toFixed(2);
console.log(`\n🎉 완료!`);
console.log(`📊 최적화된 이미지: ${optimizedCount}개`);
console.log(`💾 절약된 용량: ${totalSavedMB}MB`);

// 최종 크기 확인
const finalSize = execSync('du -sh public/content/images').toString().trim();
console.log(`📁 최종 이미지 폴더 크기: ${finalSize}`);