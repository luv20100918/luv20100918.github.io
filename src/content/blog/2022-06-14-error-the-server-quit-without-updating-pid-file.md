---
title: "ERROR! The server quit without updating PID file"
description: "문제해결문서로 mysql의 설치 삭제 반복으로 인한 제대로 삭제되지 않은 폴더로 인해 발생하는 오류를 해결한다."
pubDate: 2022-06-14
updatedDate: 2023-03-31
---

## 증상맥에서 mySql( 5.7 ) 설치 에

러

```
brew install mysql@5.7

```

설치 완료.
mysql.server start 시
```
Starting MySQL
. ERROR! The server quit without updating PID file (/usr/local/var/mysql/~~~~~~~).

```

위처럼 오류 발생함.

## 원인mysql 를 여러번 설치/삭제하면서 잔재 폴더가 존재해서 설치시 에러가 발생하던 부분을 간

과

해당에러
```
[ERROR] --initialize specified but the data directory has files in it. Aborting.
[ERROR] Aborting

```

## 해결/usr/local/Cellar/mysql@5.7/5.7.29/bin/mysqld

- -initialize-insecure
- -user=zhuyeel
- -basedir=/usr/local/Cellar/mysql@5.7/5.7.29
- -datadir=/usr/local/var/mysql
- -tmpdir=/tmp

```

에러 내용 중 --datadir=/usr/local/var/mysql 부분에 해당하는 폴더 삭제 ( rm -rf )
mysql 재설치 후 정상 구동 확인