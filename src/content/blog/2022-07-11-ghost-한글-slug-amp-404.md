---
title: "GHOST 한글 SLUG 사용할때 AMP 404 오류 해결"
description: "고스트로 여러가지를 테스트 하는중이다. 구글 서치 콘솔에서 문제가 식별되어서 고쳐본다."
pubDate: 2022-07-10
updatedDate: 2023-08-25
---

## 🔍 현상

관리자에서 AMP 설정을 켜놨으면, URL 뒤에 `/amp`를 붙임으로써 AMP 페이지를 확인할 수 있지만, 한글 slug를 사용하는 경우 문제가 발생했다.

### 문제 상황

예를 들어 아래 URL에 접속하면:
```
https://www.birdspring.com/aws-ec2-로-내-서버-구축하기/amp/
```

**404 페이지가 노출**되었다. (지금은 수정되어 잘 작동한다.)

## 🎯 원인 파악

혹시나 해서 URL이 영어로만 되어있는 포스트에 `/amp`를 붙여서 호출해봤다.

```
https://www.birdspring.com/gunicornservice-error/amp
```

결과: **AMP 페이지가 잘 뜬다.**

→ **한글 slug 문제라는 확신이 90% 정도 든다.**

## ✅ 문제 해결

고스트가 설치된 서버로 접근해서 vi로 파일 하나를 수정한다.

### 1. 파일 열기

```bash
vi /var/www/blog/versions/5.2.4/core/server/services/url/UrlService.js
```

### 2. 함수 수정

`getPermalinkByUrl` 함수를 아래와 같이 수정한다:

```javascript
getPermalinkByUrl(url, options) {
    options = options || {};
    
    // const object = this.getResource(url, {returnEverything: true}); // 원본은 주석처리
    const object = this.getResource(decodeURI(url), {returnEverything: true}); // decodeURI로 url 감싸기
    
    if (!object) {
        return null;
    }
    
    const permalink = _.find(this.urlGenerators, {uid: object.generatorId}).permalink;
    
    if (options.withUrlOptions) {
        return urlUtils.urlJoin(permalink, '/:options(edit)?/');
    }
    
    return permalink;
}
```

### 핵심 변경 사항

- `this.getResource(url, ...)` → `this.getResource(decodeURI(url), ...)`
- **decodeURI()** 함수로 URL을 디코딩하여 한글 문자를 올바르게 처리

## 🎉 결과

이렇게 수정하면 한글 slug로 된 포스트들도 AMP가 정상적으로 노출된다!

## 💡 추가 정보

### Ghost 버전별 파일 경로

Ghost 버전에 따라 파일 경로가 다를 수 있다:
- Ghost 5.x: `/var/www/blog/versions/5.x.x/core/server/services/url/UrlService.js`
- Ghost 4.x: `/var/www/blog/versions/4.x.x/core/server/services/url/UrlService.js`

### 주의사항

1. **백업 필수**: 파일 수정 전 반드시 백업을 만들어두자
   ```bash
   cp UrlService.js UrlService.js.backup
   ```

2. **Ghost 재시작**: 수정 후 Ghost를 재시작해야 변경사항이 적용된다
   ```bash
   ghost restart
   ```

3. **업데이트 시 주의**: Ghost를 업데이트하면 이 수정사항이 초기화될 수 있으므로 다시 적용해야 한다

## 📝 결론

한글 slug를 사용할 때 AMP 페이지에서 404 오류가 발생하는 것은 URL 인코딩 문제였다. `decodeURI()` 함수를 사용하여 URL을 적절히 디코딩하면 문제가 해결된다.

끝!