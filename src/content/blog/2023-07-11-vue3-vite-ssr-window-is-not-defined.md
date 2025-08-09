---
title: "vue3 vite ssr window is not defined"
description: "그냥 경험담, 푸념, 누가 풀어주면 좋을텐데"
pubDate: 2023-07-10
updatedDate: 2023-08-27
---

전에도 이야기 했지만 vite + vue3으로 프로젝트를 구축했다. 정말 마음에 안드는 부분이 ssr(server side rendering)을 하려고 express를 이용한 백단로직이 구현되어있는데 그것때문에 window is not defined 혹은 document를 못찾아서 서버가 종료되는 오류가 발생하게 된다.

## 왜?

기본적으로 vue3는 프론트앤드 기술인데, ssr을 위한 서버를 동작시키기 위해서 node 서버인 express를 사용하게 된다. 프론트앤드 즉 클라이언트 단에서는 브라우져에 window, document 객체가 존재하나 node 에는 두 객체 모두 존재하지 않는다. 그래서 ssr이 적용된 페이지를 호출할 때, node 서버 쪽으로 window, document 등의 객체에서 뭔가 가져오거나 실행하게 되면 오류가 발생하게 된다.

## 해결방법

window나 document가 존재하는지 확인한후에 로직을 실행하도록 코드를 구현하면 되는데 아래와 같은 예제처럼 구현하게 된다.

```typescript
<script setup lang="ts">
...
function exam() {
  if(typeof window !== 'undefined') {
    // 구현
  }
}
...
</script>
```

지저분 하다. 멋지지 못하다. 그렇지만 바로 해결이 된다.

## 문제점

위 방법도 문제가 있는 데, 설치한 모듈안에서 document나 window를 사용하게 구현된 녀석들을 처리하기가 힘들다. 결국은 모듈을 사용하는 모든 부분에 위처럼 윈도우 객체가 존재하는지 확인을 해야하는데, 심각하게 코드가 쿨하지 못하게 된다.

## 결론

vue에서 ssr을 하는건 정말 멋없는 것 같다. 쿨한 방법이 있는데 내가 못찾는건지 공부를 더 해야하는지는 알수 없지만, 갑자기 리액트가 마려워진다. 그냥 next.js에서 react로 개발하면 더 멋지지 않을까? react로 제대로 개발해보지 않아서 잘 모르겠지만 그냥 푸념만 나온다. vue3에서 ssr을 사용할 사람들은 위와 같은 문제에 대한 해결방법이 없으면 다른 프레임워크나 라이브러리도 고민해보길 바란다.
