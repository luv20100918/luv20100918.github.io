---
title: "VSCode 설치"
description: "안녕하세요! 오늘은 macOS에 Visual Studio Code(VSCode)를 설치하는 방법을 알아보겠습니다. VSCode는 Microsoft에서 제공하는 무료 소스 코드 편집기로, 다양한 프로그래밍 언어와 툴을 지원합니다.  ---   VSCode 설치 과정   1. VSCode..."
pubDate: 2024-07-05
---

안녕하세요! 오늘은 macOS에 Visual Studio Code(VSCode)를 설치하는 방법을 알아보겠습니다. VSCode는 Microsoft에서 제공하는 무료 소스 코드 편집기로, 다양한 프로그래밍 언어와 툴을 지원합니다.

---

## VSCode 설치 과정

**VSCode 다운로드**:먼저, VSCode 공식 웹사이트로 이동하여 설치 파일을 다운로드합니다.Visual Studio Code 다운로드(https://code.visualstudio.com/Download)**설치 파일 실행**:다운로드한 `.zip` 파일을 더블 클릭하여 압축을 해제합니다.압축이 해제되면 `Visual Studio Code.app` 파일을 Applications 폴더로 드래그 앤 드롭하여 이동시킵니다.**VSCode 실행**:Applications 폴더에서 `Visual Studio Code` 아이콘을 더블 클릭하여 실행합니다.처음 실행할 때 "Internet에서 다운로드한 앱입니다."라는 메시지가 나타나면, "열기"를 클릭합니다.---

## 커맨드 라인에서 VSCode 실행

VSCode를 커맨드 라인에서 쉽게 실행할 수 있도록 설정할 수 있습니다.

**VSCode에서 명령 팔레트 열기**:VSCode가 열려 있는 상태에서 `Cmd + Shift + P`를 눌러 명령 팔레트를 엽니다.**Shell Command 설치**:명령 팔레트에 `Shell Command: Install 'code' command in PATH`를 입력하고 Enter를 누릅니다.이 명령어를 실행하면, 터미널에서 `code` 명령어를 사용하여 VSCode를 실행할 수 있습니다.---

## 설치 확인

터미널을 열고 다음 명령어를 입력하여 VSCode가 정상적으로 설치되었는지 확인합니다.

code --version
이 명령어를 실행하면 VSCode 버전이 출력됩니다. 이제 터미널에서 `code` 명령어를 사용하여 VSCode를 열 수 있습니다.

---

## VSCode를 이용한 첫 번째 프로젝트 열기

**새 폴더 만들기**:터미널에서 프로젝트를 위한 새 폴더를 만듭니다.mkdir my-project
   cd my-project
**VSCode로 폴더 열기**:터미널에서 다음 명령어를 입력하여 현재 폴더를 VSCode에서 엽니다.code .
이제 프로젝트 폴더가 VSCode에서 열리며, 다양한 파일을 생성하고 코딩을 시작할 수 있습니다.

---

오늘은 이렇게 macOS에 Visual Studio Code를 설치하는 방법을 알아보았습니다. 간단한 설치 과정으로 강력한 코드 편집기를 사용할 수 있으니, 꼭 한번 설치해 보세요!
