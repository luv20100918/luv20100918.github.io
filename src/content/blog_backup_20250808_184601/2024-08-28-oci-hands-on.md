---
title: "오라클 클라우드 인프라스트럭처(OCI) 핸즈온(Hands-on) 후기 및 교육내용 복습"
description: "가는길  회사에서 “코엑스에서 OCI 실습교육을 한다고 들을 생각이 있냐”고 의향을 물어서 “옛설!”하고 당장 듣겠다고 했다. 당일날 어김없이 폭염, 교육이 오후 한시부터 시작이라 부랴부랴 준비해서 나갔다. 땀이 머리에서 뚝뚝하고 떨어지는데 너무 더웠지만 지하철을 타자마자 에어컨이 빵빵..."
pubDate: 2024-08-28
---

## 가는

길

회사에서 “코엑스에서 OCI 실습교육을 한다고 들을 생각이 있냐”고 의향을 물어서 “옛설!”하고 당장 듣겠다고 했다. 당일날 어김없이 폭염, 교육이 오후 한시부터 시작이라 부랴부랴 준비해서 나갔다. 땀이 머리에서 뚝뚝하고 떨어지는데 너무 더웠지만 지하철을 타자마자 에어컨이 빵빵해서 너무 좋았다. 그렇게 열탕과 냉탕을 오가면서 코엑스에 한시간 조금 넘게 이동해서 도착했다.

## 세미

나

세미나실에 입장하니 초대해주신 업체 담당자분께서 커피도 사 놓아 주시고 과자랑 음료수도 많이 있어서 시작부터 분위기가 좋았다. 오라클 담당자 분께서 출석체크를 하셔서 이름을 알려드리고 체크를 한 후, 잠깐 앉아 있으니 교육이 시작되었다. 교육은 한시간은 이론 교육, 나머지 3-4시간은 실습으로 이루어진다고 했다.

### 이

론

이론은 복잡한 내용은 없었다. 요약하면, 기존의 물리적인 인프라 환경과 크게 다르지 않고 기존 인프라에서 사용하던 기능이나 역할등을 클라우드에서도 그대로 하고 있다는 내용이었다.

사실 이론 보다 중요한 내용은 가격이 싸다는 점이었다. 쉽게 말해서 AWS나 다른 클라우드 인프라에서는 지역별로 요금이 차등되서 과금되지만 OCI는 동일하게 과금된다는 내용이었고 그게 이점이 되는 이유는 쉽게 말해서 미국이나 데이터 센터가 밀집되어있는 곳들은 가격이 저럼할수 밖에 없고 아시아쪽은 상대적으로 비쌀수 밖에 없는데 오라클은 미국에서의 저렴한 가겨을 그대로 아시아에도 적용하고 있다는 것이었다. 그 외에도 후발주자답게 선두주자에 비해 가격이 낮은 포인트들이 많았다. 네트워크 사용료에 대한 무료 구간도 훨씬 컸다.

### 실습(Hands-o

n)

먼저 실습을 주도해주시는 강사분이 남녀 한분씩이었는데, 개인적으로는 여성분의 목소리가 듣기가 편했다. 차분하니 설명을 잘했다. 하지만 사수는 남자분이었던 것 같은데, 작은 세미나라서 그런건지 자기소개 이런것도 없이 곧바로 실습에 들어갔다. 실습은 단계별로 진행했는데

그게 3부분으로 나눠서 진행했다. 첫번째로는 DBCS 를 설정하는 부분, 두번쨰는 웹애플리케이션을 직접만들어서 브라우저에서 호출까지, 마지막으로는 설정한 DBCS에 데이터를 임포트까지 해서 사용해보는 부분.

전체적인 실습은 그림으로 단계별로 어떻게 진행되었는지 보여주면서 진행해서 머리속으로 그리기가 쉬웠다. 그래서 이해에 많은 도움이 되었던 것 같다.

다만 클라우드쉘로 진행할때 직접 계정을 만들어서 오신 분들이 잘 안되는 부분이 있었다. 이건 오라클에서 업데이트한후에 신경을 못쓴 부분인것 같다고 설명은 들었다. 아무튼 아래 명령어를 정책에 추가해서 해결했다.

**클라우드 쉘 권한 안될때 아래 정책 추가**

