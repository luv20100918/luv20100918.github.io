---
title: "SpringBoot 쓰레드 무한 생성 테스트 코드"
description: "스프링 부트에서 쓰레드를 무한 생성하는 테스트 코드를 작성해 보았다.  아래의 예시는 JUnit과 SpringBootTest를 이용해서 테스트 코드를 작성하는 법이다.  import org.junit.jupiter.api.Test; import org.springframework.boo..."
pubDate: '2023-12-20'
---

스프링 부트에서 쓰레드를 무한 생성하는 테스트 코드를 작성해 보았다.
아래의 예시는 JUnit과 SpringBootTest를 이용해서 테스트 코드를 작성하는 법이다.
```
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ThreadCreationTest {

    @Test
    public void testThreadCreation() throws InterruptedException {
        while (true) {
            Thread thread = new Thread(() -> {
                // 생성될 때마다 실행될 코드
                try {
                    Thread.sleep(1000); // 1초 대기
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            thread.start(); // 쓰레드 시작
        }
    }
}

```개발자들은 보면 알겠지만, 간단히 설명하면 testThreadCreation메소드 안에서 While문으로 무한 루프를 생성하고 그 안에서 쓰래드를 무한정 생성한다. 생성된 쓰래드를 유지하기위해 1초의 딜레이를 줬다.
위 테스트 코드를 실행하면 쓰레드가 무한 생성될 것이다. 나는 해당 코드로 쓰레드가 무한으로 생성될때 시스템에 어떻게 영향을 미치는지 테스트 하기 위해서 작성했었다. 당연히 프로덕션에서는 사용하지 말아야 한다.