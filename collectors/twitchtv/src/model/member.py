from sqlalchemy import Column, String, Integer, BigInteger, TIMESTAMP, Text, Float, Boolean
from sqlalchemy.sql.expression import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class TwitchStreams(Base):
    __tablename__ = 'TwitchStreams'
    __table_args__ = {
        'comment': '''
        트위치 방송 정보
        streamId: 해당 방송의 고유 아이디 (= twitch api의 streamId)
        title: 방송 시작시 제목
        streamerId: 해당 방송의 방송인 고유 아이디 (= twitch api의 streamerId)
        streamerName: 해당 방송의 방송인의 닉네임
        startedAt: 해당 방송 시작 시간
        endedAt: 해당 방송의 종료 시간 - 방송 종료시 update
        collected: TruepointDB의 streams에 적재되었는 지 여부 (1 = 적재 필요, 0 = 필요없음) - 방송 종료시 1로 update
        analyzed: TruepointDB의 streamSummary에 적재되었는 지 여부 (1 = 적재 필요, 0 = 필요없음) - 방송 종료시 1로 update
        subscribeCount: 방송 종료시의 해당 streamer의  구독자 수
        followerCount: 방송 종료시의 해당 streamer의 팔로워 수
        createdAt: 해당 DB 행 생성 시간
        '''
    }
    streamId = Column(String(50), primary_key=True)
    title = Column(String(150), unique=False)
    streamerId = Column(String(50), unique=False)
    streamerName = Column(String(50), unique=False)
    startedAt = Column(TIMESTAMP)
    endedAt = Column(TIMESTAMP, nullable=True)
    collected = Column(Boolean, default=0)
    analyzed = Column(Boolean, default=0)
    subscribeCount = Column(Integer)
    followerCount = Column(Integer)
    createdAt = Column(TIMESTAMP, nullable=False,
                       default=func.now())

    def __init__(
        self,
        streamId, title, streamerId, streamerName,
        startedAt, endedAt,
        subscribeCount, followerCount
    ):
        self.streamId = streamId
        self.title = title
        self.streamerId = streamerId
        self.streamerName = streamerName
        self.startedAt = startedAt
        self.endedAt = endedAt
        self.subscribeCount = subscribeCount
        self.followerCount = followerCount


class TwitchStreamDetails(Base):
    __tablename__ = 'TwitchStreamDetails'
    __table_args__ = {
        'comment': '''
        트위치 방송 세부 정보 (수집 단위(시간. 3분)에 의해 수집됨)
        streamId: 방송의 고유 아이디
        viewerCount: 방송 시청자 수
        title: 방송 제목
        categoryId: 방송 카테고리 Id
        tagIds: 방송 태그 Id
        createdAt: 해당 DB 행 생성 시간
        '''
    }
    streamId = Column(String(50), primary_key=True)
    viewerCount = Column(Integer, unique=False)
    title = Column(String(150), unique=False)
    categoryId = Column(String(50), unique=False)
    tagIds = Column(Text, unique=False)
    createdAt = Column(TIMESTAMP, nullable=False,
                       default=func.now())

    def __init__(self, streamId, viewer, title, categoryId, tagIds, createdAt):
        self.streamId = streamId
        self.viewer = viewer
        self.title = title
        self.categoryId = categoryId
        self.tagIds = tagIds
        self.createdAt = createdAt


class TwitchStreamCategories(Base):
    __tablename__ = "TwitchStreamCategories"
    __table_args__ = {
        'comment': """
        트위치 방송 카테고리 정보
        categoryId: 카테고리 고유 아이디
        gameName: 카테고리 이름 (영어)
        gameNameKr: 카테고리 이름 (한국어)
        boxArt: 카테고리를 대표하는 이미지 url
        createdAt: 해당 행 생성 시간
        updatedAt: 해당 행 최근 수정 시간
        """
    }
    categoryId = Column(String(50), unique=False, primary_key=True)
    categoryName = Column(String(100), unique=False)
    categoryNameKr = Column(String(100), unique=False)
    boxArt = Column(String(200), unique=False)
    createdAt = Column(TIMESTAMP, nullable=False, default=func.now())
    updatedAt = Column(TIMESTAMP, nullable=True)

    def __init__(self, categoryId, categoryName, categoryNameKr, boxArt, createdAt, updatedAt):
        self.categoryId = categoryId
        self.categoryName = categoryName
        self.categoryNameKr = categoryNameKr
        self.boxArt = boxArt
        self.createdAt = createdAt
        self.updatedAt = updatedAt


