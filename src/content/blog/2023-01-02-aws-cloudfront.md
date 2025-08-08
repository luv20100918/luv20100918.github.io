---
title: "AWS-CloudFront"
description: "CDN(Contents Delivery Network)  CDN이란 콘텐츠 제공자와 사용자간 지리적으로 떨어져 있느 ㄴ환경에서 콘텐츠를 빠르게 제공하기위한 기술이다.  캐싱방식에는 정적캐싱과 동적캐싱이 있다.  동적캐싱은 실제 콘텐츠를 캐싱하지 않기 때문에 TTL은 0으로 설정된다...."
pubDate: '2023-01-02'
updatedDate: '2023-08-25'
---

## CDN(Contents Delivery Network)CDN이란 콘텐츠 제공자와 사용자간 지리적으로 떨어져 있느 ㄴ환경에서 콘텐츠를 빠르게 제공하기위한 기술이다.
캐싱방식에는 정적캐싱과 동적캐싱이 있다.
동적캐싱은 실제 콘텐츠를 캐싱하지 않기 때문에 TTL은 0으로 설정된다.
## CloudFrontAWS에서 제공하는 CDN 기능이다.
### 주요기능- CloudFront 글로벌 엣지 네트워크
- 정적, 동적 컨텐츠 딜리버리
- 오리진 Selection
- 오리진 그룹을 통한 Failover
- SSL 지원
- 엑세스 제어
- 보안
- 비용 효율성