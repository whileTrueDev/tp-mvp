# db state 확인해서 최근 종료된 방송이 있는 지 확인한다
# Db에서 데이터 불러온다
# 불러온 데이터를 전처리할 수 있는 형태로 바꾼다.
# 전처리를 한다
# 분석을 한다
# json 형태의 highlight_json으로 반환한다
# s3에 저장한다
import re
import datetime
import pandas as pd
import numpy as np
from datetime import date
from multiprocessing import Process, Pool
from lib.s3_connector import S3Connector
from lib.db_connect import DbHandler
from lib.morphs_analyzer import morphs_analyzer, word_counter, get_line_score, morphs_test
from lib.__json import json_dumper
from lib.warning_eliminator import ChainedAssignent
from lib.file_converter import FileConverter


def main(data, platform, stream_id):
    """
    data : 분석할 채팅 list
    platform : 채팅이 담겨져 있는 DB table 명
    stream_id : 해당 채팅의 streamId 
    """
    highlight_json = {'videoId': '', 'start_date': '', 'end_date': '', 'total_index': 0, 'highlight_points': []}
    metrics_json = {
        "videoId": "",
        "start_date": "",
        "end_date": "",
                    "total_index": 0,
                    "time_line": [],
                    "chat_points": [],
                    "smile_points": []
    }
    # 데이터프레임화
    df = pd.DataFrame(data)
    if platform == 'AfreecaStreams':
        df['time'] = pd.to_datetime(df['time'])
    if platform == "YoutubeStreams":
        df.rename(columns={'stream_id': 'creatorId'}, inplace=True)
    # 필요없는 컬럼 삭제
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
    df_onair['sum'] = df_onair['?'] + df_onair['ㅋ'] + df_onair['유하']
    percentile_of_data = df_onair['sum'].quantile(q=0.7, interpolation='nearest')
    df_list = df.groupby(pd.Grouper(freq='30s')).agg({'ㅋ': sum, '?': sum, '유하': sum, 'count': sum, 'anal': list})
    df_list['index'] = np.arange(len(df_list))
    df_list['sum'] = df_onair['sum']
    df_list['highlight'] = 0
    get_highlight = df_list['sum'] > percentile_of_data
    with ChainedAssignent():
        df_list['highlight'][get_highlight] = 1
        # 하이라이트인 로우만 따로 모으기
        df_highlight = df_list[df_list['highlight'] == 1]
        # group 기본값 부여
        df_highlight['group'] = np.nan
    # 같은 그룹끼리 묶는 과정
    group_num = 0
    for row in reversed(range(len(df_highlight))):
        group_num += 1
        diff = df_highlight['index'][row] - df_highlight['index'][row - 1]
        if diff == 1:
            with ChainedAssignent():
                df_highlight['group'].iloc[row] = group_num
            group_num -= 1
        else:
            with ChainedAssignent():
                df_highlight['group'].iloc[row] = group_num
    # videoid, end_date, 총 index 값 넣기
    highlight_json['videoId'] = stream_id
    highlight_json['start_date'] = df_list.index[0].strftime('%Y-%m-%d %H:%M:%S')
    highlight_json['end_date'] = df_list.index[-1].strftime('%Y-%m-%d')
    highlight_json['total_index'] = len(df_list)
    # 하이라이트 시간을 가진 그룹과 인덱스를 가진 그룹으로 만들어서 highlight_json에 넣어준다
    highlight_group = df_highlight.index.groupby(df_highlight['group'])
    if len(highlight_group) == 0:
        print('too short to analyze break the process')
        return False
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
        highlight_json['highlight_points'].append(highlight_point)
        highlight_point = {}
    # metrics json
    chat_points, smile_points = [[], []]
    metrics_counts = {}
    for i in range(len(df_onair)):
        metrics_counts['smile_count'] = df_onair['count'][i]
        metrics_counts['chat_count'] = df_onair['ㅋ'][i]
        metrics_json['time_line'].append(metrics_counts)
        metrics_counts = {}
    chat_count = list(df_onair['count'])
    smile_count = list(df_onair['ㅋ'])
    chat_points = list(df_highlight['count'])
    smile_points = list(df_highlight['ㅋ'])
    metrics_json['videoId'] = stream_id
    metrics_json['start_date'] = df_list.index[0].strftime('%Y-%m-%d %H:%M:%S')
    metrics_json['end_date'] = df_list.index[-1].strftime('%Y-%m-%d %H:%M:%S')
    metrics_json['total_index'] = len(df_list)
    metrics_json['chat_points'] = chat_points
    metrics_json['smile_points'] = smile_points
    creator_id = df['creatorId'].unique()[0]
    today = date.today().strftime("%Y-%m-%d")

    for i, v in enumerate(reversed(list(highlight_group.keys()))):
        highlight_point['start_time'] = str(highlight_group[v][0])
        highlight_point['end_time'] = str(highlight_group[v][-1])
        highlight_point['start_index'] = str(index_group[i][0])
        highlight_point['end_index'] = str(index_group[i][-1])
        highlight_json['highlight_points'].append(highlight_point)
        highlight_point = {}
    # metrics json
    chat_count, chat_points, smile_count, smile_points = [[], [], [], []]
    chat_count = list(df_onair['count'])
    smile_count = list(df_onair['ㅋ'])
    chat_points = list(df_highlight['count'])
    smile_points = list(df_highlight['ㅋ'])
    metrics_json['videoId'] = stream_id
    metrics_json['end_date'] = df_list.index[-1].strftime('%Y-%m-%d')
    metrics_json['total_index'] = len(df_list)
    metrics_json['metrics']['chat_count'] = chat_count
    metrics_json['metrics']['chat_points'] = chat_points
    metrics_json['metrics']['smile_count'] = smile_count
    metrics_json['metrics']['smile_points'] = smile_points
    creator_id = df['creatorId'].unique()[0]
    today = date.today().strftime("%Y-%m-%d")
    # s3 = S3Connector()
    # s3.upload_json('truepoint', highlight_json, 'highlight_json/{creator_id}/{date}/{stream_id}'.format(creator_id=creator_id, date=today, stream_id=stream_id), stream_id)
    # s3.upload_json('truepoint', metrics_json, 'metrics_json/{creator_id}/{date}/{stream_id}'.format(creator_id=creator_id, date=today, stream_id=stream_id), stream_id)


