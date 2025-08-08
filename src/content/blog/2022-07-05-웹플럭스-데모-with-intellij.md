---
title: "웹플럭스 데모 with Intellij"
description: "3년전쯤 작성한 문서로 아직도 난 실무에서 웹플럭스를 적용한 곳이 없다."
pubDate: '2022-07-05'
updatedDate: '2023-04-01'
---

요즘 리액티브라는 말을 많이 듣는다. 주변에 온통 개발자들 뿐이니 이야기 주제들도 모두 그렇기 떄문일거다. 그래서 인터넷에 검색해보면 머리가 나빠서 이해가 힘들다. 그래서 왜 쓰는건지, 어디에 적용할 수 있는건지 도통 알 수가 없다. 리액티브랑 웹플럭스는 또 무슨관계인지..
그냥 따라 해 보자.
## 설정먼저 인텔리제이를 실행한다.
New Project를 선택한다.
Spring Initializer 를 선택하고 진행을 한다. JDK는 1.8로 진행하겠다.
흔히 설정하는 데로 알아서 넣는다.
Reactive Web 을 선택하면 스프링 웹플럭스가 자동으로 설정이 된다.
프로젝트 이름을 대충정한다. webFluxDemo 라고 지었다.
위 이미지와 같은 모양으로 되면 일단 설정이 된것 같은데?
## 샘플구현이제는 이 웹플럭스 환경 위에서 코딩을 할 차례다.
먼저 주기적으로 데이터를 변경할수 있는 데모 쓰래드를 만든다.
```
import java.util.concurrent.TimeUnit;

public class DemoThread extends Thread{

    public void run() {
        loop(0);
    }

    private void loop(int i) {
        try {
            System.out.println(i);

            TimeUnit.SECONDS.sleep(5);
            DemoHandler.stream.put("count", i);

            loop(i+1);
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}

```데모 핸들러를 만든다. 생성자에서 데모 쓰래드를 호출한다.
```
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class DemoHandler {

    public final static Map<String, Object> stream = new HashMap<>();

    private Mono<Map<String, Object>> mono = Mono.just(stream);

    public Mono<ServerResponse> demo(ServerRequest request) {

        String query = request.queryParam("query").orElse("empty");

        mono.subscribe(x -> {
            System.out.println("query -> " + query + ", " + x);
        });

        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromProducer(mono, Map.class));
    }

    public DemoHandler() {
        DemoThread dt = new DemoThread();
        dt.start();
    }
}

```URL맵핑을 위한 데모 라우터를 만든다.
```
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class DemoRouter {

    @Bean
    public RouterFunction<ServerResponse> route(DemoHandler handler) {
        return RouterFunctions.route(
                RequestPredicates.GET("/demo")
                        .and(RequestPredicates.accept(MediaType.TEXT_PLAIN)), handler::demo);
    }
}

```http://localhost:8080/demo 를 호출하면 JSON으로 {“count”, 0} 이라고 출력된다.
새로고침하면 카운트 숫자가 계속 증가된다.
샘플을 잘 만든건지 모르겠다.
그냥 단순히 스프링 MVC 와 다르게 개발을 하는 것 뿐인건가?
## 자료를 좀 더 찾아보자웹플럭스는 비동기 프로그램을 좀더 잘하기 위한 방법인 것 같다. 내가 생각한 것과는 다른 내용인 것 같다. 그러면 뭔가 병렬로 처리되어야 하는 것들을 잘 처리하기 위해 나온 것이라고 보면될까? 그러면 병렬처리로 성능항상이 크게 있을 만한 곳에 사용하면 되는 거겠지?
회사가서 똑똑한 개발자들에게 물어보고 포스팅에 틀린 내용이 있다면 추후 수정하도록 하자.