ALLOW GROUP Administrators to manage all-resources IN TENANCY
ALLOW GROUP Administrators to use cloud-shell IN TENANCY
ALLOW GROUP Administrators to use cloud-shell-public-network IN TENANCY
참고로 정책은 아래 메뉴에 있다.

![](/content/images/2024/08/DraggedImage-14.png)

(ID &amp; 보안 안에 정책이 있다.)![](/content/images/2024/08/DraggedImage-1-1.png)

(구획을 루트로 설정해야 목록이 나오며 aaa를 임시로 추가 했다.)![](/content/images/2024/08/DraggedImage-2-1.png)

(Aaa 내용 참고)그럼 순서대로 진행했던 내용을 복기해가면서 되짚어 보겠다.

#### DBCS 만들

기

이미 계정은 준비됬다는 것을 가정하에 구획을 먼저 생성한다. 구획의 생성은 전혀 어렵지가 않다. 구획이란 것은 아까 말했던 인스턴스 등을 보기좋게 담을 수 있는 폴더 같은 개념이다. AWS에는 없는 기능으로 쉽게 예를 들면, 개발과 운영을 별도 구획(폴더)로 나눠서 관리할 수 있다.

![](/content/images/2024/08/-----------2024-08-27------2.45.34.png)

(ID &amp; 보안 메뉴의 구획을 클릭한다.)구획 메뉴에 진입한다. 그리고 `컴파트먼트 생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-3-1.png)

이름 설명을 모두 채우고 `컴파트먼트 생성`버튼을 클릭을 하면 구획이 생성된다.

![](/content/images/2024/08/DraggedImage-4-1.png)

(workshop이라는 이름으로 생성된 구획)만들어진 구획에 가상 클라우드 네트워크를 생성한다.

![](/content/images/2024/08/DraggedImage-5-1.png)

(네트워킹의 가상 클라우드 네트워크를 클릭한다)가상 클라우드 네트워크로 들어가서 먼저 방금 전에 생성한 구획을 설정한다. 그리고 `VCN 마법사 시작`을 클릭한다. VCN 생성을 직접 할 수 도 있지만 마법사로 시작해야 쉽다.

![](/content/images/2024/08/DraggedImage-6-1.png)

(화면 왼쪽 메뉴 아래에 구획설정하는 부분이 있다.)![](/content/images/2024/08/DraggedImage-7-1.png)

(VCN 마법사 시작)`인터넷 접속을 통한 VCN 생성`을 선택하고 `VCN 마법사 시작`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-8-1.png)

적당히 위 그림처럼 설정해주고 이름을 정하고 `Next`버튼을 클릭한다. 그럼 가상 클라우드 네트워크! VCN의 생성이 완료된다! 기초 공사가 끝났다.

본격적으로 DBCS를 생성을 진행할 수 있는 상태가 되었다.

![](/content/images/2024/08/DraggedImage-9-1.png)

(Oracle 기본 위치 데이터베이스 서비스 를 클릭한다)Oracle 기본 위치 데이터베이스에 접근하면 아래와 같은 화면이 보인다.

![](/content/images/2024/08/DraggedImage-10-1.png)

표 상단에 있는 `DB 시스템 생성`버튼을 클릭한다. 그러면 등록 폼으로 이동하는데 아래와 같이 생겨서 설정을 해야 DB시스템을 생성할 수 있다.

![](/content/images/2024/08/DraggedImage-11-1.png)

컴파트먼트 : 첨에 생성한 구획으로 설정DB 시스템 이름 지정 : 알아서 잘가용성 도메인 선택 : 이미 선택되어있을 것임모양 구성![](/content/images/2024/08/DraggedImage-12-1.png)

스토리지 구성![](/content/images/2024/08/DraggedImage-13.png)

DB시스템 구성 : Oracle Database 소프트웨어 에디션 -&gt; 스텐다드 에디션으로 설정SSH 키 추가 : 알아서 잘 ( 추후에 해당 키를 이용해서 ssh접속을 해야하므로 미리 만들어서 같은 것을 계속 사용하는것이 실습하는데 편할 것이다. 실제 실습에서는 강사분이 샘플키를 나눠줘서 그걸로 진행했다.)라이센스 유형선택 : 포함됨네트워크 정보 지정 : VCN만든 정보를 사용, 가상 클라우드 네트워크 , 클라이언트 서브넷은 만든걸로 설정하고 호스트이름 접두어를 wsdb로 설정, 나머지는 비워두면 됨.`Next`를 클릭한다.

![](/content/images/2024/08/DraggedImage-14-1.png)

데이터베이스 이름 : WSDBPDB 이름 : WS_PDB1비밀전호 : 알아서 잘데이터베이스 백업구성 : 자동백업사용 끄기(실습이니까)`DB 시스템 생성`버튼을 클릭한다.

---

에러가 나지 않았으면 아래 내용은 무시하고 웹어플리케이션 만들기로 가면 된다.

![](/content/images/2024/08/DraggedImage-15.png)

나는 에러가 났는데 아마 처음 하는 사람은 에러가 안날꺼 같다. 기존에 했던걸 지우고 다시 시도하니 뭔가 에러가 발생한것 같다.

다시 revcn이라는 이름으로 가상 클라우드 네트워크 생성.

![](/content/images/2024/08/DraggedImage-16.png)

![](/content/images/2024/08/DraggedImage-17.png)

![](/content/images/2024/08/DraggedImage-18.png)

다시 만들고 하니 잘 만들어졌다.

![](/content/images/2024/08/DraggedImage-19.png)

만들어 진것은 나중에 사용해 보도록 하자.

#### 웹어플리케이션 만들

기

기본 작업들은 이미 이전 작업에서 다 해놨기 떄문에 바로 인스턴스를 생성하러 간다.

목표는 인스턴스 두개를 생성하고 로드벨런서를 설정해서 두 서버가 다 호출되는지 잘동작하는지 확인하는 것.

컴퓨트의 인스턴스를 클릭한다.

![](/content/images/2024/08/DraggedImage-20.png)

`인스턴스 생성`버튼을 클릭해서 인스턴스를 생성하는 페이지로 이동한다.

인스턴스 이름은 간단히 webserver1, webserver2 라고 만들어 보자 우선 webserver1부터 만든다.

이미지 및 구성의 편집 부분을 클릭해서 모양만 좀더 좋은 가상머신으로 변경한다. 무료는 너무 느려서 테스트 하기가 힘든 부분이 있다. 무료로 해도 상관은 없다.

![](/content/images/2024/08/DraggedImage-21.png)

구성은 위 이미지를 참조 하면 될것 같다.

SSH 키도 추가한다. 이전에 DBCS생성할떄 사용한 키를 사용하는 것이 좋다. 실습하기 편하니까.

기본VNIC정보를 편집해서 서브넷을 프라이빗으로 변경한다.

![](/content/images/2024/08/DraggedImage-22.png)

설정을 끝내면 위 그림처럼 설정이 된다.

같은 방식으로 webserver2 인스턴스도 생성한다.

![](/content/images/2024/08/DraggedImage-23.png)

목록으로 가보면,

![](/content/images/2024/08/DraggedImage-24.png)

서버가 두개 생성된걸 볼 수 있다. 근데.. webserver2에 퍼블릭IP가 할당되어있다… VNIC설정을 안했나보다. 다시 설정해준다. 찾아봐도 수정하는 부분을 못찾겠다. 정지를 해본다.

![](/content/images/2024/08/DraggedImage-25.png)

설정이 안보인다. 그냥 삭제하고 다시 만들어야겠다.

![](/content/images/2024/08/DraggedImage-26.png)

(이번엔 신경써서 프라이빗 서브넷으로 변경했다)생성완료되었다. 프로비전 중.

![](/content/images/2024/08/DraggedImage-27.png)

아까 언급했는지 모르겠지만, 구성에서 E2.2를 사용했는데 실제 실습때는 E2.1을 사용했다.

![](/content/images/2024/08/DraggedImage-28.png)

제대로 구성이 완료되었다. 이제 외부에서 접근할수 없는 프라이빗 영역에 인스턴스 두개가 배치되었다. 온프레미스 기준으로 이야기 하면 내부망에 서버 두대가 배치된 것이라고 보면 된다.

일반적으로 웹서버를 DMZ영역에 두고 WAS를 내부망으로 설정하고 이런식으로 네트워크를 설계 했을 것이다. 여긴 실습이기 떄문에 와스까지 설정할 여유는 없었던 것 같고, 로드밸런서를 DMZ에 두고 내부망에 설치된 두개의 인스턴스에 웹서버를 구성한 후 연결해서 실습을 진행할 것이다. 실습이 제대로 되면 웹서버1과 2가 번갈아 호출되는 것을 확인 할 수 있다.

웹서버 설정을 위해서 지금부터 클라우드 쉘을 사용한다. 물론 직접 콘솔로 붙을 수도 있겠지만 클라우드 쉘을 활용하니 접근하기가 더 쉬웠다.

명령어는 세미나를 진행해주신 업체에서 제공해줘서 그냥 따라 치면 문제가 될 게 없었다 .

먼저 클라우드 쉘은 상단의 `개발자툴`아이콘을 클릭하면

![](/content/images/2024/08/DraggedImage-29.png)

클라우드 쉘이라는 메뉴를 확인할 수 있다. 클릭한다.

![](/content/images/2024/08/DraggedImage-30.png)

(쉘 화면 준비 중)화면 하단에 위 이미지처럼 쉘화면이 웹으로 열린다.

![](/content/images/2024/08/DraggedImage-31.png)

위 이미지처럼 출력되면 준비가 완료 된 것.

지금까지 모든 인스턴스를 프라이빗 네트워크에 생성한 것을 기억할 것이다. 먼저 쉘의 상단의 네트워크 부분을 보면 퍼블릭이라고 설정이 되어있다. 해당 부분의 아래로 향한 꺽쇠?를 클릭하면 변경이 가능하다.

![](/content/images/2024/08/DraggedImage-32.png)

`프라이빗 네트워크 정의 목록`메뉴를 클릭한다.

![](/content/images/2024/08/DraggedImage-33.png)

위 와 같은 창이 출력되는데, 원래는 목록에 아무것도 없어야 하지만 나는 이미 한번 진행을 했었어서 기존에 만들었던 정의가 생성되어있다. 일단 그 부분은 신경쓰지말고 `프라이빗 네트워크 정의 생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-34.png)

