---
title: "OpenFeign과 Spring Controller의 차이"
description: "OpenFeign과 Controller는 Spring Framework에서 서로 다른 목적과 역할을 가진 두 가지 컴포넌트입니다. 이 둘의 차이를 이해하려면, 각각의 기능과 사용 사례를 살펴보는 것이 중요합니다.   OpenFeign  OpenFeign은 선언적 웹 서비스 클라이언트로,..."
pubDate: '2024-06-05'
heroImage: 'content/images/2024/06/00020-1424509063.png'
---

OpenFeign과 Controller는 Spring Framework에서 서로 다른 목적과 역할을 가진 두 가지 컴포넌트입니다. 이 둘의 차이를 이해하려면, 각각의 기능과 사용 사례를 살펴보는 것이 중요합니다.
## OpenFeignOpenFeign은 선언적 웹 서비스 클라이언트로, 외부 HTTP API를 호출할 때 사용됩니다. 이는 주로 마이크로서비스 아키텍처에서 다른 서비스와 통신하기 위해 사용됩니다. OpenFeign을 사용하면 인터페이스를 정의하고 해당 인터페이스에 주석을 달아 HTTP 요청을 쉽게 작성할 수 있습니다.
### 주요 특징#### 선언적 접근HTTP 요청을 작성하기 위해 코드 레벨에서 직접 HTTP 클라이언트를 구성할 필요가 없습니다. 인터페이스와 주석만으로 HTTP 요청을 정의할 수 있습니다.
#### 간결성코드가 간결해지고, 서비스 간 통신이 더욱 직관적이 됩니다.
#### Spring Cloud 통합Spring Cloud와 잘 통합되어 서비스 디스커버리, 로드 밸런싱 등의 기능을 쉽게 사용할 수 있습니다.
### 예제```
@FeignClient(name = "rentcar-service")
public interface RentcarGlobalClient {
	@PostMapping("/resveInfo")
	ResponseEntity resveInfo(@RequestBody ResveInfoRequest request);
}

```## ControllerController는 Spring MVC의 일부로, 클라이언트(보통 웹 브라우저 또는 REST 클라이언트)로부터 HTTP 요청을 처리하고 적절한 응답을 반환하는 역할을 합니다. 주로 서버 측에서 클라이언트의 요청을 받아 로직을 수행하고, 결과를 반환하는 데 사용됩니다.
### 주요 특징#### 요청 처리클라이언트로부터 들어오는 HTTP 요청을 처리합니다.
비즈니스 로직 수행: 요청을 처리하는 동안 비즈니스 로직을 수행하고, 서비스 계층과 상호작용합니다.
#### 응답 반환클라이언트에게 적절한 HTTP 응답을 반환합니다.
### 예제```
@RestController
@RequestMapping("/api/rentcar")
public class RentcarController {
@Autowired
	private RentcarService rentcarService;
	
	@PostMapping("/resveInfo")
	public ResponseEntity resveInfo(@RequestBody ResveInfoRequest request) {
	    // 비즈니스 로직 수행
	    rentcarService.processReservation(request);
	    return ResponseEntity.ok().build();
	}
}

```## 차이점 요약### 역할과 목적OpenFeign: 외부 HTTP API를 호출하는 클라이언트 역할을 합니다.
Controller: 클라이언트의 요청을 처리하고 응답을 반환하는 서버 측 컴포넌트입니다.
### 사용 위치OpenFeign: 주로 마이크로서비스 간 통신에 사용됩니다.
Controller: 클라이언트(웹 브라우저 또는 REST 클라이언트)의 요청을 처리하는 데 사용됩니다.
### 구현 방식OpenFeign: 인터페이스와 주석을 사용하여 선언적으로 HTTP 요청을 정의합니다.
Controller: 클래스와 메소드를 사용하여 요청 처리 로직을 구현합니다.
### 주요 사용 사례OpenFeign: 다른 마이크로서비스의 API를 호출할 때.
Controller: 클라이언트의 요청을 처리하고 비즈니스 로직을 수행할 때.
이러한 차이점을 이해하면 Spring Framework에서 OpenFeign과 Controller를 적절히 활용할 수 있습니다.
OpenFeign과 Spring Controller는 HTTP 요청을 처리하는 방식에서 차이가 있습니다. 특히, HTTP 요청에서 데이터를 전송할 때 사용하는 방식에서 차이가 있습니다. OpenFeign을 사용할 때와 Controller를 사용할 때의 차이를 이해하기 위해 자세히 살펴 보겠습니다.
### OpenFeign에서의 데이터 전송OpenFeign을 사용하여 HTTP 요청을 보낼 때, 요청 데이터가 여러 개일 경우 @RequestBody, @RequestParam 등을 명시적으로 지정해줘야 합니다. 이는 OpenFeign이 HTTP 요청을 정확하게 구성할 수 있도록 하기 위해 필요합니다.
#### 예제 1 @RequestBody 사용@RequestBody를 사용하여 단일 객체를 전송하는 경우:
```
@FeignClient(name = "example-service")
public interface ExampleClient {
@PostMapping("/example")
ResponseEntity<String> sendData(@RequestBody ExampleRequest request);
}

