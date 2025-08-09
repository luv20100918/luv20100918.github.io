---
title: "Claude 데스크톱과 MCP 서버 연동하기"
description: "Claude 데스크톱과 MCP(Model Context Protocol) 서버를 연동하여 웹 검색, 코드 실행, 파일 시스템 접근 등 확장된 기능을 사용하는 방법을 알아봅니다."
pubDate: 2025-04-22
updatedDate: 2025-04-22
---

## Claude 데스크톱과 MCP 서버 연동하기

Claude는 Anthropic에서 개발한 강력한 AI 어시스턴트로, 데스크톱 애플리케이션 버전을 MCP(Model Context Protocol) 서버와 연동하면 더욱 확장된 기능을 사용할 수 있습니다. 이 글에서는 Claude 데스크톱에 MCP 서버를 연동하는 방법과 주요 MCP 서버 설정에 대해 알아보겠습니다.

### Claude 데스크톱 설치하기

Claude 데스크톱은 [공식 웹사이트](https://claude.ai)에서 간편하게 다운로드하여 설치할 수 있습니다. 설치 후 설정 페이지로 이동하면 개발자 항목이 있는데, 여기서 MCP 서버를 추가할 수 있습니다.

### MCP 서버 소개 및 연동 방법

MCP(Model Context Protocol)는 AI 모델이 외부 도구와 소통할 수 있게 해주는 프로토콜입니다. Claude 데스크톱에 MCP 서버를 연동하면 다음과 같은 다양한 기능을 사용할 수 있습니다:

- 웹 검색 및 웹페이지 콘텐츠 분석
- 코드 실행 및 터미널 명령어 실행
- 파일 시스템 접근 및 파일 읽기/쓰기
- 데이터베이스 쿼리 실행
- API 호출 및 외부 서비스 연동

설정 화면에서 개발자 옵션으로 들어가 MCP 서버를 추가하는 방식으로 연동이 가능합니다.

### 주요 MCP 서버 설정하기

아래는 자주 사용되는 MCP 서버 설정 예시입니다:

#### 1. Sequential Thinking (순차적 사고)

Claude가 복잡한 문제를 단계적으로 해결할 수 있게 해주는 서버입니다. 이 서버를 활성화하면 Claude가 문제를 체계적으로 분석하고 단계별로 해결책을 제시합니다.

```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}
```

#### 2. Filesystem (파일 시스템 접근)

로컬 파일 시스템에 접근하여 파일을 읽고 쓸 수 있게 해주는 서버입니다.

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
  }
}
```

#### 3. Brave Search (웹 검색)

Brave 검색 엔진을 통해 최신 정보를 검색할 수 있게 해주는 서버입니다.

```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "your-api-key-here"
    }
  }
}
```

#### 4. GitHub (GitHub 연동)

GitHub 리포지토리와 연동하여 코드 검색, 이슈 관리, PR 생성 등을 할 수 있게 해주는 서버입니다.

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
    }
  }
}
```

### MCP 서버 활용 팁

1. **보안 고려사항**: 파일 시스템 접근 권한은 필요한 디렉토리로만 제한하세요.
2. **API 키 관리**: 환경 변수로 API 키를 관리하여 보안을 강화하세요.
3. **서버 조합**: 여러 MCP 서버를 함께 사용하여 더 강력한 기능을 구현할 수 있습니다.
4. **성능 최적화**: 자주 사용하는 서버만 활성화하여 리소스를 효율적으로 관리하세요.

### 마치며

Claude 데스크톱과 MCP 서버 연동은 AI 어시스턴트의 능력을 크게 확장시켜줍니다. 위에서 소개한 서버들을 조합하여 사용하면 개발 생산성을 크게 향상시킬 수 있습니다. 각자의 워크플로우에 맞는 MCP 서버를 선택하여 활용해보시기 바랍니다.