---
title: "Visual Studio 단축키 모음"
description: "항상 잊어버리는 비쥬얼 스튜디오 단축키 모음."
pubDate: '2022-06-19'
updatedDate: '2023-03-31'
---

F9 현재 라인에 Breakpoint를 지정/해제
Ctrl + Shift + F9 현재 Edit하고 있는 소스파일에 지정된 모든 Breakpoint 해제
Ctrl + ] ''괄호의 짝을 찾아줌 ('{'에 커서를 놓고 눌러야 함
Ctrl + J, K #ifdef 와 #endif의 짝을 찾아줌
Ctrl + L 한 라인을 클립보드로 잘라내기 (Cut)
Ctrl + Shift + L 한 라인을 삭제
Alt + Mouse 블록 설정 세로로 블록 설정하기 (마우스로)
Ctrl + Shift + F8 세로로 블록 설정하기 (키보드로), 취소할 때는 Esc키를 눌러야 함
블록 설정 -> Tab 선택된 블록의 문자열을 일괄적으로 들여쓰기(Tab) 적용
블록 설정 -> Shift + Tab 선택된 블록의 문자열을 일괄적으로 내어쓰기 적용
Alt + F8 인덴트 정리. 범위 선택 후 사용하면 해당 범위를 표준 인덴트로 바꾸어줌.
Shift + F9 디버그 모드에서 해당 변수를 바로 Watch Window에 등록.
Ctrl + U 선택된 영역을 소문자로 바꿈
Ctrl + Shift + U 선택된 영역을 대문자로 바꿈
Ctrl + Shift + 8 문단기호 표시/감추기 : Tab은 ^, Space는 .으로 표시
Ctrl + D 툴바의 찾기 Editbox로 이동
Ctrl + Up/Down Arrow 커서는 고정시키고 화면만 스크롤 시키기
Shift + Alt + 커서 이동
Alt + 마우스 드래그 세로로 영역 선택
Shift + F12 선언으로 이동
=== 찾 기 ===
Ctrl +F3 현재커서의 단어 찾기
Ctrl +D 툴바의 찾기 Editbox로 이동
Ctrl + I 문자열 입력 점진적으로 문자열 찾기 (Incremental Search)
Ctrl + Shift + F3 현재 커서에 있는 문자열 찾기 backward
SHIFT + ALT + O 프로젝트에 있는 파일 찾기 ( 비주얼 어시스트)
Alt + M 파일에서 method의 리스트를 보여준다.
Ctrl + ] ''괄호, #ifdef, #endif 의 짝을 찾아줌
F3 찾은 문자열에 대한 다음 문자열로 이동 (Next Search)
Ctrl + H 문자열 찾아 바꾸기 (Replace)
=== 이동 관련 ===
CTRL + PGDOWN (or END) 문서 끝
CTRL + PGUP (or HOME) 문서 처음
F12 선언부로 가기
Ctrl + F2 현재 라인에 북마크 지정/해제
F2 지정된 다음 북마크로 이동
Ctrl + Shift + F2 지정된 모든 북마크를 해제
함수간 이동
=== 주석처리 ===
Ctrl+K, Ctrl+C 선택 영역 주석 처리 (.NET 2003, 2005)
Ctrl+K, Ctrl+U 선택 영역 주석 없앰 (.NET 2003, 2005)
=== 아웃라인 ===
Ctrl+M, Ctrl+L 모든 아웃라인 보이기/숨기기 (Edit.ToggleAllOutlining)
Ctrl+M, Ctrl+M 현재 아웃라인 보이기/숨기기 (Edit.ToggleOutliningExpansion)
Ctrl+M, Ctrl+H 선택영역 아웃라인 지정(Edit.HideSelection)
Ctrl+M, Ctrl+U 현재 아웃라인 삭제 (Edit.StopHidingCurre
Ctrl+M, Ctrl+P 모든 아웃라인 삭제(Edit.StopOutlining Text Editor)
=== 기 타 ===
ALT + F7 프로젝트 속성
Shift+Alt+Enter : 전체화면 토글
Ctrl + Shift + F9 현재 Edit하고 있는 소스파일에 지정된 모든 Breakpoint 해제
디버그 모드에서 Watch Window에서 추가하고픈 변수나 등등 앞에 커서를 위치 시킨후 Shift + F9
☆☆ Studio 단축키 ☆☆
♣ 일반 단축키
- 모두 저장 : Ctrl + Shift + S
- 문서창 닫기 : Ctrl + F4
- 다음 문서 : Ctrl + F6, 이전 문서 : Ctrl + Shift + F6
- 다음 도구 : Alt + F6
- 들여 쓰기 : Teb, 내어 쓰기 : Shift + Teb
- 주석 달기 : Ctrl + E + C, 주석 해제 : Ctrl + E + U
- 파일에서 찾기 : Ctrl + Shift + F, 중단 : Alt + F3, S
- 찾기 이전으로 : Ctrl + F3, 다음으로 : Shift + F3
- 증분검색 정방향 : Ctrl + I, 역방향 : Ctrl + Shift + I
- 문서 끝 : Ctrl + End, 시작 : Ctrl + Home, 행 이동 : Ctrl + G
- 자동 줄바꿈 : Ctrl + E, W
- 공백 보기 : Ctrl + E, S, 가로 공백 삭제 : Ctrl + E, \
- region 펼치기 & 접기 : Ctrl + M, M
- 캡슐화 하기 : Ctrl + K + S
- 클립보드에 복사 : Ctrl + Shift + Num
- 클립보드링 순환 : Ctrl + Shift + Insert
♣ 디버그시 단축키
- 직접실행창 표시 : Ctrl + Alt + I
- 모든 중단점 지우기 : Ctrl + Shift + F9
- 중단점 추가 : Alt + F9
- 중단점 설정/해지 : F9
- 프로그램에서 사용하는 모든 모듈 보기 : Ctrl + Alt + U
- 간략한 조사식 : Ctrl + Alt + Q, Shift + F9
- 디버그 다시 시작 : Ctrl + Shift + F5
- 디버그 커서까지 실행 : Ctrl + F10
- 프로시져 단위 디버그 : F10
- 한단계씩 디버그 : F11
- 프로시져 나가기 : Shift + F11
- 디버깅 중지 : Shift + F5
- 디버그 커서까지 실행 : Ctrl + F10
- 디스어셈 플리 설정/해제 : Ctrl + F11
- 디버그 조사식 1,2,3,4 : Ctrl + Alt + W, 1, 2, 3, 4
- 디버그 하지 않고 시작 : Ctrl + F5
♣ DataBase 단축키
- 데이터베이스 선택영역 실행 : Ctrl + R, Ctrl + D
- 데이터 베이스 한 단계씩 실행 : Ctrl + D, Ctrl + S
- SQL 선택영역 실행 : Ctrl + R
♣ 도구창
- 책갈피 창 : Ctrl + W, B
- 책갈피 지정 : Ctrl + B, T
- 책갈피 이전 : Ctrl + B, P -- 다음 : Ctrl + B, N
- 모든 책갈피 지우기 : Ctrl + B, C
- 메크로 창 : Alt + F8
- 메크로 기록 : Shift + Ctrl + R
- 현재메크로 실행 : Shift + Ctrl +