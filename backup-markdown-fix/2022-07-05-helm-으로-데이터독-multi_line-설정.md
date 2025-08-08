---
title: "Helm 으로 데이터독 multi_line 설정이 잘 안되더군요"
description: "쿠버네티스 환경에서 헬름으로 데이터독 연동 구성시 멀티라인 설정이 힘들어서 기록으로 남긴다."
pubDate: 2022-07-05
updatedDate: 2023-03-31
---

쿠버네티스환경에서 데이터독 연동을 위해서 여러가지 방법중에 하나인 Helm으로 설정하는 방법으로 데이터독 에이전트를 설치했다.

## 운영환경쿠버네티스 + springboot앱

## 문제현상헬름으로 설치한 데이터독 에이전트 설정을 멀티라인으로 설정을 했는데도, 실제로 데이터독에서는 로그가 라인별로 표기되는 문제.

데이터독에서는 로그데이터를 수신하는 라인별(요청별)로 요금이 측정되기 때문에, 편의성 뿐만이 아니라 요금 측면에서도 멀티라인 설정은 필수.

## 해결[https://github.com/DataDog/helm-charts/issues/570](https://github.com/DataDog/helm-charts/issues/570)

구글링을 통해 위 링크에 답글을 보고 해결했음.
데이터독 에이전트 데몬셋을 직접 수정해서
DD_LOGS_CONFIG_AUTO_MULTI_LINE_DETECTION 을 true 로 설정.
멀티라인 관련한 디플로이먼트의 설정들은 모두 제거 하고
어노테이션에 아래 내용만 추가함.
```
				annotations:
                  ad.datadoghq.com/myapp.logs: |-
                    [{
                      "source": "java",
                      "service": "myapp",
                      "log_processing_rules": [{
                        "type": "multi_line",
                        "name": "log_start_with_date",
                        "pattern" : "\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\.\\d{3}"
                      }]
                    }]  

```패턴은 기본적인 스프링 부트 설정시 콘솔로 찍어주는 패턴 시작 부분.
Ex)
2022-07-05 11:11:11.222 [myapp, 00000000, 00000000] [xxxxx] 블라블라