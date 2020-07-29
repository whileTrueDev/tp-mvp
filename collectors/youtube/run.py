import os
import sys
import json
from db import DBManager
from bs4 import BeautifulSoup
import requests
import time
from selenium import webdriver as wd
from datetime import datetime, timedelta
from lib.config_controller import ConfigController
from lib.db_controller import DBController
from lib.preprocessor import Preprocessor
from lib.driver import Driver
import re


class Youtube:
    def __init__(self):
        self.driver = Driver().get()
        # pass

    def exit(self):
        self.driver.quit()

    def run(self, videoid):
        # 변수
        target_url = 'http://www.youtube.com/watch?v={}'.format(videoid)
        next_url = ""
        chatlog = []
        # Headless
        session = requests.Session()
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'}

        self.driver.get(target_url)
        time.sleep(5)
        html = self.driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        live_info = eval(str(soup.find_all(id="scriptTag")[0]).split(">")[
                         1][:-8].replace("false", "False"))
        channel_name_tag = soup.find_all(
            class_="yt-simple-endpoint style-scope yt-formatted-string")
        if len(channel_name_tag) > 0:
            channel_name = channel_name_tag[0].text
        else:
            print("{}은 성인인증이 필요합니다.".format(videoid))
            return chatlog

        video_name = live_info["name"]
        video_id = live_info["embedUrl"].split("/")[-1]
        channel_name = str(soup.find_all(itemprop="name")[1]).split('"')[1]
        channel_id = str(soup.find_all(itemprop="channelId")[0]).split('"')[1]

        flag = False
        for iframe in soup.find_all("iframe"):
            if "live_chat_replay" in iframe["src"]:
                next_url = "https://youtube.com" + iframe["src"]
                flag = True

        # 라이브 방송이 아닌경우,
        if not flag:
            # 라방아님을 체크하기.
            return chatlog

        while True:
            try:
                html = session.get(next_url, headers=headers)
                soup = BeautifulSoup(html.text, "lxml")

                # select
                json_data = soup.find(
                    'script', string=re.compile('ytInitialData'))

                # 전처리
                message_data = json_data.string.strip().lstrip(
                    'window["ytInitialData"] = ').rstrip(' ;')

                # json화
                dics = json.loads(message_data)
                continue_url = dics["continuationContents"]["liveChatContinuation"][
                    "continuations"][0]["liveChatReplayContinuationData"]["continuation"]
                next_url = "https://www.youtube.com/live_chat_replay?continuation=" + continue_url
                for samp in dics["continuationContents"]["liveChatContinuation"]["actions"]:
                    membership = ''
                    name = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                        "item"]["liveChatTextMessageRenderer"]["authorName"]["simpleText"]
                    if 'authorBadges' in samp["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"]["liveChatTextMessageRenderer"]:
                        membership = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"][
                            "liveChatTextMessageRenderer"]["authorBadges"][0]['liveChatAuthorBadgeRenderer']['tooltip']
                    user_photo = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                        "item"]["liveChatTextMessageRenderer"]['authorPhoto']['thumbnails'][0]["url"]
                    if "text" in samp["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"]["liveChatTextMessageRenderer"]["message"]["runs"][0]:
                        contents = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                            "item"]["liveChatTextMessageRenderer"]["message"]["runs"][0]["text"]
                    else:
                        contents = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"][
                            "liveChatTextMessageRenderer"]["message"]["runs"][0]["emoji"]["shortcuts"][0]
                    play_time = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                        "item"]["liveChatTextMessageRenderer"]["timestampText"]["simpleText"]
                    real_time = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                        "item"]["liveChatTextMessageRenderer"]["timestampUsec"]
                    real_time = datetime(
                        1970, 1, 1) + timedelta(milliseconds=int(real_time)/1000) + timedelta(hours=9)
                    real_time = datetime.strftime(
                        real_time, '%y-%m-%d %H:%M:%S')
                    user_id = samp["replayChatItemAction"]["actions"][0]["addChatItemAction"][
                        "item"]["liveChatTextMessageRenderer"]["authorExternalChannelId"]
                    message_result_dict = {
                        'username': name,
                        'userid': user_id,
                        'membership': membership,
                        'userphoto': user_photo,
                        'text': contents,
                        'playtime': play_time,
                        'realtime': real_time,
                        'videoname': video_name,
                        'videoid': video_id,
                        'channelname': channel_name,
                        'channelid': channel_id,
                    }
                    # 멤버쉽 추가
                    chatlog.append(message_result_dict)
            except Exception as e:
                if len(str(e)) == 29:
                    print("★ 다음 채팅 토큰으로 이동 중")
                    continue
                elif len(str(e)) == 32:
                    print("{}의 채팅로그를 모두 받았읍니다.".format(video_name))
                    break
                elif len(str(e)) == 62:
                    print("{} 에서 불러올 채팅로그가 없거나 해당 동영상이 비공개입니다.".format(target_url))
                    break
        return chatlog


class Crawler:
    dao = None  # Data Access Obejct = dao = scoped_session
    db_url = ''
    streamers = list()

    def __init__(self):
        # ########## Load Config ##########
        self.config = ConfigController()
        self.config.init()
        self.config.load()
        self.youtube_crawler = Youtube()

        # ########## DB Initialization ##########
        db_url = "mysql+pymysql://%s:%s@%s:%s/%s?charset=%s" % (
            self.config.DB_USER, self.config.DB_PASSWORD,
            self.config.DB_HOST, self.config.DB_PORT,
            self.config.DB_DATABASE, self.config.DB_CHARSET
        )
        self.db_url = db_url
        self.dao = DBManager.init(db_url)
        DBManager.init_db()

        ########## DB Controller Initialization ###########
        self.db = DBController(self.dao)

        ######### Data preprocessor Initialization #######
        self.preprocessor = Preprocessor()

    # Exit process
    def exit(self):
        self.youtube_crawler.exit()

    def db_refresh(self):
        self.dao = DBManager.init(self.db_url)
        DBManager.init_db()
        self.db = DBController(self.dao)

    def db_close(self):
        self.dao.remove()
        DBManager.dispose()
        print('정상 종료됨.')

    # Start getting data via twitch API
    # start <= 비디오ID 인덱스 < end
    def run(self, start, end):
        videoIds = self.db.getVideoId(start, end)
        self.db_close()
        # video_datas = self.preprocessor.videoIdPreprocess(videoIds) 전처리 과정을 사용하지 않겠다.
        for code, videoId, _ in videoIds:
            message_data = self.youtube_crawler.run(videoId)
            if len(message_data) > 0:
                self.db_refresh()
                self.db.insertMessage(message_data)
                self.db_close()
            print('{} 번째 video에 대한 탐색이 완료되었습니다.'.format(code))


if __name__ == "__main__":
    import sys
    crawler = Crawler()
    crawler.run(0, 10000)
    crawler.exit()
