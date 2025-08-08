---
title: "Spring Boot 2.5.5와 Gradle 8.x 호환성 문제 해결하기: LazyPublishArtifact 오류"
description: "문제 상황  최근 프로젝트를 빌드하는 중 다음과 같은 이해하기 어려운 오류 메시지를 만났습니다:  org.gradle.api.internal.artifacts.dsl.LazyPublishArtifact.(Lorg/gradle/api/provider/Provider;)V * T..."
pubDate: 2025-04-28
---

## 문제 상

황

최근 프로젝트를 빌드하는 중 다음과 같은 이해하기 어려운 오류 메시지를 만났습니다:

org.gradle.api.internal.artifacts.dsl.LazyPublishArtifact.&lt;init&gt;(Lorg/gradle/api/provider/Provider;)V
* Try:
&gt; Run with --stacktrace option to get the stack trace.
&gt; Run with --info or --debug option to get more log output.
&gt; Run with --scan to get full insights.
&gt; Get more help at https://help.gradle.org.
Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.
You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
BUILD FAILED in 816ms이 오류는 **Spring Boot 2.5.5**와 **Gradle 8.x** 버전 간의 호환성 문제로 인해 발생했습니다. 구체적으로 `LazyPublishArtifact` 클래스의 생성자가 Gradle 8.x에서는 다른 방식으로 구현되어 있어 Spring Boot 플러그인이 예상하는 메서드를 찾을 수 없었던 것입니다.

## 문제 진단 과

정

### 1. 오류 메시지 분

석

오류 메시지는 `org.gradle.api.internal.artifacts.dsl.LazyPublishArtifact.&lt;init&gt;(Lorg/gradle/api/provider/Provider;)V`와 같은 형태로 나타났습니다. 이는 `Provider` 객체를 매개변수로 받는 `LazyPublishArtifact` 클래스의 생성자를 찾을 수 없다는 의미입니다.

### 2. 스택트레이스 확

인

--stacktrace 옵션을 사용하여 더 자세한 오류 정보를 확인했을 때, Spring Boot Gradle 플러그인에서 문제가 발생한다는 것을 알 수 있었습니다:

문제 발생 위치: `org.springframework.boot.gradle.plugin.JavaPluginAction.configureArtifactPublication`

### 3. 환경 확

인

프로젝트 환경 조사 결과:

Spring Boot 버전: 2.5.5Gradle 버전: 8.12/8.14Java 버전: 8## 해결 과정

여러 가지 해결 방법을 시도했습니다:

### 1. build.gradle 파일 수정 시

도

첫 번째로 `PublishToMavenRepository` 작업을 비활성화하는 방법을 시도했습니다:

tasks.withType(PublishToMavenRepository).configureEach {
    enabled = false
}

tasks.withType(PublishToMavenLocal).configureEach {
    enabled = false
}하지만 이 방법으로는 문제가 해결되지 않았습니다.

### 2. 네트워크 타임아웃 설정 추

가

gradle.properties 파일에 네트워크 타임아웃 설정을 추가했습니다:

org.gradle.internal.http.connectionTimeout=180000
org.gradle.internal.http.socketTimeout=180000이 방법도 핵심 문제를 해결하지 못했습니다.

### 3. 플러그인 적용 방식 변경 시

도

plugins {} 블록 대신 buildscript {} 블록을 사용하여 플러그인을 적용하는 방식도 시도했으나 또 다른 문제가 발생했습니다.

### 4. 성공적인 해결책: Gradle 버전 다운그레이

드

결국 Gradle 7.x 버전을 사용하는 것이 가장 효과적인 해결책이었습니다. Homebrew를 통해 Gradle 7.6.4를 설치하고 이를 사용하여 빌드를 실행했습니다:

# Gradle 7.x 설치

brew install gradle@7

# Gradle 7.x로 빌드 실행

/usr/local/opt/gradle@7/bin/gradle build이 방법을 통해 빌드가 성공적으로 진행되었습니다!

## 결론 및 장기적 해결

책

Spring Boot 2.5.5는 Gradle 7.x와 호환되지만 Gradle 8.x와는 호환되지 않습니다. 이 문제를 해결하기 위한 장기적인 방법은 다음과 같습니다:

*PATH에 Gradle 7.x를 추가*하여 항상 이 버전 사용:*IDE 설정*에서 프로젝트의 Gradle 버전을 7.x로 지정*Spring Boot 버전 업그레이드*: Spring Boot 2.7 이상으로 업그레이드하여 최신 Gradle과 호환되도록 조정# PATH에 Gradle 7.x 추가하는 방법
echo 'export PATH="/usr/local/opt/gradle@7/bin:$PATH"' &gt;&gt; ~/.zshrc
source ~/.zshrc## 교훈

이 문제를 통해 얻은 교훈은 다음과 같습니다:

라이브러리와 도구 간의 **버전 호환성**은 매우 중요합니다.Spring 프레임워크와 Gradle 같은 도구는 **특정 버전 조합**에서만 정상적으로 작동할 수 있습니다.오류 메시지가 명확하지 않더라도 **스택트레이스 분석**을 통해 문제의 원인을 찾을 수 있습니다.프로젝트 구성 요소를 업그레이드할 때는 **호환성 문서**를 먼저 확인하는 것이 좋습니다.Gradle 7.6.4 릴리스 노트: [https://docs.gradle.org/7.6.4/release-notes.html](https://docs.gradle.org/7.6.4/release-notes.html)

이 글이 같은 문제로 고생하고 있는 개발자들에게 도움이 되길 바랍니다.