
import sys
import requests
from src.utils.make_list_in_list import make_list_in_list


class APIService:
    __TWITCH_ACCESS_TOKEN = None
    headers = None

    twitch_oauth_token_url = 'https://id.twitch.tv/oauth2/token'
    twitch_stream_url = "https://api.twitch.tv/helix/streams"
    twitch_users_url = "https://api.twitch.tv/helix/users"
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

    def getStreams(self, how_much_time, target_streamers=[]):
        cursor = None
        streamers = list()  # stream data list
        contracted_streamers = list()  # 계약된 스트리머 데이터 리스트

        for _ in range(how_much_time):
            params = {
                'language': 'ko',
                'first': self.PARAM_LENGTH_LIMIT,
                'after': cursor
            }
            res = requests.get(
                self.twitch_stream_url,
                headers=self.headers,
                params=params)
            if res:
                data = res.json()
                streamers.extend(data['data'])
                # if exists pagination, go next, else break
                if data['pagination']:
                    cursor = data['pagination']['cursor']
                else:
                    break
            else:
                break

            # 앞서 받아온 300명의 크리에이터와 중복되지 않는 계약된 크리에이터들을 선택.
            if len(target_streamers) > 0:
                creators = [creator.creatorId for creator in target_streamers]
                creators = [
                    creator for creator in creators
                    if creator not in [streamer.get('user_id') for streamer in streamers]]
                print("중복을 제외한 요청할 계약된 크리에이터 수: %s" % (len(creators)))

                # 중복된 streamerId 가 있는지 확인한 이후 중복된 크리에이터는 요청하지 않는다.
                if len(creators) > self.PARAM_LENGTH_LIMIT:

                    # 100명마다 잘라서 [ [100], [100], [나머지] ] 의 형태로 만든다.
                    list_in_list = make_list_in_list(
                        creators, self.PARAM_LENGTH_LIMIT)

                    for request_creators in list_in_list:
                        contracted_creator_params = {
                            'language': 'ko', 'user_id': request_creators
                        }

                        # request to the Twitch Api
                        contracted_creator_res = requests.get(
                            self.twitch_stream_url, headers=self.headers, params=contracted_creator_params)

                        if contracted_creator_res:
                            # contracted_streamer 데이터를 합친다.
                            contracted_streamers += contracted_creator_res.json().get('data')

                else:
                    contracted_creator_params = {
                        'language': 'ko', 'user_id': request_creators
                    }

                    # request to the Twitch Api
                    contracted_creator_res = requests.get(
                        self.twitch_stream_url, headers=self.headers, params=contracted_creator_params)

                    if contracted_creator_res:
                        # contracted_streamer 데이터를 합친다.
                        contracted_streamers += contracted_creator_res.json().get('data')

            if len(contracted_streamers) > 0:
                streamers = streamers + contracted_streamers

            print("stream, streamdetail API 요청 DONE")
            return streamers
