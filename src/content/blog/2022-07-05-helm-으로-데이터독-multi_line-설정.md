---
title: "Helm 으로 데이터독 multi_line 설정이 잘 안되더군요"
description: "쿠버네티스 환경에서 헬름으로 데이터독 연동 구성시 멀티라인 설정이 힘들어서 기록으로 남긴다."
pubDate: 2022-07-05
updatedDate: 2023-03-31
---

쿠버네티스 환경에서 데이터독 연동을 위해서 여러가지 방법중에 하나인 Helm으로 설정하는 방법으로 데이터독 에이전트를 설치했다.

## 🏗️ 운영 환경

- **플랫폼**: Kubernetes
- **애플리케이션**: Spring Boot
- **모니터링**: Datadog
- **배포 도구**: Helm

## ❌ 문제 현상

헬름으로 설치한 데이터독 에이전트 설정을 멀티라인으로 설정을 했는데도, 실제로 데이터독에서는 로그가 라인별로 표기되는 문제가 발생했다.

### 왜 중요한가?

데이터독에서는 로그데이터를 수신하는 **라인별(요청별)로 요금이 측정**되기 때문에, 편의성 뿐만이 아니라 **요금 측면에서도 멀티라인 설정은 필수**다.

### 예시

**원하는 결과**: 하나의 스택트레이스가 하나의 로그로
```
2022-07-05 11:11:11.222 [myapp] ERROR - Exception occurred
java.lang.NullPointerException: null
    at com.example.Service.method(Service.java:123)
    at com.example.Controller.handle(Controller.java:45)
```

**실제 발생한 문제**: 각 라인이 별도의 로그로 처리됨
```
로그 1: 2022-07-05 11:11:11.222 [myapp] ERROR - Exception occurred
로그 2: java.lang.NullPointerException: null
로그 3:     at com.example.Service.method(Service.java:123)
로그 4:     at com.example.Controller.handle(Controller.java:45)
```

## ✅ 해결 방법

구글링을 통해 [GitHub Issue #570](https://github.com/DataDog/helm-charts/issues/570)에서 해결책을 찾았다.

### 1단계: DaemonSet 수정

데이터독 에이전트 DaemonSet을 직접 수정해서 환경변수 추가:

```bash
kubectl edit daemonset datadog-agent -n datadog
```

다음 환경변수를 추가:
```yaml
env:
  - name: DD_LOGS_CONFIG_AUTO_MULTI_LINE_DETECTION
    value: "true"
```

### 2단계: Deployment Annotation 설정

멀티라인 관련한 Deployment의 설정들은 모두 제거하고 annotation에 아래 내용만 추가:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    metadata:
      annotations:
        ad.datadoghq.com/myapp.logs: |-
          [{
            "source": "java",
            "service": "myapp",
            "log_processing_rules": [{
              "type": "multi_line",
              "name": "log_start_with_date",
              "pattern": "\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\.\\d{3}"
            }]
          }]
```

### 패턴 설명

패턴 `\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\.\\d{3}`는 기본적인 스프링 부트 설정시 콘솔로 찍어주는 패턴 시작 부분을 매칭한다.

**예시 로그**:
```
2022-07-05 11:11:11.222 [myapp, 00000000, 00000000] [xxxxx] INFO - Application started
```

## 🔧 추가 설정 옵션

### Helm values.yaml 설정 (대안)

Helm chart의 values.yaml에서 설정하는 방법:

```yaml
datadog:
  logs:
    enabled: true
    containerCollectAll: true
    autoMultiLineDetection: true
```

### 다른 패턴 예시

**Python 로그**:
```yaml
"pattern": "^\\[?\\d{4}-\\d{2}-\\d{2}"
```

**Node.js 로그**:
```yaml
"pattern": "^\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
```

## 💡 주의사항

1. **재시작 필요**: DaemonSet 수정 후 Pod들이 재시작되어야 설정이 적용된다
2. **요금 절감**: 멀티라인 설정으로 로그 개수가 줄어들어 비용 절감 효과
3. **패턴 테스트**: 정규식 패턴은 실제 로그 형식에 맞게 조정 필요
4. **버전 호환성**: Datadog Agent 버전에 따라 설정 방법이 다를 수 있음

## 📝 결론

Helm으로 Datadog을 설치할 때 멀티라인 설정이 제대로 동작하지 않는 것은 흔한 문제다. `DD_LOGS_CONFIG_AUTO_MULTI_LINE_DETECTION` 환경변수와 적절한 annotation 설정으로 해결할 수 있다.

이 설정으로 스택트레이스나 멀티라인 로그가 하나의 로그 엔트리로 처리되어 가독성도 좋아지고 비용도 절감된다!