---
title: "Vue3에서 CSS파일 임포트"
description: "vue 에서 css 파일을 임포트하기 위한 방법은 3가지가 있다.  첫번째는 script 영역에서 임포트하는 방법이 있는데,   import '@//test.css' ...    위와 같은 방법으로 임포트를 하게 되면, 모든 화면에서 test.c..."
pubDate: 2023-06-14
updatedDate: 2023-08-27
---

vue 에서 css 파일을 임포트하기 위한 방법은 3가지가 있다.
첫번째는 script 영역에서 임포트하는 방법이 있는데,
```javascript
<script>
import '@/<path>/test.css'
...
</script>

```위와 같은 방법으로 임포트를 하게 되면, 모든 화면에서 test.css를 포함하게 된다. 글로벌로 적용된다는 얘기.
두번째는 style 영역에서 임포트하는 방법이 있다.
```
<style>
@import '@/<path>/test.css';
...
</style>

```이렇게 임포트하면 첫번째와 마찬가지로 글로벌로 적용된다.
마지막으로 style scoped 로 임포트 하는 방법이 있는데, 두번째와 흡사하지만 style태그의 속성으로 scoped 라는 속성이 추가된다.
```
<style scoped>
@import '@/<path>/test.css';
...
</style>

```scoped 를 선언하면 로컬에서만 스타일을 사용하겠다는 의미가 되며 마찬가지로 test.css는 해당 vue 파일 안에서만 사용되게 된다.