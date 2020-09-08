import pymysql

HOST = 'onad.cbjjamtlar2t.ap-northeast-2.rds.amazonaws.com'
USER_ID = 'onad'
PASSWORD = 'rkdghktn12'
DB_NAME = 'onadnode'
DB_CHARSET = 'utf8mb4'
DB_PORT = 3306

connection = pymysql.connect(
    user=USER_ID,
    passwd=PASSWORD,
    host=HOST,
    db=DB_NAME,
    charset=DB_CHARSET,
    port=int(DB_PORT)
)


def check_state():
    '''
        flag 값 변경 여부를 확인하는 함수
    '''
    # 1시간마다 state 변경을 확인할 함수
    creator_id = '204831119'
    platform = 'twitch'
    result = {}
    result['creator_id'] = creator_id
    result['platform'] = platform
    return result


class DbHandler:
    '''
        디비와 통신을 하는 class
    '''
    creator_id = ''
    platform = ''

    def __init__(self, creator_id, platform):
        self.creator_id = creator_id
        self.platform = platform

    def test(self):
        '''
            test
        '''
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        select_query = 'SELECT * FROM creatorInfo WHERE creatorId = %s'
        cursor.execute(select_query, self.creator_id)
        result = cursor.fetchall()
        cursor.close()
        return result

    def twitch_chat_call(self):
        '''
            twitch에 채팅 불러오는 함수
        '''
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        select_query = '''SELECT * FROM twitchChat WHERE creatorId= %s and DATE(TIME) = '2020-08-31' ORDER BY TIME desc LIMIT 100'''
        cursor.execute(select_query, self.creator_id)
        result = cursor.fetchall()
        cursor.close()
        return result
