---
title: "PostgreSQL 알면 편한 쿼리"
description: "포스트그레스큐엘에서 알면 편한 쿼리, 테이블 코멘트 조회, 컬럼 코멘트 조회, 모든 테이블 삭제, 특정 유저에게 모든 테이블 권한 부여."
pubDate: 2022-06-17
updatedDate: 2023-03-31
---

PostgreSQL을 사용하면서 자주 필요한 유용한 쿼리들을 정리했습니다. 데이터베이스 관리와 운영에 도움이 되는 실용적인 명령어들입니다.

## 📋 테이블 코멘트(Comment) 조회

테이블에 설정된 코멘트를 확인할 수 있는 쿼리입니다.

```sql
SELECT PS.RELNAME    AS TABLE_NAME,
       PD.DESCRIPTION AS TABLE_COMMENT 
FROM PG_STAT_USER_TABLES PS,
     PG_DESCRIPTION      PD 
WHERE PS.RELNAME  = '테이블명'
  AND PS.RELID   = PD.OBJOID 
  AND PD.OBJSUBID  = 0;
```

### 사용법
- `'테이블명'` 부분에 조회하고자 하는 테이블 이름을 입력
- 결과로 테이블명과 해당 테이블의 코멘트가 반환됨

## 📄 컬럼 코멘트(Comment) 조회

특정 테이블의 모든 컬럼과 각 컬럼에 설정된 코멘트를 조회하는 쿼리입니다.

```sql
SELECT PS.RELNAME    AS TABLE_NAME,
       PA.ATTNAME     AS COLUMN_NAME,
       PD.DESCRIPTION AS COLUMN_COMMENT 
FROM PG_STAT_ALL_TABLES PS,
     PG_DESCRIPTION     PD,
     PG_ATTRIBUTE       PA
WHERE PS.SCHEMANAME = (SELECT SCHEMANAME 
                       FROM PG_STAT_USER_TABLES
                       WHERE RELNAME = '테이블명') 
  AND PS.RELNAME  = '테이블명'
  AND PS.RELID   = PD.OBJOID 
  AND PD.OBJSUBID <> 0
  AND PD.OBJOID    = PA.ATTRELID 
  AND PD.OBJSUBID  = PA.ATTNUM
ORDER BY PS.RELNAME, PD.OBJSUBID;
```

### 활용 예시
- 테이블 구조 파악 시 유용
- 데이터 딕셔너리 생성 시 활용
- 컬럼별 설명 확인

## 🗑️ 모든 테이블 삭제 

⚠️ **주의**: 이 쿼리는 스키마 내의 모든 테이블을 삭제합니다. 매우 위험한 작업이므로 신중하게 사용해야 합니다.

```sql
-- PostgreSQL용 (MySQL 스타일이 아닌 PostgreSQL 전용 쿼리)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

### 대안 방법 (더 안전한 접근)

특정 스키마의 모든 테이블을 확인 후 수동으로 삭제:

```sql
-- 1단계: 삭제할 테이블 목록 확인
SELECT 'DROP TABLE IF EXISTS ' || quote_ident(tablename) || ' CASCADE;'
FROM pg_tables 
WHERE schemaname = 'public';

-- 2단계: 위 결과를 복사해서 수동으로 실행
```

## 🔐 특정 유저에게 모든 테이블 권한 부여

스키마 내의 모든 테이블에 대해 특정 사용자에게 권한을 부여하는 쿼리입니다.

```sql
GRANT ALL ON ALL TABLES IN SCHEMA 'public' TO 'username';
```

### 세분화된 권한 부여

필요에 따라 특정 권한만 부여할 수도 있습니다:

```sql
-- 읽기 전용 권한
GRANT SELECT ON ALL TABLES IN SCHEMA 'public' TO 'readonly_user';

-- 읽기/쓰기 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA 'public' TO 'readwrite_user';

-- 새로 생성되는 테이블에도 자동으로 권한 부여
ALTER DEFAULT PRIVILEGES IN SCHEMA 'public' 
GRANT SELECT ON TABLES TO 'readonly_user';
```

## 💡 추가 유용한 쿼리

### 테이블 크기 조회

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 활성 연결 확인

```sql
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    query
FROM pg_stat_activity
WHERE state = 'active';
```

## ⚠️ 주의사항

1. **백업 필수**: 특히 삭제 관련 쿼리 실행 전에는 반드시 백업을 수행하세요
2. **권한 확인**: 쿼리 실행 전 현재 사용자의 권한을 확인하세요
3. **테스트 환경**: 운영 환경에서 실행하기 전에 테스트 환경에서 먼저 테스트하세요
4. **트랜잭션 활용**: 중요한 작업은 트랜잭션으로 감싸서 문제 발생 시 롤백할 수 있도록 하세요

## 📝 마무리

이러한 쿼리들은 PostgreSQL을 사용한 데이터베이스 관리 업무에서 자주 필요한 작업들입니다. 각 쿼리의 목적과 사용법을 숙지하고, 안전하게 활용하시기 바랍니다.
