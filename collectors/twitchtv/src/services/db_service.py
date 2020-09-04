import warnings
import datetime
from sqlalchemy import exc as sa_exc
from src.model.member import TwitchActiveStreams, TwitchStreams, \
    TwitchTargetStreamers, TwitchStreamDetails, TwitchStreamCategories, TwitchStreamTags


class DBService:
    def __init__(self, dao):
        self.dao = dao
        self.exited_streams = []

    def selectTargetStreamers(self):
        result = [t.__dict__ for t in self.dao.query(
            TwitchTargetStreamers).all()]
        print('Successfully ApiController Initialized !!')
        print('Successfully Load all Target streamers !! - %s Streamers' %
              len(result))
        return result

    def insertStream(self, stream_data):
        # ####################################
        # Get already inserted Streams
        query = '''
        SELECT streamId
        FROM TwitchStreams
        WHERE startedAt > DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 15 DAY), "%Y-%m-%d %T")
        GROUP BY streamId
        '''
        rows = self.__do_query(query)
        already_inserted = [row[0] for row in rows]

        only_not_inserted = [stream for stream in stream_data if stream.get(
            'streamId') not in already_inserted]

        # ####################################
        # Insert TwitchStreams
        if len(only_not_inserted) > 0:
            self.__insert_list_of_dict(TwitchStreams, only_not_inserted)

        # ####################################
        # Insert TwitchActiveStreams
        active_streams_before_timeunit = [  # 수집 시간 단위 이전 시간의 active 방송 리스트
            stream.__dict__['streamId']
            for stream in self.dao.query(TwitchActiveStreams).all()]

        # 현재 종료된 방송 (active리스트에는 있으나, 현재 api 리스트에는 없는 방송)
        now_active_stream_ids = [st['streamId'] for st in stream_data]
        exited_streams = [
            active_stream for active_stream in active_streams_before_timeunit
            if active_stream not in now_active_stream_ids]

        self.exited_streams = [i.__dict__ for i in self.dao.query(TwitchStreams)
                               .filter(TwitchStreams.streamId.in_(exited_streams))
                               .all()]

        # Delete all ActiveStreams rows
        self.dao.query(TwitchActiveStreams).delete()

        # Insert new ActiveStreams rows
        self.__insert_list_of_dict(TwitchActiveStreams, stream_data)

        self.dao.commit()
        print('Successfully Committed to insert TwitchStreams !! - %s Rows' %
              len(only_not_inserted))

    def updateExitedStream(self, exited_stream_data):
        '''
        현재 방금 방송이 끝난 스트림에 대한 팔로워 수를 적재, 방송이 끝난 시점을 기록하는 메소드
        더불어 편집점 분석프로그램과 트루포인트 데이터 적재프로그램의 활성화를 위한 플래그 값을 업데이트합니다.
        '''
        for data in exited_stream_data:
            # 팔로워 수를 적재 및 방송 끝난 시점 기록
            self.dao.query(TwitchStreams) \
                .filter(TwitchStreams.streamId == data['streamId']) \
                .update({
                    'followerCount': data['followerCount'],
                    'endedAt': datetime.datetime.utcnow() + datetime.timedelta(hours=9),
                    'needCollect': True,
                    'needAnalysis': True,
                })
        self.dao.commit()
        print('Successfully Committed to update TwitchStreams !! - %s Rows' %
              len(exited_stream_data))

    def updateTargetStreamersName(self, stream_data):
        """TwitchTargetStreamers 테이블의 streamerName 컬럼을 최신 데이터로 업데이트하는합수

        Args:
            stream_data (list of streams): 트위치로부터 받아온 방송 정보 데이터
        """
        for stream in stream_data:
            self.dao.query(TwitchTargetStreamers) \
                .filter(TwitchTargetStreamers.streamerId == stream['streamerId']) \
                .update({
                    'streamerName': stream['streamerName']
                })
        self.dao.commit()
        print('Successfully Committed to update TwitchTargetStreamers !!')

    def insertStreamDetail(self, stream_detail_data):
        """TwitchStreamDetails 테이블 데이터 적재 함수

        Args:
            stream_detail_data (list of stream detail data dict): 방송 세부정보 데이터 딕셔너리를 요소로 하는 리스트
        """
        self.__insert_list_of_dict(
            TwitchStreamDetails, stream_detail_data)

        self.dao.commit()
        print('Successfully Committed to insert TwitchStreamDetails !! - %s Rows' %
              len(stream_detail_data))

    def insertCategories(self, categories_data):
        """TwtichCategories 테이블 데이터 적재 함수

        Args:
            categories_data (list of categories): 트위치 방송 카테고리 데이터 딕셔너리를 요소로 하는 리스트
        """
        already_inserted = [
            i.__dict__['categoryId'] for i in self.dao.query(TwitchStreamCategories).all()]

        only_not_inserted = [category for category in categories_data
                             if category['categoryId'] not in already_inserted]

        if len(only_not_inserted) > 0:
            self.__insert_list_of_dict(
                TwitchStreamCategories, only_not_inserted)
            self.dao.commit()
            print('Successfully Committed to insert TwitchStreamCategories !! - %s Rows' %
                  len(only_not_inserted))
        else:
            print('Skip TwitchStreamCategories Insertion - There is no new record')

    def insertTags(self, tags_data):
        """TwtichTags 테이블 데이터 적재 함수

        Args:
            tags_data (list of tags_data): 트위치 방송 카테고리 데이터 딕셔너리를 요소로 하는 리스트
        """
        already_inserted = [
            i.__dict__['tagId'] for i in self.dao.query(TwitchStreamTags).all()]

        only_not_inserted = [tag for tag in tags_data
                             if tag['tagId'] not in already_inserted]

        if len(only_not_inserted) > 0:
            self.__insert_list_of_dict(TwitchStreamTags, only_not_inserted)
            self.dao.commit()
            print('Successfully Committed to insert TwitchStreamTags !! - %s Rows' %
                  len(only_not_inserted))
        else:
            print('Skip TwitchStreamTags Insertion - There is no new record')

    def __do_query(self, query, query_dict={}):
        '''
        db query => fetchAll 함수  
        :query: {string} 디비 쿼리, 동적인 데이터는 :data이름 으로 넣는다.  
        :query_dict: {dict} 디비 쿼리 딕셔너리 동적인 데이터를 넣는 경우 키:값으로 매핑하는 딕셔너리
        '''
        rows = self.dao.execute(query, query_dict).fetchall()
        return rows

    def __insert_list_of_dict(self, TableObject, data_list):
        self.dao.execute(TableObject.__table__.insert(), data_list)
