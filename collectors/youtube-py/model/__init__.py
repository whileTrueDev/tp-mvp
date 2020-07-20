def do_query(dao, query, query_dict={}):
    '''
    db query => fetchAll 함수  
    :query: {string} 디비 쿼리, 동적인 데이터는 :data이름 으로 넣는다.  
    :query_dict: {dict} 디비 쿼리 딕셔너리 동적인 데이터를 넣는 경우 키:값으로 매핑하는 딕셔너리
    '''
    rows = dao.execute(query, query_dict).fetchall()
    return rows


def insert_information(dao, data):
    """
    db 데이터 삽입 함수
    * input
      - dao : scoped_session 객체
        (YoutubeOldChat)
      - data_dict : 해당 테이블의 컬럼명을 key로 하고, 데이터를 value로 하는 딕셔너리

    * output
      데이터 삽입 이후 1을 반환
      삽입이 진행되지 않았을 시 None 을 반환
    """
    from model.member import YoutubeOldChat

    def insert(member):
        """데이터 insert 후 커넥션 remove하는 함수
        insert_information 함수 안에서만 사용
        """
        dao.add(member)

    if type(data) == list:
        members = list(map(
            lambda x: YoutubeOldChat(
                x.get('username'), x.get('userid'),
                x.get('membership'),
                x.get('userphoto'), x.get('text'),
                x.get('playtime'), x.get('realtime'),
                x.get('videoname'), x.get('videoid'),
                x.get('channelname'), x.get('channelid')), data))

        dao.add_all(members)
        print('All stream detail object inserted !!')
        return 1


def insert_list_of_dict(dao, TableObject, data_list):
    dao.execute(TableObject.__table__.insert(), data_list)