public class ExampleRequest {
	private String param1;
	private String param2;
	// getters and setters
}

```#### 예제 2: @RequestParam 사용@RequestParam을 사용하여 여러 개의 쿼리 파라미터를 전송하는 경우:
```
@FeignClient(name = "example-service")
public interface ExampleClient {
	@GetMapping("/example")
	ResponseEntity<String> sendData(@RequestParam("param1") String param1, @RequestParam("param2") String param2);
}

```#### 예제 3: @RequestHeader 사용@RequestHeader를 사용하여 헤더 값을 전송하는 경우:
```
@FeignClient(name = "example-service")
public interface ExampleClient {
	@GetMapping("/example")
	ResponseEntity<String> sendData(@RequestHeader("Header-Name") String headerValue);
}

```### Spring Controller에서의 데이터 전송Spring Controller에서는 요청 데이터를 객체로 받을 때 @RequestBody를 생략할 수 있습니다. 그러나 이는 요청 데이터가 쿼리 파라미터 또는 폼 데이터로 전달되는 경우에 해당합니다. JSON 본문 데이터를 객체로 받으려면 @RequestBody를 사용해야 합니다.
#### 예제 1: 쿼리 파라미터쿼리 파라미터로 데이터를 받을 때는 @RequestParam을 사용합니다:
```
@RestController
@RequestMapping("/api")
public class ExampleController {
	@GetMapping("/example")
	public ResponseEntity<String> getData(@RequestParam String param1, @RequestParam String param2) {
	    // 처리 로직
	    return ResponseEntity.ok("Received data");
	}
}

```#### 예제 2: JSON 본문 데이터JSON 본문 데이터를 객체로 받을 때는 @RequestBody를 사용합니다:
```
@RestController
@RequestMapping("/api")
public class ExampleController {
	@PostMapping("/example")
	public ResponseEntity<String> postData(@RequestBody ExampleRequest request) {
	    // 처리 로직
	    return ResponseEntity.ok("Received data");
	}
}
public class ExampleRequest {
	private String param1;
	private String param2;
	// getters and setters
}

```#### 예제 3: 폼 데이터폼 데이터를 객체로 받을 때는 별도의 주석 없이 받을 수 있습니다:
```
@RestController
@RequestMapping("/api")
public class ExampleController {
	@PostMapping("/example")
	public ResponseEntity<String> postFormData(ExampleRequest request) {
	    // 처리 로직
	    return ResponseEntity.ok("Received data");
	}
}

public class ExampleRequest {
	private String param1;
	private String param2;
	// getters and setters
}

```### 결론#### OpenFeign데이터를 전송할 때 @RequestBody, @RequestParam, @RequestHeader 등을 명시적으로 지정해야 합니다. 이는 OpenFeign이 HTTP 요청을 정확히 구성하기 위해 필요합니다.
#### Spring Controller요청 데이터를 객체로 받을 때, JSON 본문 데이터의 경우 @RequestBody를 사용해야 하지만, 쿼리 파라미터나 폼 데이터의 경우 별도의 주석 없이 받을 수 있습니다.
따라서, OpenFeign에서는 어떤 타입의 요청 데이터를 전송할지 명시적으로 주석을 달아야 하며, Spring Controller에서는 요청 데이터의 타입에 따라 주석을 선택적으로 사용할 수 있습니다.
### TMI회사에서 OpenFeign을 쓰는데 굉장히 오랫만에 개발할일이 생겨서 다루다가 오픈페인과 컨트롤러의 미묘한 차이의 파라미터 사용법 떄문에 시행착오를 겪었습니다. 오픈소스를 사용할 때는 사용법을 많이 숙지하고 사용해야 한다는 것이 중요하다는 것을 다시 한번 상기하게 되었습니다. OpenFeign에서는 @RequestBody나 @RequestParam을 명시하지 않으면 값이 전달이 안됩니다. 이 부분을 다시 정확히 알 수 있었습니다.