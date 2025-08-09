---
title: "gunicorn.service error"
description: "gunicorn이 제대로 동작하지 않는 문제에 대한 해결 문서입니다."
pubDate: 2022-06-14
updatedDate: 2023-04-01
---

서버를 재부팅했더니 이것저것 서비스들이 자동으로 안올라와서 하나씩 올리는 도중에 gunicorn이 제대로 올라오지 않고 오류가 발생했다.
```
[root@b a]# systemctl start gunicorn.service
[root@b a]# systemctl status gunicorn.service
● gunicorn.service - Gunicorn Daemon
   Loaded: loaded (/etc/systemd/system/gunicorn.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Sat 2021-03-27 14:28:23 UTC; 3s ago
  Process: 6321 ExecStart=/home/a/project/birdspring/venv/bin/gunicorn --access-logfile access.log --error-logfile error.log --workers 2 --bind unix:/home/a/project/birdspring/run/gunicorn.sock config.wsgi:application (co>
 Main PID: 6321 (code=exited, status=200/CHDIR)

Mar 27 14:28:23 b systemd[1]: Started Gunicorn Daemon.
Mar 27 14:28:23 b systemd[1]: gunicorn.service: Main process exited, code=exited, status=200/CHDIR
Mar 27 14:28:23 b systemd[1]: gunicorn.service: Failed with result 'exit-code'.

```

처음엔 대수롭지 않게 생각했는데 자세히 로그를 살펴보니 
```
Mar 27 14:28:23 b systemd[6321]: gunicorn.service: Changing to the requested working directory failed: Permission denied
Mar 27 14:28:23 b systemd[6321]: gunicorn.service: Failed at step CHDIR spawning /home/a/project/birdspring/venv/bin/gunicorn: Permission denied

```

퍼미션엔 문제가 없었다. 왜냐면 관련 디렉토리는 전부 777로 권한설정이 되어있기 때문이다.
좀 이해가 안가서 한참동안 찾다가 해결책을 찾아서 공유한다.
[https://superuser.com/questions/1125250/systemctl-access-denied-when-root](https://superuser.com/questions/1125250/systemctl-access-denied-when-root) 
```
setenforce 0

```

위 방법으로는 서버가 내려갔다 올라오면 또 실행해줘야 하기 때문에 위 처럼 변경한후에 
```
vi /etc/sysconfig/selinux

# 아래처럼 변경한다.

SELINUX=disabled

```

아 해결되서 시원하면서도 짜증난다…