class TwitchStreamTags(Base):
    __tablename__ = 'TwitchStreamTags'
    __table_args__ = {
        'comment': """
        트위치 방송 태그 정보
        tagId: 카테고리 고유 아이디
        isAuto: 해당 태그의 자동 생성 여부 불린 값
        nameKr: 해당 태그의 한국어 이름
        nameUs: 해당 태그의 영어 이름
        descriptionKr: 해당 태그의 한국어 설명
        descriptionUs: 해당 태그의 영어 설명
        createdAt: 해당 행 생성 시간
        updatedAt: 해당 행 최근 수정 시간
        """
    }
    tagId = Column(String(100), primary_key=True, nullable=False)
    isAuto = Column(Boolean, unique=False)  # 0 or 1
    nameKr = Column(String(50), unique=False, nullable=True)
    nameUs = Column(String(50), unique=False)
    descriptionKr = Column(String(255), unique=False, nullable=True)
    descriptionUs = Column(String(255), unique=False)
    createdAt = Column(TIMESTAMP, nullable=False, default=func.now())
    updatedAt = Column(TIMESTAMP, nullable=True)


class TwitchActiveStreams(Base):
    __tablename__ = 'TwitchActiveStreams'
    __table_args__ = {
        'comment': """
        (임시값 저장 테이블) 현재 방송중인 트위치 스트림 정보
        streamId: 해당 방송의 고유 아이디
        startedAt: 해당 방송의 시작 시간
        createdAt: 해당 행 생성 시간
        updatedAt: 해당 행 수정 시간
        """
    }
    streamId = Column(String(50), unique=False, primary_key=True)
    startedAt = Column(TIMESTAMP)
    createdAt = Column(TIMESTAMP, nullable=False, default=func.now())
    updatedAt = Column(TIMESTAMP, nullable=True)


class TwitchChats(Base):
    __tablename__ = 'TwitchChats'
    __table_args__ = {
        'comment': '''
        streamId: 해당 방송 고유 아이디
        authorId: 채팅 저자 고유 아이디
        authorName: 채팅 저자 이름(닉네임)
        subscriber: 채팅 저자가 해당 방송(스트리머)의 구독자 인지 여부
        manager: 채팅 저자가 해당 방송의 관리자(매니저) 인지 여부
        badges: 채팅 뱃지 JSON string
        text: 채팅 내용
        time: 채팅 발화 시간
        '''
    }
    id = Column(Integer, primary_key=True, autoincrement=True)
    streamId = Column(String(50), unique=False)
    authorId = Column(String(50), unique=False)
    authorName = Column(String(50), unique=False)
    subscriber = Column(Boolean, default=0)
    manager = Column(Boolean, default=0)
    badges = Column(String(150), nullable=True)
    text = Column(Text, unique=False)
    time = Column(TIMESTAMP)


class TwitchTargetStreamers(Base):
    __tablename__ = 'TwitchTargetStreamers'
    __table_args__ = {
        'comment': '''
        streamerId: 타겟 스트리머 아이디
        streamerName: 타겟 스트리머 이름 (닉네임)
        streamerLogo: 스트리머 로고 url
        streamerTwitchName: 타겟 스트리머 트위치 ID
        createdAt: 해당 행 생성 시간
        updatedAt: 해당 행 수정 시간
        '''
    }
    streamerId = Column(String(50), primary_key=True)
    streamerName = Column(String(50), unique=False)
    streamerLogo = Column(String(200), nullable=True)
    streamerTwitchName = Column(String(50), nullable=True)
    createdAt = Column(TIMESTAMP, nullable=False, default=func.now())
    updatedAt = Column(TIMESTAMP, nullable=True)
