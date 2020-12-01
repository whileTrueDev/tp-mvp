import os
import sys
import json
import time
import datetime
import requests
from src.db import DBManager
from src.config.config_loader import ConfigLoader
from src.controllers.api_controller import APIController
# from src.utils.preprocessor import Preprocessor


class TwitchCollector:
    dao = None  # Data Access Obejct = dao = scoped_session
    streamers = list()

    def __init__(self):
        # ######### Time Settings #########
        self.starttime = time.time()
        self.KST = datetime.timezone(datetime.timedelta(hours=9))
        self.now = datetime.datetime.now(self.KST)

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
        print('Successfully Remove DB Session !!')
        self.dao.remove()
        print('Successfully Dispose DB Engine !!')
        DBManager.dispose()

        sec = time.time() - self.starttime
        running_time = str(datetime.timedelta(seconds=sec)).split(".")[0]

        print('Successfully Exited !! - Running time: %s' % running_time)
        sys.exit(0)

    # Start getting data via twitch API
    def run(self):
        try:
            # Stream, stream detail
            self.twitch_api.getStreams()

            # Categories
            if (self.now.minute in [57, 58, 59]):
                self.twitch_api.getCategories()
            else:
                print(
                    'Skip TwitchStreamCategories Request... - request only every 57-59 minute')

            # Tags
            if (self.now.hour == 0 & self.now.minute in [57, 58, 59]):
                self.twitch_api.getTags()
            else:
                print('Skip TwitchStreamTags Request... - request only 00:57-59')
        except Exception as e:
            print('Error occured !! - ', e)