위와같이 슬라이드되서 창이 나타나는데 이름은 알아서 작성하고 VCN을 설정해야한다.

![](/content/images/2024/08/DraggedImage-35.png)

위와 같은 식으로 본인이 생성한 VCN의 프라이빗 서브넷을 선택한후,

![](/content/images/2024/08/DraggedImage-36.png)

위처럼 활성 네트워크로 사용을 체크한다.

![](/content/images/2024/08/DraggedImage-37.png)

위처럼 설정이 되면 `생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-38.png)

활성네트워크로 사용하는걸로 체크했기 떄문에 바로 네트워크가 변경된다.

![](/content/images/2024/08/DraggedImage-39.png)

접속중이라는 부분이 사라지면 완전히 접속이 이루어 진 것이다.

이제 웹서버용으로 만든 인스턴스에 아파치를 설치하는 작업을 해야한다.

그동안 DBCS나 웹서버 인스턴스를 생성할때 하나의 ssh키를 사용해서 진행을 했었다. 각 서버에 접근하려면 이제 해당 ssh키의 비밀키가 필요히다. 먼저 쉘에 업로드 하는 작업을 한다. 이 부분은 무척 간단한데, 그냥 탐색키에서 드래그 해서 쉘 부분에 놓으면 된다.

![](/content/images/2024/08/DraggedImage-40.png)

원래는 그냥 복사가 되는데, 나는 기존에 한번 올려서 덮어 씌울꺼냐고 물어본다. 처음 하는 사람들은 그냥 복사가 완료될 것이다.

![](/content/images/2024/08/DraggedImage-41.png)

(파일 전송이 완료됨으로 보인다)![](/content/images/2024/08/DraggedImage-42.png)

ls -al
명령어를 쳐 보면 id_rsa 파일을 확인할 수 있다.

키파일을 사용하려면 권한이 600이어야 한다. 아래 명령어를 이용해서 변경해준다.

![](/content/images/2024/08/DraggedImage-43.png)

(권한이 바뀐걸 확인할 수 있다.)이제 비밀키를 이용해서 해당 서버에 접속이 가능하다. 먼저 webserver1에 접속을 진행해 본다.

ssh -i id_rsa opc@10.0.1.88
위 아이피는 본인이 생성한 webserver1의 프라이빗 아이피를 대입해야 한다.

![](/content/images/2024/08/DraggedImage-44.png)

(이런식으로 서버에 접속된 걸 확인할 수 있다.)아래 명령어를 순차적으로 실행하면 되는데 webserver2에서 사용할때는 아래 명령어중에 index.html 을 만드는 명령어에서 Web-Server1부분을 Web-server2라고 되어있는 부분을 변경해서 하자. 그래야지 로드밸런서 테스트를 할때 제대로 동작하는지 구분이 쉽다.

sudo yum install httpd -y
sudo apachectl start
sudo systemctl enable httpd
sudo apachectl configtest
sudo firewall-cmd --permanent --zone=public --add-service=http 
sudo firewall-cmd --reload
sudo bash -c 'echo This is my Web-Server1 running on Oracle Cloud Infrastructure &gt;&gt; /var/www/html/index.html'
curl http://127.0.0.1/index.html
그러면 마지막에

This is my Web-Server1 running on Oracle Cloud Infrastructure

가 출력되는 것을 확인할 수 있다.

이제 로드밸런서를 생성해보도록 하자.

네트워킹으 로드밸런서 항목으로 이동한다.

![](/content/images/2024/08/DraggedImage-45.png)

(가운데 로드밸런서 가 보인다)네트워크 로드 밸런서가 아니다. 로드 밸런서다.

![](/content/images/2024/08/DraggedImage-46.png)

(갑자기 영어로 보여서 당황스럽다)구획이 내가 만든 구획인지 잘 확인하고, 목록의 상단에 있는 `Create load balancer`을 클릭한다.

등록창이 뜨는데 대부분 기본설정으로 두고 하단의 네트워킹 선택하는 부분에서 내가 만든 VCN과 퍼블릭서브넷을 선택한다.

![](/content/images/2024/08/DraggedImage-47.png)

위 이미지처럼 설정이 되었으면 `다음`을 클릭한다.

![](/content/images/2024/08/DraggedImage-48.png)

라운드로빈으로 그냥 두고 중앙에 있는 `ADD BACKENDS`를 클릭한다.

![](/content/images/2024/08/DraggedImage-49.png)

지금까지 내가 생성한 백앤드 인스턴스가 목록에 표기되는데 전부 선택하고 추가 해준다.

![](/content/images/2024/08/DraggedImage-50.png)

http로 호출할 것이기 떄문에 나머지는 그대로 두고 `다음`버튼을 클릭해준다.

![](/content/images/2024/08/DraggedImage-51.png)

HTTP로 설정한후에 `다음`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-52.png)

Error Logs가 기본적으로 활성화가 되어있는데 비활성화 시켜준다. 실습이기 떄문에 굳이 활성화 할 필요가 없다. 그리고 `제출`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-53.png)

생성되는중. 몇초 안되서 액티브 상태가 된다.

![](/content/images/2024/08/DraggedImage-54.png)

중앙쯤 보면 IP address: 152.69.233.113 (public) 라는 문구가 보이는데 이부분은 당연히 각자 다 다르다. 해당 부분을 브라우저에 복사해서 호출해본다.

어라 타임아웃이 발생한다. 뭔가 안한게 있나보다;;

일단 VCN설정을 확인해보러 간다.

처음에 설정했던 가상 클라우드 네트워크 메뉴로 이동한다.

![](/content/images/2024/08/DraggedImage-55.png)

내가 설정한 vcn이 보인다. 클릭해서 들어간다.

![](/content/images/2024/08/DraggedImage-56.png)

대외망에서 타임아웃이 발생하는 상황이니 일단 퍼블릭 서브넷을 클릭해서 들어간다.

![](/content/images/2024/08/DraggedImage-57.png)

보안목록에서 기본 설정으로 되어있는 Default Security List for revcn을 클릭한다.

![](/content/images/2024/08/DraggedImage-58.png)

TCP에 22포트만 있고 80포트가 허용된것이 보이지 않는다… 추가하자…

![](/content/images/2024/08/DraggedImage-59.png)

위처럼 설정하고 `수신 규칙 추가`버튼을 클릭해서 생성한다.

![](/content/images/2024/08/DraggedImage-60.png)

다시 브라우저로 접속을 시도 한다. 나의 경우는 [http://152.69.233.113/](http://152.69.233.113/)를 호출해 봤다.

![](/content/images/2024/08/DraggedImage-61.png)

새로고침하니,

![](/content/images/2024/08/DraggedImage-62.png)

잘된다.

마지막으로 블록 볼륨을 생성해서 webserver1에 연결해보는 것을 마지막으로 해당 부분의 실습은 마무리 한다.

![](/content/images/2024/08/DraggedImage-63.png)

메뉴에서 스토리지의 블록 볼륨을 클릭한다.

![](/content/images/2024/08/DraggedImage-64.png)

`블록 보륨 생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-65.png)

