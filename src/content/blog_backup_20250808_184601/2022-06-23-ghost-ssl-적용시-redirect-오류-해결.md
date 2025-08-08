---
title: "Ghost 블로그 설치 with Lightsail, SSL 적용시 Redirect 127.0.0.1:2368 해결방법"
description: "AWS 라이트세일을 이용해서 고스트 블로그를 설치하고 SSL 적용시 발생하는 문제를 해결합니다."
pubDate: 2022-06-23
updatedDate: 2023-03-31
---

### 현상발생AWS Lightsail 을 이용해서 Ghost를 설치한

다.

Bitnami 고스트가 설치되기 때문에, bncert-tool를 사용해서 SSL 설정을 했다.
그런데 ghost 의 설정파일인 config.production.json 안에 사이트 주소가 http로 하드코딩 되어있다. https로 변경했다.
그랬더니 이런 현상이 발생했다.

### 문제해결아래처럼 주소에 도메인을 치

면,

아래처럼 IP로 redirect 된다.
내기준으로 /opt/bitnami/apache/conf/bitnami/bitnami-ssl.conf
SSL 처리한 Conf 파일을 연다.
```
<VirtualHost _default_:443>
...
//여기 사이에 아래코드를 삽입한다. 
RequestHeader set X-Forwarded-Proto "https"
RequestHeader set X-Forwarded-Port "443"
...
</VirtualHost>

```

Nginx로 설치 했다고 해도 비슷한 처리가 필요하다. 아래 처리 참고 바란다.
```
location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:2368;
    }

```

해결완료.