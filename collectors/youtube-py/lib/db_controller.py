import warnings
from sqlalchemy import exc as sa_exc
from model import do_query, insert_list_of_dict, insert_information
from model.member import YoutubeOldChat, YoutubeOldVideos


class DBController:
    def __init__(self, dao):
        self.dao = dao

    def insertMessage(self, stream_data):
        print('message 개수 : %s' % len(stream_data))
        insert_information(self.dao, stream_data)
        self.dao.commit()
        print('message data Commit Done !!')

    def getVideoId(self, id):
        query = '''
        SELECT *
        FROM youtubeOldVideos
        WHERE code > {}
        LIMIT 100
        '''.format(id)
        rows = do_query(self.dao, query)

        self.dao.commit()
        print('video data fetch Done !!')
        return rows
