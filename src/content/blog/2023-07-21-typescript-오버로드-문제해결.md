---
title: "Typescript 오버로드 문제해결"
description: "타입스크립트로 코드를 만들다가 문제가 발생했다.  const serviceCodes = computed(() => {   if(!props.rentcar) return [];   if(!props.rentcar.srvcCodes) return [];   const result = pro..."
pubDate: 2023-07-21
updatedDate: 2023-08-25
---

타입스크립트로 코드를 만들다가 문제가 발생했다.
```javascript
const serviceCodes = computed(() => {
  if(!props.rentcar) return [];
  if(!props.rentcar.srvcCodes) return [];
  const result = props.rentcar.srvcCodes.reduce((acc, currentValue) => {
    const values = currentValue.split(',').filter(Boolean); // 콤마로 분리하고 빈 문자열 제거
    return acc.concat(values); // 결과 배열에 값 추가
  }, []);

  return result;
})

```

위 코드에서
```
return acc.concat(values); 

```

부분의 values 에서 에러가 발생했다.
에러내용은 아래와 같다.
> 오버로드 1/2('(...items: ConcatArray<never>): never')에서 다음 오류가 발생했습니다. 오버로드 2/2('(...items: ConcatArray<never>): never')에서 다음 오류가 발생했습니다.ts(2769)결론은 애매한 타입 추론으로 인해 발생한 에러로 acc에 대한 타입만 명확하게 지정해주면된다.
수정된 코드는 아래와 같다.
```javascript
const serviceCodes = computed(() => {
  if (!props.rentcar) return [];
  if (!props.rentcar.srvcCodes) return [];

  const result = props.rentcar.srvcCodes.reduce((acc: string[], currentValue) => {
    const values = currentValue.split(',').filter(Boolean);
    return acc.concat(values);
  }, []);

  return result;
});

```

acc에 명확한 string[] 타입을 지정했다.