이름만 workshop-bv로 생성하고 나머지는 기본값으로 사용한다.

그리고 `블록 볼륨 생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-66.png)

블록 볼륨이 생성되면, 인스턴스에 연결을 해야 인스턴스에서 블록 볼륨을 사용할 수 있다.

위 화면에서 왼쪽 하단에 리소스 메뉴를 보면 연결된 인스턴스라는 메뉴가 보인다. 클릭해서 진입힌다. 그러면 연결된 인스턴스 목록이 나오는데 목록의 상단에 `인스턴스에 연결`이라는 버튼이 있다. 클릭한다.

![](/content/images/2024/08/DraggedImage-67.png)

위 이미지처럼 연결유형은 매개변수 가상화로 하고 엑세스 유형은 읽기/쓰기로 지정한다. 인스턴스는 아까 만든 webserver1을 선택하고 장치 경로를 클릭하면 가장위에 /dev/oracleoci/oraclevdb 가 있다. 가장 상단의 경로를 선택한다. 그리고 `연결`을 클릭한다.

![](/content/images/2024/08/DraggedImage-68.png)

그러면 목록에 인스턴스에 연결 중인 상태가 표기된다.

연결된 블록 볼륨은 인스턴스에서 디스크로 연결후에 사용이 가능하다. 아래 명령어를 통해서 Disk연결 및 포멧을 진행한다.

![](/content/images/2024/08/DraggedImage-69.png)

위 이미지처럼 상태가 연결됨이 되면 다시 클라우드 쉘을 연다. 아까 완전히 종료하지 않았으면 좌측 하단에 복원

![](/content/images/2024/08/DraggedImage-70.png)

이라는 버튼이 있을 것이다. 클릭해서 쉘을 복원한다.

webserver1에 접속이 되어있지 않다면 접속을 다시 한다. webserver2에 접속되어있다면 exit로 나가서 다시 webserver1로 접속한다.

ssh -i id_rsa opc@10.0.1.88
ls -l /dev/oracleoci/oraclevd*
sudo mkfs -t ext4 /dev/oracleoci/oraclevdb
sudo mkdir /mnt/disk1
sudo mount /dev/oracleoci/oraclevdb /mnt/disk1
df -h
위 명령어를 다 실행하면 아래 이미지 처럼 제일 하단에 disk1이 마운트된것을 확인할 수 있다.

![](/content/images/2024/08/DraggedImage-71.png)

#### DBCS에 데이터 임포트 해보

기

처음에 만든 DBCS에 데이터를 임포트하고 오라클클라이언트로 접속해서 쿼리를 날려보는 것이 마지막 실습이었다.

먼저 처음에 만들었던 DBCS에 접속을 해본다.

![](/content/images/2024/08/DraggedImage-72.png)

내가 만든 DB가 보인다. 클릭해서 상세보기로 들어가면 아래처럼 나온다.

![](/content/images/2024/08/DraggedImage-73.png)

좌측 하단에 리소스메뉴에서 노드(1)을 클릭하면,

![](/content/images/2024/08/DraggedImage-74.png)

노드에 프라이빗 IP주소가 보인다. *복사*를 눌러서 복사한다.

좌측하단에 복원을 클릭해서 다시 클라우드 쉘을 연다. 혹시 웹서버에 접속되어있는 상태라면 exit를 한다. ssh를 이용해서 DB에 접속한다.

ssh -i id_rsa opc@wsdb.sub08270811351.revcn.oraclevcn.com
디비서버에 접속이 된 상태가 되면 정상이다.

![](/content/images/2024/08/DraggedImage-75.png)

(이렇게 나오면 정상이다.)실습을 해주신 업체에서 제공해준 오라클 디비 덤프파일을 내가 만든 DBCS에 반영하기 위해서는 해당파일을 서버로 올려야 하는데 오브젝트 스토리지를 생성해서 올리는 방식을 사용하는데 지금까지 파일을 업로드 하는 방법이 하나더 있었는데 무슨 차이가 있는지는 아직도 햇갈린다. 그냥 여러가지 방법이 있는 걸 보여주는건지, 아니면 이렇게 해야만 하는건지.. 실습때는 따라가는데에 바빠서 이런 고민까지 하지 못했었다. 지금도 잘 모르는 상태라 일단 가이드 받은대로 해본다.

오브젝트 스토리지를 생성해본다.

스토리지의 버킷 메뉴로 이동한다.

![](/content/images/2024/08/DraggedImage-76.png)

![](/content/images/2024/08/DraggedImage-77.png)

`버킷생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-78.png)

