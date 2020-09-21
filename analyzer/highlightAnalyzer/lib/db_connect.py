import pymysql
from dotenv import load_dotenv
from os.path import join, dirname
import os
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True)

HOST = os.environ.get('HOST')
USER_ID = os.environ.get('USER_ID')
PASSWORD = os.environ.get('PASSWORD')
DB_NAME = os.environ.get('DB_NAME')
DB_CHARSET = os.environ.get('DB_CHARSET')
DB_PORT = os.environ.get('DB_PORT')


class DbHandler:
    '''
        디비와 통신을 하는 class
    '''

    def __init__(self):
        global pool

    def conn(self):
        pool = pymysql.connect(
            user=USER_ID,
            passwd=PASSWORD,
            host=HOST,
            db=DB_NAME,
            charset=DB_CHARSET,
            port=int(DB_PORT),
        )
        return pool

    def check_state(self, platform):
        result = {}
        id_list = []
        connection = self.conn()
        select_query = 'SELECT videoId as streamId FROM {platform} WHERE needAnalysis = 1'.format(platform=platform)
        if platform == 'TwitchStreams':
            select_query = 'SELECT streamId FROM {platform} WHERE needAnalysis = 1 order by createdAt desc LIMIT 10'.format(platform=platform)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute(select_query)
        data = cursor.fetchall()
        for id in data:
            id_list.append(id['streamId'])
        result[platform] = id_list
        cursor.close()
        connection.close()
        return result

    def update_state(self, platform, video_id):
        connection = self.conn()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        update_query = """
            UPDATE {platform}
            set needAnalysis = 0
            where videoId = "{video_id}"
            """.format(platform=platform, video_id=video_id)
        if platform == 'TwitchStreams':
            update_query = """
            UPDATE {platform}
            set needAnalysis = 0
            where streamId = "{video_id}"
            """.format(platform=platform, video_id=video_id)
        cursor.execute(update_query)
        connection.commit()
        cursor.close()
        connection.close()

    def twitch_chat_call(self, stream_id, platform):
        '''
            twitch에 채팅 불러오는 함수
        '''
        connection = self.conn()
        result = {}
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        if platform == 'AfreecaStreams':
            select_query = '''
            SELECT videoId as streamId, creatorId, text, playTime as time
            FROM AfreecaChats 
            WHERE videoId=%s
            '''
        elif platform == 'TwitchStreams':
            select_query = '''
            SELECT streamId, streamerId as creatorId, text, time
            FROM TwitchChats WHERE streamId=%s
            '''
        elif platform == 'YoutubeStreams':
            select_query = '''
            SELECT videoId as streamId, videoId as creatorId, text, time
            FROM YoutubeChats 
            WHERE videoId=%s
            '''
        cursor.execute(select_query, stream_id)
        result[platform] = cursor.fetchall()
        cursor.close()
        connection.close()
        return result
