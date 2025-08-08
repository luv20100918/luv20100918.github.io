---
title: "express 에서 stream 으로 결과를 주는 예제"
description: "익스프레스에서 스트림을 사용하여 결과를 반환하는 예제입니다."
pubDate: 2023-04-19
updatedDate: 2023-08-27
---

익스프레스에서 스트림을 사용하여 결과를 반환하는 예제
```javascript
const express = require('express');
const fs = require('fs');

const app = express();

app.get('/file', (req, res) => {
  const stream = fs.createReadStream('example.txt');
  res.setHeader('Content-Type', 'text/plain');
  stream.pipe(res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

```위 예제에서는 Express의 createReadStream 함수를 사용하여 example.txt 파일에서 데이터를 읽어들인 다음, pipe 메소드를 사용하여 응답 객체(res)에 스트림 데이터를 전달하고 있다. 이를 통해, 파일의 크기와 관계 없이 스트리밍 방식으로 데이터를 전송할 수 있다.
이제, 클라이언트에서 /file 엔드포인트를 호출하면, 서버는 example.txt 파일에서 데이터를 스트리밍하며, 이를 클라이언트에게 전송한다