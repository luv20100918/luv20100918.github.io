---
title: "Forticlient 에서 가상IP를 못 받을 때"
description: "문제해결 문서입니다. 포트클라이언트에서 가상 아이피를 못받을 때, 오픈소스인 openfortivpn 의 설치와 사용방법."
pubDate: 2022-06-16
updatedDate: 2023-03-31
---

실리콘 맥은 그냥 아이패드용 Forticlientvpn 앱을 다운로드 받아서 하면 문제없이 동작한다. 하지만 인텔맥(내것만 그럴수도 있는데)은 Fortclient 7.0.5 버전으로 설치를 했는데 가상아이피를 못가져오는 경우가 생겼다. SSL인증(혹은 인증서)에서 문제가 생긴걸로 보인다.
인증관련 오류를 무시한다는 옵션을 체크해도 뭔가 잘 적용이 되지 않았다.
그래서 openfortivpn 이라는 프로그램을 찾았다. (어디서 찾았는지는 나중에 생각나면 따로 참조하겠다.)

### 내환경2019 맥북 15인치 CTO (CPU 인텔꺼)

### 처리방법맥에서는 아래와 같이 설치를 진행한다.

brew로 진행한다.
brew가 없다면 다음사이트를 참조해서 설치를 진행하면 된다.
[https://brew.sh/index_ko](https://brew.sh/index_ko)
```
brew install openfortivpn

```만약 설치가 진행안되고 멈춰있다면,
```
Brew update 

```를 실행하고 다시 설치한다.
설치가 완료되면,
(아래 아이피나 인증키등의 정보는 실제와 다른 정보입니다.)
```
> sudo openfortivpn 000.000.000.000:00000 --username=jjang
Password:
VPN account password: 
ERROR:  Gateway certificate validation failed, and the certificate digest is not in the local whitelist. If you trust it, rerun with:
ERROR:      --trusted-cert 5f1bd52e2fb4d857001d034e51c2a40fe805cf65349821859e0f0e2bbfbca15a
ERROR:  or add this line to your configuration file:
...
INFO:   Could not log out.

```위처럼 출력되고 저 부분이 vpn앱에서 잘 처리못해줬던 부분일 것 같은데 확실하진 않으니 추측으로 넘어간다.
```
sudo openfortivpn 000.000.000.000:00000 --username=jjang --trusted-cert 5f1bd52e2fb4d857001d034e51c2a40fe805cf65349821859e0f0e2bbfbca15a

```인증서를 신뢰한다는 옵션을 추가로 지정하고 실행하면,
```
> sudo openfortivpn 000.000.000.000:00000 --username=jjang --trusted-cert 5f1bd52e2fb4d857001d034e51c2a40fe805cf65349821859e0f0e2bbfbca15a
Password:
VPN account password: 
INFO:   Connected to gateway.
INFO:   Authenticated.
INFO:   Remote gateway has allocated a VPN.
WARN:   No gateway address, using interface for routing
Thu Jun 16 09:00:34 2022 : publish_entry SCDSet() failed: Success!
Thu Jun 16 09:00:34 2022 : publish_entry SCDSet() failed: Success!
Thu Jun 16 09:00:34 2022 : Using interface ppp0
Thu Jun 16 09:00:34 2022 : Connect: ppp0 <--> /dev/ttys001
...
INFO:   Adding VPN nameservers...
INFO:   Tunnel is up and running.

```이제 정상적으로 동작하는 것을 확인할 수 있다.