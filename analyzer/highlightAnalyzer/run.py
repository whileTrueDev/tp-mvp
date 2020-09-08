# db state 확인해서 최근 종료된 방송이 있는 지 확인한다
# Db에서 데이터 불러온다
# 불러온 데이터를 전처리할 수 있는 형태로 바꾼다.
# 전처리를 한다
# 분석을 한다
# json 형태의 output으로 반환한다
# s3에 저장한다
import re
import datetime
import pandas as pd
import numpy as np
from lib.db_connect import DbHandler
from lib.db_connect import check_state
from lib.morphs_analyzer import morphs_analyzer, word_counter, get_line_score
from lib.json import json_dumper
from lib.warning_eliminator import ChainedAssignent


if __name__ == '__main__':
    # db state 확인해서 최근 종료된 방송이 있는 지 확인한다
    check_broadcast = check_state()
    IS_RETURN = bool(check_broadcast.values)
    if IS_RETURN:
        db_handler = DbHandler(check_broadcast['creator_id'], check_broadcast['platform'])
        data = db_handler.twitch_chat_call()

        output = {'videoId': '', 'end_date': '', 'total_index': 0, 'highlight_points': []}
        output2 = {'videoId': '', 'end_date': '', 'total_index': '', 'metrics': {}}
        # 데이터프레임화
        df = pd.DataFrame(data)
        # 필요없는 컬럼 삭제
        df.drop(['id', 'userId', 'subscriber', 'manager', 'badges'], axis=1, inplace=True)
        # time index 설정
        df.set_index('time', inplace=True)
        # 형태소 분석
        df['anal'] = df['text'].apply(lambda x: morphs_analyzer(x))
        # 점수 삽입위한 컬럼과 error 컬럼 생성
        df['ㅋ'], df['?'], df['유하'], df['count'], df['error'] = [np.nan, np.nan, np.nan, 1, 0]
        # 각 로우별 점수 내기
        df.apply(lambda x: word_counter(x.name, df), axis=1)
        # nan 값 0으로 채우기
        df.fillna(0, inplace=True)
        # 에러가 뜨지 않은 로우만 남기기
        df = df[df['error'] != 1]
        df_onair = df.resample('30s').sum()
        # 방송이 켜졌는지 꺼졌는지 확인을 위해 -> 30초간 채팅이 5개 이하면 방송이 안켜진 걸로
        # df_onair = df_score[df_score['count'] >= 5]
        df_onair['sum'] = df_onair['?'] + df_onair['ㅋ'] + df_onair['유하']
        # df_onair = df_onair[df_onair['sum'] != 0]
        percentile_of_data = df_onair['sum'].quantile(q=0.7, interpolation='nearest')
        df_list = df.groupby(pd.Grouper(freq='30s')).agg({'ㅋ': sum, '?': sum, '유하': sum, 'count': sum, 'anal': list})
        df_list['index'] = np.arange(len(df_list))
        df_list['sum'] = df_onair['sum']
        df_list['highlight'] = 0
        # df_list = df_list[df_list['count'] >= 5]
        get_highlight = df_list['sum'] > percentile_of_data
        with ChainedAssignent():
            df_list['highlight'][get_highlight] = 1
            # 하이라이트인 로우만 따로 모으기
            df_highlight = df_list[df_list['highlight'] == 1]
            # group 기본값 부여
            df_highlight['group'] = np.nan
        # 같은 그룹끼리 묶는 과정
        GROUP_NUM = 0
        for row in reversed(range(len(df_highlight))):
            GROUP_NUM += 1
            diff = df_highlight['index'][row] - df_highlight['index'][row - 1]
            if diff == 1:
                with ChainedAssignent():
                    df_highlight['group'].iloc[row] = GROUP_NUM
                GROUP_NUM -= 1
            else:
                with ChainedAssignent():
                    df_highlight['group'].iloc[row] = GROUP_NUM
        # videoid, end_date, 총 index 값 넣기
        output['videoId'] = 'twitch_12345'
        output['end_date'] = df_list.index[-1].strftime('%Y-%m-%d')
        output['total_index'] = len(df_list)
        # 하이라이트 시간을 가진 그룹과 인덱스를 가진 그룹으로 만들어서 output에 넣어준다
        highlight_group = df_highlight.index.groupby(df_highlight['group'])
        index_group = [i['index'] for v, i in df_highlight.groupby('group')]
        # 그룹이 내림차순이므로 뒤집어 준다
        index_group.reverse()
        # highlight_points에 들어갈 객체
        highlight_point = {}
        for i, v in enumerate(reversed(list(highlight_group.keys()))):
            highlight_point['start_time'] = str(highlight_group[v][0])
            highlight_point['end_time'] = str(highlight_group[v][-1])
            highlight_point['start_index'] = str(index_group[i][0])
            highlight_point['end_index'] = str(index_group[i][-1])
            output['highlight_points'].append(highlight_point)
            highlight_point = {}
        # metrics json
        chat_count, chat_points, smile_count, smile_points = [[], [], [], []]
        chat_count = list(df_onair['count'])
        smile_count = list(df_onair['ㅋ'])
        chat_points = list(df_highlight['count'])
        smile_points = list(df_highlight['ㅋ'])
        output2['videoId'] = 'twitch_1234'
        output2['end_date'] = df_list.index[-1].strftime('%Y-%m-%d')
        output2['total_index'] = len(df_list)
        output2['metrics']['chat_count'] = chat_count
        output2['metrics']['chat_points'] = chat_points
        output2['metrics']['smile_count'] = smile_count
        output2['metrics']['smile_points'] = smile_points

        json_dumper(output, 'output')
        json_dumper(output2, 'output2')
