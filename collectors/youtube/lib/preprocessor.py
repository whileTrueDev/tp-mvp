class Preprocessor:
    def __init__(self):
        pass

    def streamPreprocess(self, streamers):
        stream_result_list = list()
        stream_detail_result_list = list()

        for streamer in streamers:
            stream_id = streamer.get('id')
            streamer_id = streamer.get('user_id')
            streamer_name = streamer.get('user_name')
            started_at = streamer.get('started_at')
            game_id = streamer.get('game_id')
            title = streamer.get('title')
            viewer_count = streamer.get('viewer_count')
            tag_ids = streamer.get('tag_ids')

            stream_result_dict = {
                'streamId': stream_id,
                'streamerId': streamer_id,
                'streamerName': streamer_name,
                'startedAt': started_at,
            }

            stream_detail_result_dict = {
                'streamId': stream_id,
                'streamerName': streamer_name,
                'viewer': viewer_count,
                'title': title,
                'gameId': game_id,
                'tagIds': ','.join(tag_ids) if tag_ids else ""
            }

            stream_result_list.append(stream_result_dict)
            stream_detail_result_list.append(stream_detail_result_dict)

        print("현재 총 요청된 데이터 개수: %s" % len(stream_detail_result_list))
        return stream_result_list, stream_detail_result_list

    def videoIdPreprocess(self, video_datas):
        video_data_result_list = list()

        for code, videoid, channelid in video_datas:
            video_data_result_dict = {
                'code': code,
                'videoid': videoid,
                'channelid': channelid
            }
            video_data_result_list.append(video_data_result_dict)

        print("현재 총 요청된 데이터 개수: %s" % len(video_data_result_list))
        return video_data_result_list