if __name__ == '__main__':
    highlight_json = {'videoId': '39667416302', 'start_date': '2020-09-13', 'end_date': '2020-09-13', 'total_index': 92,
                      'highlight_points': [{'start_time': '2020-09-13 21:55:00', 'end_time': '2020-09-13 21:55:00', 'start_index': 7, 'end_index': 10},
                                           {'start_time': '2020-09-13 21:56:00', 'end_time': '2020-09-13 21:56:00', 'start_index': 34, 'end_index': 54},
                                           {'start_time': '2020-09-13 21:58:30', 'end_time': '2020-09-13 21:58:30', 'start_index': 57, 'end_index': 62}]}
    converter = FileConverter()
    srt = converter.return_srt(highlight_json)
    bucket_name = 'truepoint'
    stream_id = '123123123'

    s3 = S3Connector(bucket_name, stream_id)
    creator_id = '134859149'
    today = '2020_09_18'
    srt_file_name = '{name}일 방송 하이라이트'.format(name=highlight_json['start_date'])
    s3.upload_srt('highlight_json/{creator_id}/{date}/{stream_id}'.format(creator_id=creator_id, date=today, stream_id=stream_id), srt, srt_file_name)
    # s3.upload_json('truepoint', metrics_json, 'metrics_json/{creator_id}/{date}/{stream_id}'.format(creator_id=creator_id, date=today, stream_id=stream_id), stream_id)
    # db state 확인해서 최근 종료된 방송이 있는 지 확인한다
    # platform_list = [('AfreecaStreams'), ('TwitchStreams'), ('YoutubeStreams')]
    # db_conn = DbHandler()
    # with Pool(processes=3) as pool:
    #     to_analyze = pool.map(db_conn.check_state, platform_list)
    # afreeca_bool, twitch_bool, youtube_bool = [bool(to_analyze[0]['AfreecaStreams']), bool(to_analyze[1]['TwitchStreams']), bool(to_analyze[2]['YoutubeStreams'])]
    # data = []
    # for stream in to_analyze:
    #     platform = list(stream.keys())[0]
    #     for stream_id in list(stream.values())[0]:
    #         if (afreeca_bool or twitch_bool or youtube_bool):
    #             data.append(db_conn.twitch_chat_call(stream_id, platform))

    #     for i, line in enumerate(data):
    #         platform = list(line.keys())[0]
    #         if isinstance(list(line.values())[0], (list)):
    #             # 유튜브는 streamId == creatorId
    #             stream_id = line[platform][0]['streamId']
    #             main(line[platform], platform, stream_id)
    #             # db_conn.update_state(platform, stream_id)
