## 수집기 간단한 요구사항

1. 프로그래밍 언어 무관, 자신있는 언어로 작성.
2. 데이터 수집 작업을 실행하는 배치프로그램 작성.
3. 각 수집기에서 필요한 환경변수는 /collectors/**/.env에 작성.
4. collectors의 하위폴더는 방송플랫폼+데이터 수집 단위.  
    ex. afreecatv 채팅과 방송데이터를 따로 수집해야 한다면, 따로 폴더 만들어 작성. 동시에 수집이 가능하다면 하나의 폴더에 함께 작성  
5. API 호출 / 크롤링 / 스크래핑 / 제공되는 채팅서버에 socket 연결 등 각 플랫폼(youtube, afreeca, twitch, etc)에 맞는 방식으로.
6. 각 언어에 맞는 linting 시스템 적극 활용 권고 (ex. nodejs -> eslint, python -> pylint)
7. (가능하다면.. test 코드 작성.)
8. 해당 프로그래밍 언어 런타임으로 동작할 수 있도록 Dockerfile 작성.
9. docker run 스크립트 작성.

## 파일 구조

더욱 세분화하여 나눌 수 있음. 하지만, 유의해야 할 점은 collectors의 하위 폴더 하나하나는 하나의 컨테이너로 작동되어야 함.  
따라서, 하나의 기능을 수행하는 컨테이너일 수록 좋음. (기존 와일트루 개발자가 판단하에 진행)

- /afreecatv : 아프리카tv 데이터 수집
- /twitchtv : 트위치tv 데이터 수집
- /youtube : youtube 영상에 대한 데이터 수집
- /youtube-live : youtube live영상에 대한 데이터 수집
