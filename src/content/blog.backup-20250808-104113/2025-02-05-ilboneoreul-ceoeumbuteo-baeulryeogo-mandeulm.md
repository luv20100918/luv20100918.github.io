---
title: "일본어를 처음부터 배울려고 만듦"
description: "요즘에 개발자들이 커서가 핫하다. 무료 플랜으로 일주일 써보고 괜찮아서 유료로 구독을 시작했다. 구독했는데 그냥 썩히면 돈이 아깝기 떄문에 그냥 뭐라도 만들고 싶었다. 마침 시작한 일본어 공부 카루가루 일본어 배우기라는 책을 사서 공부를 시작했는데 처음에 히라가나를 배우는 것 부터 막막..."
pubDate: '2025-02-05'
updatedDate: '2025-02-05'
---

요즘에 개발자들이 커서가 핫하다. 무료 플랜으로 일주일 써보고 괜찮아서 유료로 구독을 시작했다. 구독했는데 그냥 썩히면 돈이 아깝기 떄문에 그냥 뭐라도 만들고 싶었다. 마침 시작한 일본어 공부 카루가루 일본어 배우기라는 책을 사서 공부를 시작했는데 처음에 히라가나를 배우는 것 부터 막막했다. 책살 때 포함된 연습하는 종이에 계속 따라서 쓰면서 발음하면서 외워도 잘 안외워지는 것이다. 머리가 굳은 증거. 그래서 계속 누군가 시험을 내줬으면 했다. 그래서 그런 앱이 있나 하고 인터넷 검색을 해도 잘 나오지 않았다. 내친김에 커서한테 만들어달라고 해야겠다고 생각함. 
```

# 일본어 글자 외우기

히라가나, 가타카나 외우기

## 요구사항

1. 히라가나를 외웠는지 체크하고 점수를 매긴다.
2. 가타카나를 외웠는지 체크하고 점수를 매긴다.
3. 히라가나와 가타카나를 외우는 비율을 체크하고 점수를 매긴다.
4. 히라가나와 가타카나를 외우는 비율이 100%가 되면 완료한다.

## 화면설계

메인화면에는 히라가나와 가타카나를 선택하는 버튼과 시작버튼이 있다. 
시작버튼을 클릭하면 시험화면으로 전환되며 앞에서 선택한 언어에 맞는 문제가 랜덤으로 출력된다.
문제의 형태는 언어가 화면중앙에 크게 출력되며 하단에 발음기호를 입력할 수 있는 텍스트박스가 있다. 그 옆에는 정답 버튼이 있다.
정답 버튼을 클릭하면 정답 여부가 판단되며 정답일 경우 정답 버튼이 녹색으로 변경되며 오답일 경우 빨간색으로 변경된다.
정답이나 오답에 대한 기록이 우측에 문제와 같이 누적되어 출력된다.
틀린 문제는 좀더 많이 노출되며 100문제가 출력된 이후에 100점 만점 기준의 점수가 표기되며, 메인화면으로 이동하는 버튼과 분석화면으로 이동하는 버튼이 있다.
분석화면에서는 틀린 문제와 맞은 문제의 비율이 표기되며 틀린 문제는 문제와 함께 출력된다.

## Component Guidelines

### ShadCN Components

- 모든 UI 컴포넌트는 ShadCN Components를 사용한다.
- 컴포넌트를 사용 전 설치 여부를 확인해야 한다. `/components/ui/` 폴더 체크
- 컴포넌트 설치 명령어를 사용해야 한다.: `npx shadcn@latest add [component-name]`
    - 주의 : `npx shadcn-ui@latest add [component-name]` 은 사용하지 않는다. 반드시 `npx shadcn@latest add [component-name]` 을 사용해야 한다.

### Icons

- 모든 아이콘은 Lucide Icons를 사용한다.
- 아이콘 임포트 방법: `import { IconName } from "lucide-react"`
- 예시: `import { Search, Menu } from "lucide-react"`

### Component Structure

- 컴포넌트는 `/components` 폴더에 위치해야 한다.
- UI 컴포넌트는 `/components/ui` 폴더에 위치해야 한다.
- 페이지별 컴포넌트는 `/app` 폴더 내 해당 라우트에 위치해야 한다.

## Best Practices

- TypeScript를 사용하지 않는다. JSDOC를 사용한다.
- 컴포넌트는 재사용이 가능하도록 설계해야 한다.

## 에이전트 설명 및 역할

You are an expert in JavaScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI and Tailwind.

### Key Principles

- Write clean, well-documented JavaScript code with JSDoc comments
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure files: exported component, subcomponents, helpers, static content

### Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components

### JavaScript & JSDoc Usage

- Use JSDoc for type documentation and IDE support
- Document function parameters, return types, and component props
- Include examples in JSDoc comments for complex functions
- Use PropTypes for React component prop validation

### Syntax and Formatting

- Use the "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
- Use declarative JSX

### UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling
- Implement responsive design with Tailwind CSS; use a mobile-first approach

### Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use WebP format, include size data, implement lazy loading

### Key Conventions

- Use 'nuqs' for URL search parameter state management
- Optimize Web Vitals (LCP, CLS, FID)
- Limit 'use client':
  - Favor server components and Next.js SSR
  - Use only for Web API access in small components
  - Avoid for data fetching or state management

Follow Next.js docs for Data Fetching, Rendering, and Routing.
```커서로 프로젝트를 생성한후에 루트에 위와 같이 커서룰을 작성했다. 
그리고 말했다. 
"빛이 있으라."
커서가 막 만들어 주기 시작했다. 컴포저를 agent모드로 실행했기 때문에 나에게 계속 질문을 던지면서 허락을 구했다. 나는 쿨하게 확인해줬다. 
그리고 거의 한번에 프로그램이 완성됬다. 물론 미진한 부분은 커서를 혼내면서 계속 작업을 시켰다. 얼추 내가 개인적으로 쓸만한 프로그램이 만들어졌다. 혹시 쓸 사람들이 있을 수 있을 거라 생각되서....
광고를 붙였다. 광고도 커서에게 부탁해서 붙이고, 
또 부탁해서 GA4도 붙였다. 
모든 작업을 완료하고 나의 라이트세일에 업로드 한후에 빌드, 
빌드하다가 멈춤... 
스왑메모리 설정.. 
잘된다. 
pm2 로 가동!
그리고 사이트에 접속했다. 
[https://hiragana.birdspring.com](https://hiragana.birdspring.com)
그러자 빛이 있었다.