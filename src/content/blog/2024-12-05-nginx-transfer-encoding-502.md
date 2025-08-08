---
title: "Nginx 에서 transfer-encoding 관련 헤더 중복 오류 502"
description: "문제발생  아… 개발서버를 다른 서버로 바꿨는데 위와 같은 오류가 발생했다. 정상적인 API와 위처럼 오류나는 API가 같이 발생되는 상황이라 왜지? 의문이 들었다.  여러 API를 비교해보니 비정상적인 API는 내부적으로 다른 마이크로서비스를 호출하는 API들이었다. 그래서 거처가는..."
pubDate: '2024-12-05'
heroImage: 'content/images/2024/12/DraggedImage-3.png'
---

## 문제발생아… 개발서버를 다른 서버로 바꿨는데 위와 같은 오류가 발생했다. 정상적인 API와 위처럼 오류나는 API가 같이 발생되는 상황이라 왜지? 의문이 들었다.
여러 API를 비교해보니 비정상적인 API는 내부적으로 다른 마이크로서비스를 호출하는 API들이었다. 그래서 거처가는 모든 백앤드의 로그를 살펴봤는데 로그들이 정상적으로 출력되는 것이 아닌가? 어라? 결국은 마지막에 리턴하는 웹서버의 문제인가? 라는 합리적인 의심이 들었다.
![(nginx를 거처서 가면 502, A를 호출하면 B까지 갔다가 정상적으로 200)](content/images/2024/12/DraggedImage-1.png)(nginx를 거처서 가면 502, A를 호출하면 B까지 갔다가 정상적으로 200)Nginx ingress 컨트롤러 로그를 살펴보니 아래와 같았다.
```
2024/12/05 07:05:22 [error] 50#50: *2205044 upstream sent duplicate header line: "Transfer-Encoding: chunked", previous value: "transfer-encoding: chunked" while reading response header from upstream, client: x.x.x.x, server: example.com, request: "GET / HTTP/2.0"

```## 여러가지 시도먼저 위 현상을 보고 짐작했던 부분은 nginx가 뭔가 다르게 동작한다는 것이었다. 왜냐하면 기존서버에서는 해더에 transfer-encoding가 똑같이 두개씩 내려오고 있었는데 정상적으로 동작하고 있었기 때문이다. 그래서 요즘 문제가 생기는 나를 도와주고 있는 쳇쥐피티에게 물어봤지만 다 소용없었다.
적용해서 실패한 내용은 대충 설명하면,
http2로 백엔드를 변경 -> 실패
Feignclient 에 리퀘스트해더 부분에 content-length 를 설정 -> 실패(이건 요청해더를 왜 수정하는지 모르겠다.)
서블릿필터를 적용해서 관련 해더 제거 -> 실패
점점 열이 올라왔다.
참고로 내가 문제를 겪고 있는 환경은 스프링 2.5.5 버전에 다른 서버랑 통신하는 모듈은 openfeign을 사용하고 있다. 쿠버네티스기반의 마이크로서비스 구성이다.
그리고 기존의 구 쿠버네티스 환경에서 이번에 신 쿠버네티스 환경으로 어플리케이션들을 이관하고 있는 중이다.
차치하고,
[https://forum.nginx.org/read.php?2,297086,297089#msg-297089](https://forum.nginx.org/read.php?2,297086,297089#msg-297089)
[https://github.com/kubernetes/ingress-nginx/issues/4838](https://github.com/kubernetes/ingress-nginx/issues/4838)
위 게시물들을 참고하고 쳇쥐피티도 활용해서 아래와 같은 솔루션을 입수했다.
결국 문제는 내가 호출하는 컨트롤러등에서 또 다른 서버를 feign client로 호출하면 Transfer-Encoding 응답헤더가 두개가 생긴다. 컨트롤러 내부에서 다른 서버 호출하는 로직이 없으면 Transfer-Encoding 응답헤더가 하나만 존재함 을 확인했다.
```
connection: keep-alive
date: Wed, 04 Dec 2024 13:54:33 GMT
keep-alive: timeout=60
transfer-encoding: chunked <<-- 여기부분이 있고 없고 차이
Content-Type: application/json
Transfer-Encoding: chunked

```신규 시스템의 Nginx의 버전을 낮추는 방법도 있겠지만 시스템 전반적으로 현재 이상이 없는 시스템의 nginx버전을 다운그레이드 하는것은 문제가 더 생길것 같은 불길한 예감이 있어서 프로그램안에서 해결하는 것으로 잠정 결정했다.
인터넷 서치한 결과 스프링부트 버전을 3.x로 올리는 방법도 괜찮아 보였다. 하지만 같이 수정되어야 하는 소스의 양이 가늠이 되질 않았다. 분명 많은 부분이 수정되어야 할 것처럼 보였다. 안봐도 비디오다. 이건 차세대나 할때 완전 갈아타거나 정말 인력이 많을때 하나하나씩 수정해야 할 부분이다. 뭐 결론은 너무 두려워서 포기했다. 위에서 모든 실패를 하고난 이후에 아래 로직을 적용해서 성공했는데 반만 성공을 했다. 무슨 말이냐면 소스를 먼저 보겠다.
```
@ControllerAdvice
public class CustomResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, org.springframework.core.MethodParameter returnType,
                                  org.springframework.http.MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  org.springframework.http.server.ServerHttpRequest request,
                                  org.springframework.http.server.ServerHttpResponse response) {
        // Transfer-Encoding 헤더 제거
        response.getHeaders().remove("Transfer-Encoding");
        return body;
    }
}

```위와 같이 컨트롤러어드바이스를 만들어서 적용했더니 두개씩 출력되던 transfer-encoding가 하나만 응답으로 내려왔다. 살짝 감동하고 개발서버에 업로드 했는데 여전히 두개가 튀어나오면서 502 에러가 발생하는 거다.
# 해결결론 부터 말하면,
```
response.getHeaders().remove("transfer-encoding");

```위의 코드처럼 모두 소문자로 변경하니 제대로 삭제가 되었다. 아마 로컬에서는 대소문자를 구분하지 않았던 것으로 보였다. 솔직히 해더 목록까지 찍어보기는 너무 지친상태라서 안했다. 암튼 위처럼 바꾸고 개발서버에 업로드 하니 안나오던 API가 제대로 출력되었다. 많은 시간을 투입해서 찾은거라 기쁘기도 하지만 한편으론 열이 올라오는 상황에서 해결방법을 공유해 본다.