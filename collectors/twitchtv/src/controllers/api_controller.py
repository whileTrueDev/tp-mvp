import requests
from src.services.api_service import APIService
from src.services.db_service import DBService
from src.utils.preprocessor import Preprocessor


class APIController:

    def __init__(self, dao, client_id, client_secret):
        self.api_service = APIService(dao, client_id, client_secret)
        self.db_service = DBService(dao)
        self.preprocessor = Preprocessor()

    def getStreams(self):
        # Get target streamers
        target_streamers = self.db_service.selectTargetStreamers()

        # Get twitch stream data
        streamers = self.api_service.getStreams(target_streamers)
      
        # Preprocess the data
        streams_data, stream_details_data = self.preprocessor.streamPreprocess(
            streamers)

        # Insert TwitchSterams, TwitchActiveStreams
        self.db_service.insertStream(streams_data)

        # Get twitch follwer, subscriber data for exited streams
        exited_streams_with_followers = self.api_service.getFollowersCount(
            self.db_service.exited_streams
        )

        # Update TwitchStreams: followerCount
        self.db_service.updateExitedStream(exited_streams_with_followers)

        # Insert TwitchStreamDetails
        # self.db_service.insertStreamDetail(stream_details_data)

    def getUsersForInfoUpdate(self,):
        # Limitation of params on one call
        PARAM_LENGTH_LIMIT = 100
        # configure variables
        dataset = list()  # 받아온 데이터를 담을 그릇

        need_change_creators = list()
        # 참고: https://dev.twitch.tv/docs/api/reference#get-users

        # contractedCreator 가져오기.
        from model import select_contracted_creator
        contracted_creators_from_db = select_contracted_creator(self.dao)
        contracted_creator_ids = [
            c.creatorId for c in contracted_creators_from_db]

        from utils.make_list_in_list import make_list_in_list

        bunch_of_creators = make_list_in_list(
            contracted_creator_ids, PARAM_LENGTH_LIMIT)

        # logo url(profile_image_url) 가져오기
        # Twitch - Users REST api : GET https://api.twitch.tv/helix/users
        for creators in bunch_of_creators:

            params = {'id': creators}
            res = requests.get(
                self.twitch_users_url, headers=self.headers, params=params)

            if res:
                data = res.json()
                dataset.extend(data['data'])

        # 현재 creatorInfo에 있는 creatorLogo와 비교하여 저장.
        for creator in dataset:
            if creator['profile_image_url'] not in [
                    c.creatorLogo for c in contracted_creators_from_db
                    if c.creatorId == creator['id']]:
                need_change_creators.append(creator)

        # 현재 creatorInfo에 있는 creatorName와 비교하여 저장.
        for creator in dataset:
            if creator['display_name'] not in [
                    c.creatorName for c in contracted_creators_from_db
                    if c.creatorId == creator['id']]:
                need_change_creators.append(creator)

        print('로고 및 creatorName 업데이트 크리에이터 수 : %s' % len(need_change_creators))
        return need_change_creators

    def getGame(self):
        PARAM_LENGTH_LIMIT = 100
        cursor = None
        data = []
        while True:
            params = {'first': PARAM_LENGTH_LIMIT, 'after': cursor}
            # api 요청
            res = requests.get(
                self.twitch_games_url, headers=self.headers, params=params)
            if res:
                data_ = res.json()
                data.extend(data_['data'])
                if data_['pagination']:
                    cursor = data_['pagination']['cursor']
                else:
                    break

        total_games = [
            {"gameId": i['id'],
             "gameName": i['name'],
             'boxArt': i['box_art_url'].replace(
                '{width}', '300').replace('{height}', '300'),
             } for i in data]

        return total_games

    def getTag(self):
        # stream api 파라미터 설정
        cursor = None
        total_tags = []

        while True:
            params = {'first': 100, 'after': cursor}
            # api 요청
            res = requests.get(
                self.twitch_tags_url, headers=self.headers, params=params)
            if res:
                data_ = res.json()

                total_tags.extend([{
                    'tagId': d.get('tag_id'),
                    'isAuto': 1 if d.get('is_auto') else 0,
                    'nameKr': d.get('localization_names').get('ko-kr'),
                    'nameUs': d.get('localization_names').get('en-us'),
                    'descriptionKr': d.get('localization_descriptions').get('ko-kr'),
                    'descriptionUs': d.get('localization_descriptions').get('en-us'),
                } for d in data_['data']])

                if data_['pagination']:
                    cursor = data_['pagination']['cursor']
                else:
                    break

        return total_tags

    def getGamesForUpdate(self):
        from model import select_groupby_if_not_exists
        from model.member import TwitchGame
        from utils.make_list_in_list import make_list_in_list
        # 적재된 게임 아이디 가져오기
        already_inserted = select_groupby_if_not_exists(
            self.dao, TwitchGame.gameId, TwitchGame.gameId, TwitchGame.boxArt)
        # 100개씩 나누어 twitch api 요청
        PARAM_LENGTH_LIMIT = 100
        list_in_list = make_list_in_list(already_inserted, PARAM_LENGTH_LIMIT)

        # api 요청
        import time

        # stream api 파라미터 설정
        url = 'https://api.twitch.tv/helix/games'

        data = []

        print('game box art process: %s' % len(list_in_list))
        for i, request_creators in enumerate(list_in_list):

            params = {'id': request_creators}
            # api 요청
            res = requests.get(
                url, headers=self.headers, params=params)
            if res:
                data_ = res.json()
                data.extend(data_['data'])
                print("get game box art _ processing... %s" % i)
                # time.sleep(1)
                if (i % 20 == 0):
                    time.sleep(1)
                if (i == 50):
                    break

        # {width}x{height} 명시
        data = [{
            'id': d['id'],
            'box_art_url': d['box_art_url'].replace(
                '{width}', '300').replace('{height}', '300'),
        } for d in data]
        return data
