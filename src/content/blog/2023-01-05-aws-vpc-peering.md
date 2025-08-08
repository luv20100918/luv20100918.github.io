---
title: "AWS-VPC Peering"
description: "따라하며 배우는 AWS 네트워크 입문을 보면서 정말 대강 따라하면서 배우는 중이다."
pubDate: 2023-01-05
updatedDate: 2023-08-27
---

## 소

개

다른 두 VPC간 연결을 구성, private ip 주소를 통해 통신할 수 있는 기능.

## 기

능

고속 네트워크, 트래픽 암호화 및 비용 절감리전 간 VPC 피어링 지원타 계정 간 VPC 피어링 지원## 제약 조건

서로 다른 VPC CIDR 사용 필요Transit Routing 미지원??? (지금 미지원이 맞는지 모르겠다. 미지원 한다는 내용을 어디서도 찾을 수가 없다. 공식 가이드를 보면 되는 것 같은데 지원을 안한다는 내용은 없다. 네트워크 전문가가 아니라서.. 이만)[https://docs.aws.amazon.com/ko_kr/vpc/latest/peering/what-is-vpc-peering.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/peering/what-is-vpc-peering.html)VPC 피어링 최대 연결 제한 - 기본한도 50개, AWS요청시 최대 125개
