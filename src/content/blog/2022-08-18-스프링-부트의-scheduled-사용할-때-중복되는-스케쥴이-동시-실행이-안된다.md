---
title: "스프링 부트의 @Scheduled 사용할 때 중복되는 스케쥴이 동시 실행이 안된다"
description: "스프링 부트가 모든 걸 다 해주니까 너무 안일했다. 다 해주긴 하지만 원하는대로 다 해주진 않는다."
pubDate: '2022-08-18'
updatedDate: '2023-03-31'
---

## 문제점스프링 배치의 잡을 실행할 떄, 스프링 부트의 @Scheduled 를 이용해서 주기적으로 배치잡을 실행한다. 그런데 수행시간이 긴 잡을 실행할 때, 동시에 실행되어야 하는 잡이 실행이 되지 않았다.
## 해결방법아래와 같이 쓰레드풀의 사이즈를 증가시켜 준다. 귀찮아서 찾아보지는 않았지만 쓰레드풀 기본 사이즈가 1로 설정되어있는게 아닐까?
```
@Configuration
public class SchedulingConfigurerConfiguration implements SchedulingConfigurer {
 
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(쓰레드풀사이즈1이상으로정의);
        taskScheduler.initialize();
        taskRegistrar.setTaskScheduler(taskScheduler);
    }
}

```## 원인궁금해서 찾아봐야겠다.
![스프링부트에서 기본으로 사용하는 쓰레드풀테스크스케쥴러의 풀사이즈 기본설정이 1로 되어있었다.](/content/images/2022/08/---------------.jpg)스프링부트에서 기본으로 사용하는 쓰레드풀테스크스케쥴러의 풀사이즈 기본설정이 1로 되어있었다.끗.