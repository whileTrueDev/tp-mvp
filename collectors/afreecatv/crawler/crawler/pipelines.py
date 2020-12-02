# -*- coding: utf-8 -*-
from orator import DatabaseManager, Model
from orator.orm import belongs_to_many
from .settings import ORATOR_CONFIG
from .logger import logger as lg


db = DatabaseManager(ORATOR_CONFIG)
Model.set_connection_resolver(db)

class AfreecaTargetStreamers(Model):
    """AfreecaTargetStreamers 데이터 테이블"""
    __table__ = 'AfreecaTargetStreamers'

    # 아프리카 플랫폼을 구독한 크리에이터를 모두 들고 온다.
    def getTargetUser(self):
        try:
            allRow = db.table(self.__table__).get().all()
            rows = []
            for row in allRow:
                rows.append(row['creatorId'])
        except: rows = []
        return rows

class AfreecaActiveStreams(Model):
    """AfreecaActiveStreams 데이터 데이블"""
    __table__ = 'AfreecaActiveStreams'

    @belongs_to_many
    def afreecaChats(self):
        return AfreecaChats

    # Live방송 중인 크리에이터 뽑아온다.
    def getLiveCreator(self):
        try:
            allRow = db.table(self.__table__).where('is_live', 1).get().all()
            rows = []
            for row in allRow:
                rows.append(row['creatorId'])
        except: rows = []
        return rows

    # Live방송 중이나 비번방 크리에이터 뽑아
    def getPrivateCreator(self, creatorId):
        try:
            allRow = db.table(self.__table__).where('creatorId', '=', creatorId).get().all()
            rows = []
            for row in allRow:
                rows.append(row['is_private'])
        except: rows = []
        return rows

    # Live방송중인 크리에이터들의 라이브 방송여부, 비번방 설정여부 값을 업데이트한다.
    def updateLiveCreator(self, creatorIds, turnState):    
        for creatorId in creatorIds:
            if turnState == 'live-off':
                row = db.table(self.__table__).where('creatorId', '=', creatorId).update(is_live=0)
                if row != 0:
                    lg.info(f'{creatorId}님이 라이브 방송을 종료했습니다')
            elif turnState == 'live-on':
                row = db.table(self.__table__).where('creatorId', '=', creatorId).update(is_live=1)
                if row != 0:
                    lg.info(f'{creatorId}님이 라이브 방송을 시작했습니다')
            elif turnState == 'private-on':
                row = db.table(self.__table__).where('creatorId', '=', creatorId).update(is_private=1)
                if row != 0:
                    lg.info(f'{creatorId}님이 비밀 방송을 시작했습니다')
            elif turnState == 'private-off':
                row = db.table(self.__table__).where('creatorId', '=', creatorId).update(is_private=0)
                if row != 0:
                    lg.info(f'{creatorId}님이 비밀 방송을 종료했습니다')

class AfreecaStreams(Model):
    """AfreecaStreams 데이터 테이블"""
    __table__ = 'AfreecaStreams'

    def addAfreecaStream(self, videoId, videoTitle, startDate, endDate, bookmark, resolution, videoQuality, needAnalysis, needCollect):
        db.table(self.__table__).insert(
            videoId=videoId,
            videoTitle=videoTitle,
            startDate=startDate,
            endDate=endDate,
            bookmark=bookmark,
            resolution=resolution,
            videoQuality=videoQuality,
            needAnalysis=needAnalysis,
            needCollect=needCollect
        )

    def updateAfreecaStream(self, videoId, endDate, bookmark, resolution, videoQuality, needAnalysis, needCollect):
        db.table(self.__table__).where('videoId', '=', videoId).update(
            endDate=endDate,
            bookmark=bookmark,
            resolution=resolution,
            videoQuality=videoQuality,
            needAnalysis=needAnalysis,
            needCollect=needCollect
        )


class AfreecaChats(Model):
    """AfreecaChat 데이터 테이블"""
    __table__ = 'AfreecaChats'

    @belongs_to_many
    def afreecaActiveStreams(self):
        return AfreecaActiveStreams


class DatabasePipeline(object):
    """AfreecaChat에 저장하기"""

    def __init__(self):
        """스크레이핑한 모든 item을 저장할 변수 선언"""
        self.items = []

    def process_item(self, item, spider):
        """각각의 아이템에 대한 처리 테이블에 INSERT"""
        afreecachat = AfreecaChats()
        afreecachat.text = item['text']
        afreecachat.is_mobile = item['is_mobile']
        afreecachat.sex = item['sex']
        afreecachat.grade = item['grade']
        afreecachat.chatTime = item['chatTime']
        afreecachat.viewerId = item['viewerId']
        afreecachat.viewer = item['viewer']
        afreecachat.category = item['category']
        afreecachat.videoId = item['videoId']
        afreecachat.videoTitle = item['videoTitle']
        afreecachat.like = item['like']
        afreecachat.bookmark = item['bookmark']
        afreecachat.creatorId = item['creatorId']
        afreecachat.playTime = item['playTime']
        afreecachat.save()

        return item

