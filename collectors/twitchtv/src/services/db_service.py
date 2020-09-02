import warnings
from sqlalchemy import exc as sa_exc
from src.model.member import TwitchActiveStreams, TwitchStreams


class DBService:
    def __init__(self, dao):
        self.dao = dao

    def insertStream(self, stream_data):
        # ####################################
        # Get already inserted Streams
        query = '''
        SELECT streamId
        FROM TwitchStreams
        WHERE startedAt > DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 30 DAY), "%Y-%m-%d %T")
        GROUP BY streamId
        '''
        rows = self.do_query(query)
        already_inserted = [row[0] for row in rows]

        only_not_inserted = [stream for stream in stream_data if stream.get(
            'streamId') not in already_inserted]
        print('only_not_inserted Stream 개수 : %s' % len(only_not_inserted))

        # ####################################
        # Insert TwitchStreams
        self.insert_list_of_dict(TwitchStreams, only_not_inserted)

        # ####################################
        # Insert TwitchActiveStreams

        # 수집 시간 단위 이전 시간의 active 방송 리스트
        active_streams_before_timeunit = [stream.__dict__ for stream in self.dao.query(
            TwitchActiveStreams).all()]

        # 현재 종료된 방송 (active리스트에는 있으나, 현재 api 리스트에는 없는 방송)

        # self.insert_list_of_dict(TwitchActiveStreams, only_not_inserted)

        self.dao.commit()
        print('Stream data Commit Done !!')

    def insertStreamDetail(self, stream_detail_data):
        self.db.insert_information(
            self.dao, 'TwitchStreamDetail', stream_detail_data)

        self.dao.commit()
        print('Stream detail data Commit Done !!')

    # def updateCreatorInfo(self, users):
    #     if len(users) > 0:

    #         query = '''
    #         UPDATE creatorInfo
    #         SET creatorLogo = :creatorLogo, creatorName = :creatorName
    #         WHERE creatorId = :creatorId
    #         '''
    #         for creator in users:
    #             query_dict = {
    #                 'creatorLogo': creator['profile_image_url'],
    #                 'creatorName': creator['display_name'],
    #                 'creatorId': creator['id']
    #             }
    #             do_query_nofetch(self.dao, query, query_dict)
    #             print('info updated! %s, %s' %
    #                   (creator['id'], creator['display_name']))

    #         self.dao.commit()

    # def insertGame(self, games):
    #     already_inserted = select_groupby(self.dao, TwitchGame.gameId)

    #     only_not_inserted = [game for game in games
    #                          if game.get('gameId') not in already_inserted]
    #     print('only_not_inserted Game 개수 : %s' % len(only_not_inserted))

    #     if len(only_not_inserted) > 0:
    #         insert_list_of_dict(self.dao, TwitchGame, only_not_inserted)
    #         self.dao.commit()
    #         print('Game data Commit Done !!')

    # def insertTag(self, tags):
    #     already_inserted = select_groupby(self.dao, TwitchTag.tagId)

    #     only_not_inserted = [tag for tag in tags if tag.get(
    #         'tagId') not in already_inserted]
    #     print('only_not_inserted Tag 개수 : %s' % len(only_not_inserted))

    #     if len(only_not_inserted) > 0:
    #         insert_list_of_dict(self.dao, TwitchTag, only_not_inserted)
    #         self.dao.commit()
    #         print('Tag data Commit Done !!')

    # def deleteDuplicatedGames(self):
    #     # ########################
    #     # twitchGame 테이블에서 중복 적재된 데이터 삭제
    #     # ########################

    #     print("twitchGame 테이블의 중복 데이터 삭제 시작")
    #     delete_duplicated_data_query = '''
    #     DELETE FROM twitchGame
    #         WHERE code NOT IN (
    #             SELECT code FROM (
    #                 SELECT code
    #                 FROM twitchGame
    #                 GROUP BY `gameId`
    #             ) AS code);'''
    #     self.dao.execute(delete_duplicated_data_query)
    #     self.dao.commit()
    #     print("twitchGame 테이블의 중복 데이터 삭제 완료")

    # # deprecated
    # def updateGameBoxArt(self, games):
    #     import time
    #     # boxArt update
    #     from model import update_game
    #     data = [{
    #         'id': d['id'],
    #         'box_art_url': d['box_art_url'].replace(
    #             '{width}', '300').replace('{height}', '300'),
    #     } for d in games]

    #     affected_row = 0
    #     for i, game in enumerate(data):
    #         affected = update_game(self.dao,
    #                                gameId=game['id'],
    #                                boxArt=game['box_art_url'])

    #         affected_row += affected

    #         if (i % 100 == 0):
    #             print('inserted... %s' % i)
    #             self.dao.commit()
    #             time.sleep(1)

    #     print('affected Rows : %s' % affected_row)
    #     self.dao.commit()
    #     print('commit Done')

    def do_query(self, query, query_dict={}):
        '''
        db query => fetchAll 함수  
        :query: {string} 디비 쿼리, 동적인 데이터는 :data이름 으로 넣는다.  
        :query_dict: {dict} 디비 쿼리 딕셔너리 동적인 데이터를 넣는 경우 키:값으로 매핑하는 딕셔너리
        '''
        rows = self.dao.execute(query, query_dict).fetchall()
        return rows

    def insert_list_of_dict(self, TableObject, data_list):
        self.dao.execute(TableObject.__table__.insert(), data_list)

    # def do_query_nofetch(self, query, query_dict={}):
    #     '''
    #     db query => void 함수
    #     :query: {string} 디비 쿼리, 동적인 데이터는 :data이름 으로 넣는다.
    #     :query_dict: {dict} 디비 쿼리 딕셔너리 동적인 데이터를 넣는 경우 키:값으로 매핑하는 딕셔너리
    #     '''
    #     rows = self.dao.execute(query, query_dict)
    #     return rows

    # def select_groupby_if_not_exists(self, target_col, group_key_col, filter_col):
    #     '''
    #     select
    #     * input
    #     - dao : scoped_session 객체
    #     - target_col : 그룹으로 묶어 반환 될 클래스(테이블)의 멤버변수(컬럼)
    #             ex) TwitchChat.broad_date
    #     - filter_key: 필터 키(컬럼명) 값
    #     - filter_value : 필터로 들어갈 값. not Key
    #     * output
    #     selected rows
    #     '''
    #     rows = self.dao.query(target_col).group_by(
    #         group_key_col).filter(filter_col == None).all()

    #     rows = [row[0] for row in rows]
    #     return rows

    # def select_groupby(self, target_col, target_streamer=None):
    #     """
    #     select 구문 함수
    #     * input
    #     - dao : scoped_session 객체
    #     - target_col : 그룹으로 묶어 반환 될 클래스(테이블)의 멤버변수(컬럼)
    #             ex) TwitchChat.broad_date
    #     - target_streamer : 추가적 조건으로 추가할 스트리머이름
    #     * output
    #     selected rows
    #     """
    #     if not target_streamer:
    #         rows = self.dao.query(target_col).group_by(target_col).all()
    #         rows = [row[0] for row in rows]  # [(1,), (2,), ...] 의 형식이기에
    #         return rows
    #     else:
    #         rows = self.dao.query(target_col).group_by(
    #             target_col).filter_by(
    #                 streamerName=target_streamer).all()
    #         return rows

    # def select_contracted_creator(self):
    #     # from src.model.member import CreatorInfo
    #     rows = self.dao.query(CreatorInfo).filter_by(
    #         creatorContractionAgreement=1
    #     ).all()
    #     return rows

    # def update_game(self, dao, gameId, boxArt):
    #     affected = self.dao.query(TwitchGame).filter_by(
    #         gameId=gameId).update(
    #             {TwitchGame.boxArt: boxArt})

    #     return affected
