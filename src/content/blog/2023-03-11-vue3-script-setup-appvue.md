---
title: "Vue3 <script setup> 사용시 App.vue 에서 에러가 납니다"
description: "vue3으로 전환하면서  관련한 오류(경고)가 발생했다."
pubDate: 2023-03-11
updatedDate: 2023-04-01
---

vue를 v2를 사용하다가 v3으로 변경하면서 너무너무너무 좋은 기능을 발견했다. 기존에 export default {} 를 선언해서 데이터든 컴포넌트등 설정을 했었다면 이제는 &lt;script&gt;&lt;/script&gt; 속성에 setup만 정의해주면 그런 보일러플레이트를 모두 제거할 수 있다. 심플이즈베스트!

그런데 문제가 생겼다. 다른 컴포넌트에서는 모두 변경해서 이상없이 동작을 했는데 App.vue안에서만 요상한 에러가 발생했다.

(에러이미지)

그로인해 앱은 동작하지 않았다. 다른 부분은 전부 &lt;script setup&gt; 로 변경했는데 App.vue만 변경 못하고 기존 소스 그대로인 것은 기분이 별로다.

구글링 고고!!!

[https://github.com/vuejs/vue-cli/issues/6282](https://github.com/vuejs/vue-cli/issues/6282)

구글링 한대로 vue-loader을 최신 버전으로 추가했다.

필자는 `yarn add vue-loader` 를 실행!

해결완료!
