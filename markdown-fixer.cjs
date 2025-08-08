#!/usr/bin/env node

/**
 * 마크다운 자동 수정 프로그램
 * 주요 기능:
 * 1. H2, H3 제목과 내용 사이 줄바꿈 추가
 * 2. 코드 블록 다음 줄바꿈 추가
 * 3. 잘못된 구분자 패턴 수정
 * 4. 이미지 링크와 텍스트 분리
 */

const fs = require('fs').promises;
const path = require('path');

class MarkdownFixer {
    constructor(sourceDir, backupDir) {
        this.sourceDir = sourceDir;
        this.backupDir = backupDir;
        this.stats = {
            totalFiles: 0,
            processedFiles: 0,
            fixedFiles: 0,
            errors: 0,
            fixes: {
                headingSpacing: 0,
                codeBlockSpacing: 0,
                separatorFix: 0,
                imageSpacing: 0
            }
        };
    }

    /**
     * 백업 디렉토리 생성
     */
    async createBackupDir() {
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
            console.log(`✅ 백업 디렉토리 생성: ${this.backupDir}`);
        } catch (error) {
            console.error(`❌ 백업 디렉토리 생성 실패: ${error.message}`);
            throw error;
        }
    }

    /**
     * 파일 백업
     */
    async backupFile(filePath) {
        try {
            const fileName = path.basename(filePath);
            const backupPath = path.join(this.backupDir, fileName);
            const content = await fs.readFile(filePath, 'utf8');
            await fs.writeFile(backupPath, content, 'utf8');
            console.log(`📁 백업 완료: ${fileName}`);
        } catch (error) {
            console.error(`❌ 백업 실패 ${filePath}: ${error.message}`);
            throw error;
        }
    }

    /**
     * 마크다운 파일 스캔
     */
    async scanMarkdownFiles() {
        try {
            const files = await fs.readdir(this.sourceDir);
            const markdownFiles = files
                .filter(file => file.endsWith('.md'))
                .map(file => path.join(this.sourceDir, file));
            
            this.stats.totalFiles = markdownFiles.length;
            console.log(`📊 총 ${markdownFiles.length}개의 마크다운 파일을 발견했습니다.`);
            return markdownFiles;
        } catch (error) {
            console.error(`❌ 파일 스캔 실패: ${error.message}`);
            throw error;
        }
    }

    /**
     * 마크다운 내용 수정
     */
    fixMarkdownContent(content) {
        let fixedContent = content;
        let fileFixed = false;

        // 1. H2, H3 제목과 내용이 줄바꿈 없이 붙어있는 문제 (최우선)
        // 패턴: ## 제목내용 → ## 제목\n\n내용
        const headingPattern = /(^##+ [^#\n]+)([가-힣A-Za-z0-9])/gm;
        const headingMatches = fixedContent.match(headingPattern);
        if (headingMatches && headingMatches.length > 0) {
            fixedContent = fixedContent.replace(headingPattern, '$1\n\n$2');
            this.stats.fixes.headingSpacing += headingMatches.length;
            fileFixed = true;
            console.log(`  🔧 제목-내용 분리: ${headingMatches.length}개 수정`);
        }

        // 2. 코드 블록 다음 줄바꿈 누락 (높은 중요도)
        // 패턴: 코드블록 다음에 바로 텍스트
        const codeBlockPattern = /(```[^`]*```)\n?([#가-힣A-Za-z])/g;
        const codeBlockMatches = fixedContent.match(codeBlockPattern);
        if (codeBlockMatches && codeBlockMatches.length > 0) {
            fixedContent = fixedContent.replace(codeBlockPattern, '$1\n\n$2');
            this.stats.fixes.codeBlockSpacing += codeBlockMatches.length;
            fileFixed = true;
            console.log(`  🔧 코드블록 줄바꿈: ${codeBlockMatches.length}개 수정`);
        }

        // 3. 잘못된 구분자 패턴 (중간 중요도)
        // 패턴: - -- → ---
        const separatorPattern = /^- --$/gm;
        const separatorMatches = fixedContent.match(separatorPattern);
        if (separatorMatches && separatorMatches.length > 0) {
            fixedContent = fixedContent.replace(separatorPattern, '---');
            this.stats.fixes.separatorFix += separatorMatches.length;
            fileFixed = true;
            console.log(`  🔧 구분자 수정: ${separatorMatches.length}개 수정`);
        }

        // 4. 이미지 링크와 텍스트 분리 (낮은 중요도)
        // 패턴: ![alt](url)텍스트 → ![alt](url)\n\n텍스트
        const imagePattern = /(!\[[^\]]*\]\([^)]+\))([가-힣A-Za-z0-9])/g;
        const imageMatches = fixedContent.match(imagePattern);
        if (imageMatches && imageMatches.length > 0) {
            fixedContent = fixedContent.replace(imagePattern, '$1\n\n$2');
            this.stats.fixes.imageSpacing += imageMatches.length;
            fileFixed = true;
            console.log(`  🔧 이미지-텍스트 분리: ${imageMatches.length}개 수정`);
        }

        return { content: fixedContent, fixed: fileFixed };
    }

    /**
     * 단일 파일 처리
     */
    async processFile(filePath) {
        try {
            console.log(`\n🔍 처리 중: ${path.basename(filePath)}`);
            
            // 백업 생성
            await this.backupFile(filePath);
            
            // 파일 내용 읽기
            const originalContent = await fs.readFile(filePath, 'utf8');
            
            // 내용 수정
            const { content: fixedContent, fixed } = this.fixMarkdownContent(originalContent);
            
            // 수정된 내용이 있으면 파일 저장
            if (fixed) {
                await fs.writeFile(filePath, fixedContent, 'utf8');
                this.stats.fixedFiles++;
                console.log(`  ✅ 파일 수정 완료!`);
            } else {
                console.log(`  ⚪ 수정할 내용이 없습니다.`);
            }
            
            this.stats.processedFiles++;
        } catch (error) {
            console.error(`  ❌ 파일 처리 실패: ${error.message}`);
            this.stats.errors++;
        }
    }

    /**
     * 모든 파일 처리
     */
    async processAllFiles() {
        try {
            console.log('\n🚀 마크다운 수정 작업을 시작합니다...\n');
            
            // 백업 디렉토리 생성
            await this.createBackupDir();
            
            // 마크다운 파일 스캔
            const markdownFiles = await this.scanMarkdownFiles();
            
            if (markdownFiles.length === 0) {
                console.log('📝 처리할 마크다운 파일이 없습니다.');
                return;
            }
            
            // 각 파일 처리
            for (const filePath of markdownFiles) {
                await this.processFile(filePath);
            }
            
            // 결과 출력
            this.printResults();
            
        } catch (error) {
            console.error(`❌ 처리 중 오류 발생: ${error.message}`);
            throw error;
        }
    }

    /**
     * 처리 결과 출력
     */
    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 마크다운 수정 작업 완료!');
        console.log('='.repeat(60));
        console.log(`📁 총 파일 수: ${this.stats.totalFiles}`);
        console.log(`✅ 처리된 파일: ${this.stats.processedFiles}`);
        console.log(`🔧 수정된 파일: ${this.stats.fixedFiles}`);
        console.log(`❌ 오류 발생: ${this.stats.errors}`);
        console.log('\n📈 수정 통계:');
        console.log(`  • 제목-내용 분리: ${this.stats.fixes.headingSpacing}개`);
        console.log(`  • 코드블록 줄바꿈: ${this.stats.fixes.codeBlockSpacing}개`);
        console.log(`  • 구분자 수정: ${this.stats.fixes.separatorFix}개`);
        console.log(`  • 이미지-텍스트 분리: ${this.stats.fixes.imageSpacing}개`);
        
        const totalFixes = Object.values(this.stats.fixes).reduce((a, b) => a + b, 0);
        console.log(`\n🎉 총 ${totalFixes}개의 문제점을 수정했습니다!`);
        console.log(`📦 백업 위치: ${this.backupDir}`);
        console.log('='.repeat(60));
    }

    /**
     * 롤백 기능
     */
    async rollback() {
        try {
            console.log('\n🔄 롤백을 시작합니다...');
            
            const backupFiles = await fs.readdir(this.backupDir);
            
            for (const fileName of backupFiles) {
                if (fileName.endsWith('.md')) {
                    const backupPath = path.join(this.backupDir, fileName);
                    const originalPath = path.join(this.sourceDir, fileName);
                    
                    const content = await fs.readFile(backupPath, 'utf8');
                    await fs.writeFile(originalPath, content, 'utf8');
                    console.log(`↩️  롤백 완료: ${fileName}`);
                }
            }
            
            console.log('✅ 모든 파일이 롤백되었습니다.');
        } catch (error) {
            console.error(`❌ 롤백 실패: ${error.message}`);
            throw error;
        }
    }
}

// 메인 실행 부분
async function main() {
    const sourceDir = '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/src/content/blog';
    const backupDir = '/Users/kaflix/Projects/birdspring.com/luv20100918.github.io/backup-markdown-fix';
    
    const fixer = new MarkdownFixer(sourceDir, backupDir);
    
    try {
        // 명령행 인자 확인
        const args = process.argv.slice(2);
        
        if (args.includes('--rollback')) {
            await fixer.rollback();
        } else {
            await fixer.processAllFiles();
        }
    } catch (error) {
        console.error('❌ 프로그램 실행 실패:', error.message);
        process.exit(1);
    }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
    main();
}

module.exports = MarkdownFixer;