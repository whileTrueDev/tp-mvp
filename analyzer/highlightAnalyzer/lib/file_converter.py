# 1
# 00:00:20,789 --> 00:00:25,124
# <Font Color=#5F00FF></Font>★Truepoint★</Font>채팅 빈도수 기준 1위 구간 -33회 (00:00~00:00)

# 2
# 00:00:55,167 --> 00:01:00,127
# <Font Color=#5F00FF></Font>★Truepoint★</Font>채팅 빈도수 기준 2위 구간 - 45회 (00:00~00:00)

# {videoId: 39667416302, end_date: 2020-09-13, total_index: 92, highlight_points: [{start_time: 2020-09-13
# 21:55:00, end_time: 2020-09-13 21:55:00, start_index: 7, end_index: 7}, {start_time: 2020-09-13
# 21:56:00, end_time: 2020-09-13 21:56:00, start_index: 9, end_index: 9}, {start_time: 2020-09-13
# 21:58:30, end_time: 2020-09-13 21:58:30, start_index: 14, end_index: 14}]}
import time


class FileConverter:

    # def __init__(self, data):
    #     self.data = data

    def play_time_calculator(self, start_index, end_index):
        '''
            하이라이트 index를 통해 실제 방송시간 기준으로 리턴해준다.
            start_index : start_index
            end_index : end_index
        '''
        start_sec = start_index * 30
        end_sec = end_index * 30
        start_time = time.strftime('%H:%M:%S', time.gmtime(start_sec))
        end_time = time.strftime('%H:%M:%S', time.gmtime(end_sec))
        return_time = [start_time, end_time]
        return return_time

    def srt_time_formatter(self, start_time, end_time):
        '''
            H:M:S 를 srt의 포맷에 맞게 리턴해준다.
            start : start H:M:S
            end : end H:M:S
        '''
        start_time = start_time + ',000'
        end_time = end_time + ',000'
        return_time = [start_time, end_time]
        return return_time

    def return_srt(self, data):
        '''
            json데이터를 받아서 srt 포맷으로 리턴한다.
        '''
        srt_list = []
        for point in data['highlight_points']:
            start = point['start_index']
            end = point['end_index']
            time_list = self.play_time_calculator(start, end)
            format_time_list = self.srt_time_formatter(time_list[0], time_list[1])
            test_line = '{start} --> {end}\n<Font Color=#5F00FF>★Truepoint★</Font> 하이라이트구간 ({pure_start}~{pure_end})\n'.format(
                start=format_time_list[0], end=format_time_list[1], pure_start=time_list[0], pure_end=time_list[1])
            srt_list.append(test_line)
        return_srt = '\n'.join(srt_list)
        return return_srt
