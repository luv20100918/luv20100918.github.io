---
title: "PostgreSQL 알면 편한 쿼리"
description: "포스트그레스큐엘에서 알면 편한 쿼리, 테이블 코멘트 조회, 컬럼 코멘트 조회, 모든 테이블 삭제, 특정 유저에게 모든 테이블 권한 부여."
pubDate: 2022-06-17
updatedDate: 2023-03-31
---

### 테이블 코멘트(Comment) 조

회```

SELECT PS.RELNAME    AS TABLE_NAME
,PD.DESCRIPTION AS TABLE_COMMENT FROM PG_STAT_USER_TABLES PS
,PG_DESCRIPTION      PD WHERE PS.RELNAME  = '테이블명'
AND PS.RELID   = PD.OBJOID AND PD.OBJSUBID  = 0

```

### 컬럼 코멘트(Comment) 조회```

SELECT PS.RELNAME    AS TABLE_NAME
      ,PA.ATTNAME     AS COLUMN_NAME
,PD.DESCRIPTION AS COLUMN_COMMENT FROM PG_STAT_ALL_TABLES PS
,PG_DESCRIPTION     PD ,PG_ATTRIBUTE       PA
WHERE PS.SCHEMANAME = (SELECT SCHEMANAME FROM PG_STAT_USER_TABLES
WHERE RELNAME = '테이블명') AND PS.RELNAME  = '테이블명'
AND PS.RELID   = PD.OBJOID AND PD.OBJSUBID <> 0
AND PD.OBJOID    = PA.ATTRELID AND PD.OBJSUBID  = PA.ATTNUM
 ORDER BY PS.RELNAME, PD.OBJSUBID

```

### 모든 테이블 삭제```

SET @tables = NULL;
SELECT GROUP_CONCAT(table_schema, '.', table_name) INTO @tables
  FROM information_schema.tables
  WHERE table_schema = 'DB이름 입력'; -- specify DB name here.
SET @tables = CONCAT('DROP TABLE ', @tables); PREPARE stmt FROM @tables;
EXECUTE stmt; DEALLOCATE PREPARE stmt;

```

### 특정 유저에게 모든 테이블 권한 부여```

GRANT ALL ON ALL TABLES IN SCHEMA '스키마이름' TO '유저명';

```
