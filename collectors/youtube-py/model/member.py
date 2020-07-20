from sqlalchemy import Column, String, Integer, BigInteger, TIMESTAMP, Text, Float
from sqlalchemy.sql.expression import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class YoutubeOldVideos(Base):
    """
    videoId: twitch 스트리머의 고유 ID
    stream_id: twitch 생방송의 고유 ID(this changes every stream )
    streamer_name: 해당 스트리머 이름
    broad_date: 해당 스트리밍의 방송시작날짜
    """
    __tablename__ = 'youtubeOldVideos'
    code = Column(Integer, primary_key=True, autoincrement=True)
    videoId = Column(String(50), unique=False)
    channelId = Column(String(50), unique=False)

    def __init__(self, videoId, channelId):
        self.videoId = videoId
        self.channelId = channelId

    def __repr__(self,):
        return "%s, %s" % (self.videoId, self.channelId)


class YoutubeOldChat(Base):
    """
    stream_id: twitch 생방송의 고유 ID( this changes every stream )
    viewer: 시청자수
    title: twitch 생방송의 제목
    game_id: 진행중인 게임의 고유 ID
    date: 시간 정보
    """
    __tablename__ = 'youtubeOldChat'
    code = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=False)
    userid = Column(String(50), unique=False)
    userphoto = Column(String(255), unique=False)
    text = Column(Text, unique=False)
    playtime = Column(String(150), unique=False)
    realtime = Column(TIMESTAMP, default=func.now())
    videoname = Column(String(50), unique=False)
    videoid = Column(String(50), unique=False)
    channelname = Column(String(50), unique=False)
    channelid = Column(String(50), unique=False)

    def __init__(self, username, userid, userphoto, text, playtime,
                 realtime, videoname, videoid, channelname, channelid):
        self.username = username
        self.userid = userid
        self.userphoto = userphoto
        self.text = text
        self.playtime = playtime
        self.realtime = realtime
        self.videoname = videoname
        self.videoid = videoid
        self.channelname = channelname
        self.channelid = channelid

    def __repr__(self,):
        return """%s, %s, %s, %s, %s, %s, %s""" % (
            self.username, self.userid,
            self.text, self.playtime,
            self.realtime, self.videoname, self.videoid)
