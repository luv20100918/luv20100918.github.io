---
title: "Model has no value for key ‘aaa’ 라고 출력됐다"
description: "Model has no value for key 라는 오류 메시지를 처음 보고 관련된 부분들을 찾아보았습니다."
pubDate: 2022-07-30
updatedDate: 2023-03-31
---

제목 그대로 오류가 발생했다. aaa는 임의로 설정한 키값이다.
일반적으로 스프링 @Controller에서 리다이렉트가 필요할 때, 아래와 같이 많이 쓴다.
```javascript
public String myRedirect(Model model, HttpServletRequest req) {
   ...
	return "redirect:/api/path?" + req.getQueryString();
}

```return에 redirect: 라고 문자열이 시작되면 그 다음에 오는 url로 리다이렉트가 된다. 이것은 스프링 공식문서에 보면 가이드가 되어있다.
차치하고, 저 리턴 부분에서 오류가 발생을 했다.

## 분석먼저 리턴되는 문자열이 무엇인지 확인해봤다.

“redirect:/api/path?” + req.getQueryString()
=> “redirect:/api/path?query={aaa}
알고보니, 중괄호로 감싼 aaa를 모델에 키가 없다고 에러메시지를 주는거였다.
그렇다면 aaa를 키로 인식하는 이유가 있을 것이다.
RedirectView 내부를 살펴보면 아래와 같은 코드가 있다.
```css
	protected StringBuilder replaceUriTemplateVariables(
			String targetUrl, Map<String, Object> model, Map<String, String> currentUriVariables, String encodingScheme)
			throws UnsupportedEncodingException {

		StringBuilder result = new StringBuilder();
		Matcher matcher = URI_TEMPLATE_VARIABLE_PATTERN.matcher(targetUrl);
		int endLastMatch = 0;
		while (matcher.find()) {
			String name = matcher.group(1);
			Object value = (model.containsKey(name) ? model.remove(name) : currentUriVariables.get(name));
			if (value == null) {
				throw new IllegalArgumentException("Model has no value for key '" + name + "'");
			}
			result.append(targetUrl, endLastMatch, matcher.start());
			result.append(UriUtils.encodePathSegment(value.toString(), encodingScheme));
			endLastMatch = matcher.end();
		}
		result.append(targetUrl.substring(endLastMatch));
		return result;
	}

```어떤 패턴과 일치하면 키로 인식해서 처리해주는 로직으로 보인다.
URI_TEMPLATE_VARIABLE_PATTERN 가 패턴인데 아래와 같다.
```
private static final Pattern URI_TEMPLATE_VARIABLE_PATTERN = Pattern.compile("\\{([^/]+?)\\}");

```정규식 패턴인데 {([^/]+?)} 가 뭐하는 녀석일까?
[https://regex101.com](https://regex101.com)
정규식 테스트 사이트로 이동해서 입력해본다.
![java8로 설정하고 패턴부분을 붙여서 넣었다.](/content/images/2022/07/-----------2022-07-30------12.12.09.png)java8로 설정하고 패턴부분을 붙여서 넣었다.대충 살펴보면 중괄호가 있고 안에 그룹으로 / 가 아닌것들로 1개이상문자열과 매칭되는것 같다.
매칭되는 것들을 키로 인식하고 키에대한 벨류가 설정이 되어야 오류가 없을 것으로 보인다.

## 해결키로 사용되는게 의도한 것이었다면, RedirectAttributes 를 인자로 받아서 addAttribute(“aaa”, 값); 을 설정해주면 오류가 해결되지만, 여기서는 단지 query 라는 키에 {aaa}라는 값을 가진 파라미터를 가진 URL로 리다이렉트를 하고 싶은거였다.

조금 더 상황설명을 상세하게 하면 리다이렉트를 하는 부분이 AOP로 처리된 부분이었는데 어떤 특정 조건에서 전달받은 모든 파라미터를 유지한 채 다른 URL로 리다이렉트를 하는 로직이다. 문제는 여기서 설정한 포인트컷에 해당되는 메소드 모두에 RedirectAttributes 를 추가 설정하는 것은 무리였다. 그래서 선택한 해결책은 아래와 같다.(Alan solved it.)
```javascript
HttpServletResponse response= ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getResponse();

response.sendRedirect("/api/path?" + req.getQueryString(););

```그러면 그냥 닥치고 리다이렉트를 수행한다.
끗

## 참고[https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-redirecting-redirect-prefix](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-redirecting-redirect-prefix)

[https://stackoverflow.com/questions/33417802/adding-redirectattributes-parameter-causes-model-has-no-value-for-key-exceptio](https://stackoverflow.com/questions/33417802/adding-redirectattributes-parameter-causes-model-has-no-value-for-key-exceptio)