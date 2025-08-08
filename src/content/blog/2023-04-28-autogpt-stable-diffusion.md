---
title: "AutoGPT 에서 Stable Diffusion 을 연동해서 사용하려면?"
description: "AUtoGPT 는 기본적으로 openai 의 dalle 를 사용하도록 구성이 되어있다.  .env 파일의 내용중에 아래 부분을 수정한다.  IMAGE_PROVIDER=sdwebui   위 처럼 수정한후 가동하면 로컬의 스테이블 디퓨전을 바라보게 되는데 기본 설정인  http://127...."
pubDate: '2023-04-28'
updatedDate: '2023-08-27'
heroImage: 'https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDE0fHxjaGF0Z3B0fGVufDB8fHx8MTY5MzExODIzN3ww&ixlib=rb-4.0.3&q=80&w=2000'
---

AUtoGPT 는 기본적으로 openai 의 dalle 를 사용하도록 구성이 되어있다.
.env 파일의 내용중에 아래 부분을 수정한다.
```
IMAGE_PROVIDER=sdwebui

```위 처럼 수정한후 가동하면 로컬의 스테이블 디퓨전을 바라보게 되는데 기본 설정인
[http://127.0.0.1:7860](http://127.0.0.1:786)
주소로 연동되게 된다. 주소를 바꾸고 싶으면 아래 설정을 더 추가해야한다.
```
SD_WEBUI_URL=http://000.000.000.000:7860

```여기까지 하면 스테이블 디퓨전에서 오류가 발생할 수 있다. 기본적으로 스테이블 디퓨전의 웹UI를 구동하면 API가 활성화되어있지 않기 때문이다.
스테이블 디퓨전의 폴더로 이동하여 ‘—api’옵션을 추가로 설정해야한다. 나는 맥이기 때문에 맥 기준으로 수정해야할 곳을 예시로 들겠다.
```
vi webui-macos-env.sh 

```위 명령어를 치면, 아래처럼 내용이 나오는데,
```
#!/bin/bash
####################################################################
#                          macOS defaults                          #
# Please modify webui-user.sh to change these instead of this file #
####################################################################

if [[ -x "$(command -v python3.10)" ]]
then
    python_cmd="python3.10"
fi

export install_dir="$HOME"
export COMMANDLINE_ARGS="--skip-torch-cuda-test --upcast-sampling --no-half-vae --use-cpu interrogate"
export TORCH_COMMAND="pip install torch==1.12.1 torchvision==0.13.1"
export K_DIFFUSION_REPO="https://github.com/brkirch/k-diffusion.git"
export K_DIFFUSION_COMMIT_HASH="51c9778f269cedb55a4d88c79c0246d35bdadb71"
export PYTORCH_ENABLE_MPS_FALLBACK=1

####################################################################

```COMMANDLINE_ARGS 에 `--api` 옵션을 추가한다.
```
export COMMANDLINE_ARGS="--skip-torch-cuda-test --upcast-sampling --no-half-vae --use-cpu interrogate --api"

```이렇게 수정하고 스테이블디퓨전웹유아이를 재가동하면 api가 동작한다.