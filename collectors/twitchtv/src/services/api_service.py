
import sys
import requests
from src.utils.make_list_in_list import make_list_in_list


class APIService:
    __TWITCH_ACCESS_TOKEN = None
    headers = None

    twitch_oauth_token_url = 'https://id.twitch.tv/oauth2/token'
    twitch_stream_url = "https://api.twitch.tv/helix/streams"
    twitch_users_url = "https://api.twitch.tv/helix/users"
    twitch_users_follows_url = "https://api.twitch.tv/helix/users/follows"
    twitch_games_url = 'https://api.twitch.tv/helix/games/top'
    twitch_vidoes_url = 'https://api.twitch.tv/helix/videos'
    twitch_tags_url = 'https://api.twitch.tv/helix/tags/streams'

    PARAM_LENGTH_LIMIT = 100

    def __init__(self, dao, client_id, client_secret):
        self.dao = dao
        self.__getOauthToken(client_id, client_secret)

    # Authenticate with Twitch, get Oauth token and set "headers" member
    def __getOauthToken(self, client_id, client_secret):
        res = requests.post(self.twitch_oauth_token_url, data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'client_credentials'
        })
        if res:
            data = res.json()
            self.__TWITCH_ACCESS_TOKEN = data['access_token']
            self.headers = {
                'Client-ID': client_id,
                'Authorization': 'Bearer %s' % (self.__TWITCH_ACCESS_TOKEN)
            }
            print('Successfully Get Oauth token')
        else:
            print('Error occurred while getting oauth token from %s' %
                  self.twitch_oauth_token_url)
            sys.exit(1)

    def getStreams(self, target_streamers):
        """트위치 방송 정보 데이터 수집 메소드

        Args:
            target_streamers (list of TwitchTargetStreamers): 
            데이터 수집 타겟으로 설정된 유저 목록

        Returns:
            [list of stream_data]: 수집된 타겟 유저의 방송 정보 리스트
        """
        streamers_data = list()  # stream data list

        streamers = [streamer['streamerId'] for streamer in target_streamers]

        # 100 명 이상인 경우
        if len(streamers) > self.PARAM_LENGTH_LIMIT:
            # 100명마다 잘라서 [ [100], [100], [나머지] ] 의 형태로 만든다.
            list_in_list = make_list_in_list(
                streamers, self.PARAM_LENGTH_LIMIT)

            for request_streamers in list_in_list:
                params = {
                    'language': 'ko', 'user_id': request_streamers
                }

                # request to the Twitch Api
                res = requests.get(
                    self.twitch_stream_url,
                    headers=self.headers,
                    params=params)

                if res:
                    data = res.json()
                    streamers_data.extend(data['data'])
        # 100 명 이하인 경우
        else:
            params = {
                'language': 'ko', 'user_id': streamers
            }

            # Request to the Twitch Api
            res = requests.get(
                self.twitch_stream_url,
                headers=self.headers,
                params=params)

            if res:
                data = res.json()
                streamers_data.extend(data['data'])

        print("Successfully Recieved Streams Data from TwitchAPI !!")
        return streamers_data

    def getFollowersCount(self, target_streamers):
        """트위치 API에 팔로워 수를 요청하여 가져오는 함수

        Args:
            target_streamers (list of TwitchStreams): 타겟 스트리머 목록

        Returns:
            [{
                streamId: string,
                streamerId: string,
                followerCount: number
            }]: 타겟 스트리머에 대한 followerCount 정보
        """
        followers_counts = []
        for streamer in target_streamers:
            params = {
                'language': 'ko',
                'first': 1,
                'to_id': streamer['streamerId']
            }
            res = requests.get(
                self.twitch_users_follows_url,
                headers=self.headers,
                params=params)
            if res:
                data = res.json()
                followers_counts.append({
                    'streamId': streamer['streamId'],
                    'streamerId': streamer['streamerId'],
                    'followerCount': data['total']
                })

        return followers_counts

    def getCategories(self):
        cursor = None
        data = []
        while True:
            params = {'first': self.PARAM_LENGTH_LIMIT, 'after': cursor}
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

        total_categories = [
            {"categoryId": i['id'],
             "categoryName": i['name'],
             'boxArt': i['box_art_url'].replace(
                '{width}', '300').replace('{height}', '300'),
             } for i in data]

        return total_categories

    def getTags(self):
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
                    'tagId': d['tag_id'],
                    'isAuto': True if d['is_auto'] else False,
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
