---
title: "No module named 'PIL' 오류 해결 방법"
description: "오늘은 파이썬 프로그래밍을 하면서 흔히 만날 수 있는 오류에 대해 이야기해볼까 한다. 예를 들어, \"No module named 'PIL'\"라는 오류를 만났다면, 아마 이미지 처리 라이브러리인 Pillow를 설치하지 않아서 그런 걸 수도 있다.   Pillow는 Python Imagin..."
pubDate: 2024-07-08
---

오늘은 파이썬 프로그래밍을 하면서 흔히 만날 수 있는 오류에 대해 이야기해볼까 한다. 예를 들어, "No module named 'PIL'"라는 오류를 만났다면, 아마 이미지 처리 라이브러리인 Pillow를 설치하지 않아서 그런 걸 수도 있다.

Pillow는 Python Imaging Library(PIL)의 업그레이드된 버전으로, PIL이 더 이상 유지보수되지 않기 때문에 Pillow를 사용하는 것이 좋다.

이 오류를 해결하는 방법은 간단하다. 먼저, Pillow를 설치해야 한다. 이를 위해 터미널이나 커맨드 라인에서 다음 명령어를 입력하면 된다.

```
pip install pillow

```

설치가 완료되면, 이제 Pillow를 임포트해서 사용할 수 있다. 예를 들어 이미지를 열고, 그 이미지를 다른 형식으로 저장하고 싶다면 다음과 같은 코드로 할 수 있다.

```javascript
from PIL import Image

# 이미지 열기

image = Image.open('example.jpg')

# 다른 형식으로 저장하기

image.save('example.png')

```

이제 오류가 발생하지 않고 정상적으로 작동할 것이다. 이런 식으로 간단한 명령어와 코드를 사용해 문제를 해결할 수 있다. 프로그래밍을 하다 보면 이런 사소한 오류가 자주 발생하는데, 이를 잘 해결하는 것이 중요하다.

오늘도 즐거운 프로그래밍 되길 바란다!