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


class Youtube:
    def __init__(self):
        self.driver = Driver().get()
        # pass

    def run(self, videoid):
        target_url = 'http://www.youtube.com/watch?v={}'.format(videoid)
        dict_str = ""
        next_url = ""
        chatlog = []

        session = requests.Session()
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'}

        self.driver.get(target_url)
        time.sleep(5)

        html = self.driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        self.driver.quit()
        live_info = eval(str(soup.find_all(id="scriptTag")[0]).split(">")[
                         1][:-8].replace("false", "False"))
        channel_name = soup.find_all(
            class_="yt-simple-endpoint style-scope yt-formatted-string")[0].text
        video_name = live_info["name"]
        video_id = live_info["embedUrl"].split("/")[-1]
        channel_name = str(soup.find_all(itemprop="name")[1]).split('"')[1]
        channel_id = str(soup.find_all(itemprop="channelId")[0]).split('"')[1]

        flag = False
        for iframe in soup.find_all("iframe"):
            if "live_chat_replay" in iframe["src"]:
                next_url = "http://youtube.com" + iframe["src"]
                flag = True

        if not flag:
            return

        while True:
            try:
                html = session.get(next_url, headers=headers)
                soup = BeautifulSoup(html.text, "lxml")
                for scrp in soup.find_all("script"):
                    if 'window[\"ytInitialData\"]' in scrp.text:
                        dict_str = scrp.text.split("] = ")[1]
                dict_str = dict_str.replace("false", "False")
                dict_str = dict_str.replace("true", "True")
                dict_str = dict_str.rstrip("  \n ;")
                dics = eval(dict_str)
                continue_url = dics["continuationContents"]["liveChatContinuation"][
                    "continuations"][0]["liveChatReplayContinuationData"]["continuation"]
                next_url = "http://www.youtube.com/live_chat_replay?continuation=" + continue_url
                for samp in dics["continuationContents"]["liveChatContinuation"]["actions"]:
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
                    print(name, contents, play_time, real_time)

            except Exception as e:
                print(e)
                if len(str(e)) == 29:
                    print("★ 다음 채팅 토큰으로 이동 중")
                    continue
                elif len(str(e)) == 32:
                    print("{}의 채팅로그를 모두 받았읍니다.".format(video_name))
                    break
                elif len(str(e)) == 62:
                    print("{} 에서 불러올 채팅로그가 없거나 해당 동영상이 비공개입니다.".format(target_url))
                    break

        # username, userid, userphoto, text, playtime, realtime, videoname, videoid, channelname, channelid


class Crawler:
    dao = None  # Data Access Obejct = dao = scoped_session

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
        self.dao = DBManager.init(db_url)
        DBManager.init_db()

        # ########## DB Controller Initialization ###########
        self.db = DBController(self.dao)

        # ######### Data preprocessor Initialization #######
        self.preprocessor = Preprocessor()

    # Exit process
    def exit(self):
        print('Session 종료')
        self.dao.remove()
        print('engine 종료')
        DBManager.dispose()
        print('정상 종료됨.')
        sys.exit()

    # Start getting data via twitch API
    def run(self, message_data):
        # videoIds = self.db.getVideoId(0)
        # video_datas = self.preprocessor.videoIdPreprocess(videoIds) 전처리 과정을 사용하지 않겠다.

        # self.db.insertMessage(message_data)
        self.youtube_crawler.run('7qqJxDcgERc')


if __name__ == "__main__":
    import sys
    crawler = Crawler()
    crawler.run([])
    crawler.exit()
