---
title: "GHOST 한글 SLUG 사용할때 AMP 404 오류 해결"
description: "고스트로 여러가지를 테스트 하는중이다. 구글 서치 콘솔에서 문제가 식별되어서 고쳐본다."
pubDate: 2022-07-10
updatedDate: 2023-08-25
---

## 현상관리자에서 AMP설정일 켜놨으면, url 뒤에 /amp 를 붙임으로써 amp 페이지를 확인할 수 있지만,

[https://www.birdspring.com/aws-ec2-로-내-서버-구축하기/amp/](__GHOST_URL__/aws-ec2-%EB%A1%9C-%EB%82%B4-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0/amp/)
에 접속하면 404 페이지가 노출이 되었다.(지금은 잘 될꺼다.)

## 원인파악혹시나 해서 URL이 영어로만 되어있는 포스트에 /amp를 붙여서 호출해봤다.

[https://www.birdspring.com/gunicornservice-error/amp](__GHOST_URL__/gunicornservice-error/)
amp페이지가 잘 뜬다.
한글slug문제라는 확신이 90%정도 든다.

## 문제해결고스트가 설치된 서버로 접근해서 vi로 파일하나를 수정한다.

```javascript
vi /var/www/blog/versions/5.2.4/core/server/services/url/UrlService.js

```아래 펑션을 수정한다.
```
getPermalinkByUrl(url, options) {
        options = options || {};

		// const object = this.getResource(url, {returnEverything: true}); // 원본은 주석처리한다.
        const object = this.getResource(decodeURI(url), {returnEverything: true}); // decodeURI로 url부분을 감싸준다.

        if (!object) {
            return null;
        }

        const permalink = _.find(this.urlGenerators, {uid: object.generatorId}).permalink;

        if (options.withUrlOptions) {
            return urlUtils.urlJoin(permalink, '/:options(edit)?/');
        }

        return permalink;
    }

```이렇게 하면 일단 한글slug로 된 포스트들도 amp가 잘 노출된다.

## 끗끝.