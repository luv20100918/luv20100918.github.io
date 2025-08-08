---
title: "Document Formatter"
description: "정확히는 XML과 JSON을 간단히 보기좋게 만들어주는 프로그램이 필요했다. 매번 외국사이트를 뒤지는 것도 귀찮고, 회사에서 사용하는 데이터들을 외국사이트에 올려서 보기좋게 만드는 것도 불안했다. 물론 IDE에 플러그인을 깔아서 보거나, 기본적으로 지원하는 에디터나 IDE도 있겠지만 그..."
pubDate: 2024-06-06
---

정확히는 XML과 JSON을 간단히 보기좋게 만들어주는 프로그램이 필요했다. 매번 외국사이트를 뒤지는 것도 귀찮고, 회사에서 사용하는 데이터들을 외국사이트에 올려서 보기좋게 만드는 것도 불안했다. 물론 IDE에 플러그인을 깔아서 보거나, 기본적으로 지원하는 에디터나 IDE도 있겠지만 그냥 웹이 제일 편하다. 그래서 나 편하자고 만들었다.

## 메인[https://formatters.birdspring.com/](https://formatters.birdspring.com/)

디자인은 잼병이라… 그냥 리액트에 기본 내장된 Tailwindcss를 사용해서 대충 만들었는데 정말 그냥 대충나왔다.
XML을 클릭하면 XML 포멧을 이쁘게 만들어주는 페이지로,
JSON을 클릭하면 JSON을 예쁘게 만들어주는 곳으로 이동한다.

## XML을 예쁘게왼쪽에 xml을 넣는다.

```
<library><book id="1"><title>Introduction to Algorithms</title><author>Thomas H.
Cormen</author><publisher>MIT Press</publisher><year>2009</year></book><book id="2"><title>Clean Code</title><author>Robert C.

```이렇게 예쁘게 고쳐준다.
```
<library>
  <book id="1">
    <title>Introduction to Algorithms</title>
    <author>Thomas H. Cormen</author>
    <publisher>MIT Press</publisher>
    <year>2009</year>
  </book>
  <book id="2">
    <title>Clean Code</title>
    <author>Robert C. Martin</author>
    <publisher>Prentice Hall</publisher>
    <year>2008</year>
  </book>
  <book id="3">
    <title>The Pragmatic Programmer</title>
    <author>Andrew Hunt</author>
    <author>David Thomas</author>
    <publisher>Addison-Wesley</publisher>
    <year>1999</year>
  </book>
  <book id="4">
    <title>Design Patterns</title>
    <author>Erich Gamma</author>
    <author>Richard Helm</author>
    <author>Ralph Johnson</author>
    <author>John Vlissides</author>
    <publisher>Addison-Wesley</publisher>
    <year>1994</year>
  </book>
</library>

```## JSON을 예쁘게```
{"timestamp":"2024-06-05T15:51:54.946","result":200,"msg":"OK","data":{"orderNo":"1","vendorOrderNo":"2","apiOrderNo":"3"}}

```위 문서가 그냥 일렬로 나열되어있다. 복사해서 넣어본다.
우측상단의 COPY버튼을 클릭해서 복사해서 붙여보면 아래와 같이 아름다운 문자열을 볼 수 있다.
```
{
  "timestamp": "2024-06-05T15:51:54.946",
  "result": 200,
  "msg": "OK",
  "data": {
    "orderNo": "1",
    "vendorOrderNo": "2",
    "apiOrderNo": "3"
  }
}

```## 광고는 그냥 기대 안하고 달아놨음근데 광고에도 광고달았다고 나온다…