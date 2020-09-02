import os
import sys
import json
import requests
from src.db import DBManager
from src.config.config_loader import ConfigLoader
from src.controllers.api_controller import APIController
# from src.utils.preprocessor import Preprocessor


class TwitchCollector:
    dao = None  # Data Access Obejct = dao = scoped_session

    streamers = list()

    def __init__(self):
        # ########## Load Config ##########
        self.config = ConfigLoader()
        self.config.init()
        self.config.load_dbconfig_from_aws_secrets_manager()

        # # ########## DB Initialization ##########
        db_url = "mysql+pymysql://%s:%s@%s:%s/%s?charset=%s" % (
            self.config.DB_CONFIG['username'], self.config.DB_CONFIG['password'],
            self.config.DB_CONFIG['host'], self.config.DB_CONFIG['port'],
            self.config.DB_CONFIG['dbname'], 'utf8mb4'
        )
        self.dao = DBManager.init(db_url)
        DBManager.init_db()

        # ########## Api Controller Initialization ##########
        self.twitch_api = APIController(
            self.dao,
            self.config.CRAWL_TWITCH_API_KEY,
            self.config.CRAWL_TWITCH_API_CLIENT_SECRET)

    # Exit process
    def exit(self):
        print('Session 종료')
        self.dao.remove()
        print('engine 종료')
        DBManager.dispose()
        print('정상 종료됨.')
        sys.exit()

    # Start getting data via twitch API
    def run(self):
        # Stream, stream detail
        streamers = self.twitch_api.getStreams()

        # # Creator info update
        # users = self.twitch_api.getUsersForInfoUpdate()
        # self.db.updateCreatorInfo(users)

        # # Game
        # games = self.twitch_api.getGame()
        # self.db.insertGame(games)

        # # Tag
        # tags = self.twitch_api.getTag()
        # self.db.insertTag(tags)

        # twitchGame중복제거
        # self.db.deleteDuplicatedGames()