이름만 정하고 `생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-79.png)

생성이 되었다. 클릭해서 상세화면으로 진입하면,

![](/content/images/2024/08/DraggedImage-80.png)

하단에 객체라는 섹션이 있고 `업로드`라는 버튼이 있다. 클릭한다.

![](/content/images/2024/08/DraggedImage-81.png)

업로드할 파일만 선택해서 업로드 한다. 위 이미지를 보면 덤프파일이 추가된걸 볼 수 있다. `업로드`버튼을 클릭해서 업로드를 완료한다. `업로드`버튼이 `닫기`버튼으로 변경되는데 클릭해서 닫는다.

![](/content/images/2024/08/DraggedImage-82.png)

위 처럼 덤프파일이 업로드 된것을 확인할 수 있다. 목록의 업로드된 객체 우측끝에 보면 점이 세개 보이는데 그것을 클릭한다.

![](/content/images/2024/08/DraggedImage-83.png)

사전인증된 요청 생성을 클릭한다.

![](/content/images/2024/08/DraggedImage-84.png)

엑세스 유형만 “객체 읽기 및 쓰기 허용”으로 변경하고 `사전 인증된 요청 생성`버튼을 클릭한다.

![](/content/images/2024/08/DraggedImage-85.png)

위와 같은 화면이 출력되는데 다시 볼 수 없는 화면이기 떄문에 “사전 인증된 요청 URL”을 복사해서 메모장 같은데에 붙여 넣는다. 메모장에 잘 붙여진 것을 확인하고 해당 창을 닫는다.

다시 클라우드 쉘로 아까 접속했던 DB서버로 접속을 해야하는데 좌측 하단의 복원버튼을 클릭해서 쉘을 연다. 나의 경우는 접속이 끊어진 상태라서 다시 접속을 시도 한다. 보통 history에 남아있기 때문에 위쪽 화살표를 클릭해서 선택한다.

![](/content/images/2024/08/DraggedImage-86.png)

먼저 다운로드 받을 폴더를 생성한다.

sudo mkdir  /mnt/dmp
sudo wget -P /mnt/dmp &lt; Pre-Authenticated  Request url &gt;
sudo chown -R oracle:oinstall /mnt/dmp
sudo ls -al /mnt/dmp
위 명령어를 다 실행하면 해당폴더가 권한이 변경된 것 까지 확인이 된다.

![](/content/images/2024/08/DraggedImage-87.png)

(wget을 할때 sudo로 안해서 몇번 에러가 났다.)덤프파일이 업로드 된것까지 확인이 되었으면, 오라클 계정으로 접속을 한다.

sudo su -
su - oracle
id
위 명령어를 실행하면 아래 처럼 출력이 된다.

![](/content/images/2024/08/DraggedImage-88.png)

PDB연결을 해야 한다. 아까 만든 데이터 베이스로 이동하면 아래와 같은 화면이 보일텐데,

![](/content/images/2024/08/DraggedImage-89.png)

이름을 클릭해서 상세로 들어가면,

![](/content/images/2024/08/DraggedImage-90.png)

좌측 하단에 플러거블 데이터베이스라는 메뉴가 보인다. 클릭한다.

![](/content/images/2024/08/DraggedImage-91.png)

위 처럼 WS_PDB1이 있는데 클릭해서 들어가면

![](/content/images/2024/08/DraggedImage-92.png)

상단에 `PDB 접속`이라는 버튼이 있다. 클릭한다.

![](/content/images/2024/08/DraggedImage-93.png)

위 와 같은 팝업창이 출력되는데, 쉬운접속의 접속 문자열을 복사해서 메모장에 붙여둔다. *복사*버튼을 클릭하면 복사가 쉽다.

다시 복원해서 클라우드 쉘을 연다.

vi $ORACLE_HOME/network/admin/tnsnames.ora
이미 내용이 있지만 그냥 두고 아래 설정을 기존 것의 아래로 추가한다.

WS_PDB1=
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = wsdb.sub08270811351.revcn.oraclevcn.com
)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = WS_PDB1.sub08270811351.revcn.oraclevcn.com )
    )
  )
SERVICE_NAME 을 아까 복사해 놓은 쉬운접속경로에서 도메인과 포트를 제외한 뒷부분을 복사해서 대체한다.

sqlplus "/as sysdba"
위 명령어를 입력하면 오라클의 SQL*Plus로 접속을 할 수 있다.

alter session set container=WS_PDB1;
create or replace directory pump as '/mnt/dmp/';
grant read ,write on directory pump to public;
![](/content/images/2024/08/DraggedImage-94.png)

잠깐 SQL*Plus밖으로 나가려면 host라는 명령어를 입력한다.

![](/content/images/2024/08/DraggedImage-95.png)

impdp 'sys/@WS_PDB1 as sysdba' DIRECTORY=pump DUMPFILE=emp_dept.dmp LOGFILE=emp_dept.log

위 명령어를 쳐야 하는데 PW부분을 첨에 설정한 비밀번호로 대체해야한다. DBCS생성할때 입력한 비밀번호를 기억해서 입력하면된다.

impdp \'sys/WElcome##2024@WS_PDB1 as sysdba\' DIRECTORY=pump DUMPFILE=emp_dept.dmp LOGFILE=emp_dept.log 
아 또 안됀다!!!

![](/content/images/2024/08/DraggedImage-96.png)

또 에러가 발생했다. tnsnames.ora파일을 다시 정비하고 다시 실행했더니 정상동작 했다.

![](/content/images/2024/08/DraggedImage-97.png)

exit하여 SQL클라이언트로 돌아가서 셀렉트하면 잘 나오는걸 확인할수 있다.

![](/content/images/2024/08/DraggedImage-98.png)

여기까지 실습했던 내용의 전부다. 다시 해보면서 시행착오가 많았지만 어쨋든 석세스.

참고로 여기까지 실습을 진행하면서 첨에 준 무료 크레딧 400불에서 약 5에서 6불 정도 소모 되었다. 아마 처음 시도 하면 2에서 3불정도 과금이 될수 있을것 같다. 그래서 실습이 종료된 후에는 생성했던 모든 객체를 다시 제거해주자.

## 마치

며

교육 자체는 강사님들이 시키는대로 따라하면 되서 편했다. 클라우드에 불편함을 가지고 있던, 같이 갔던 인프라 담당자도 재미있게 따라하면서 아주 만족해 하는 모습을 봤다. 내 기준으로는 AwS와 별반 다르지 않아서 크게 난이도가 높진 않았다. 인스턴스를 폴더 형식으로 구분할 수 있는 점은 aws에 없는 기능이라 아주 편해 보였다. 다만 아쉬운 점은 실습이 끝난 후에 생성되었던 인스턴스와 기타 객체들을 삭제하는 부분이 실습에 포함되어 있지 않아서 계속 조금씩 과금이 이루어 지고 있었다. 물론 무료 크래듯이 400불이 들어와있어서 이걸로 당분간은 버틸 수 있지만 만료기간이 있는지라 이후에 약간이라도 피해를 입을 수 있는 실습자가 있을 수 있겠다는 생각을 했다. 나는 이전에 이런 경험이 있어서 즉시 실습떄 생성된 모든 객체를 지웠다. (안지워지는 객체가 몇개 있었다.)

전반적으로, 교육은 어렵지 않고 분위기도 딱딱하지 않아서 편하게 재미있게 실습하는 데는 문제가 없었던 세미나였다. 준비해주신 음료와 과자도 맛있게 먹으면서 잘 듣고 왔다. 다음에 좀더 고급과정이 있으면 듣고 싶은 생각이 있다.