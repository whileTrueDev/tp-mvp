from datetime import datetime, timedelta


class Preprocessor:
    def __init__(self):
        self.KST_TIMEDELTA = timedelta(hours=9)
        pass

    def streamPreprocess(self, streamers):
        stream_result_list = list()
        stream_detail_result_list = list()

        for streamer in streamers:
            stream_id = streamer.get('id')
            title = streamer.get('title')
            streamer_id = streamer.get('user_id')
            streamer_name = streamer.get('user_name')
            __started_at = streamer.get('started_at')
            category_id = streamer.get('game_id')
            viewer_count = streamer.get('viewer_count')
            tag_ids = streamer.get('tag_ids')

            started_at = (datetime.strptime(
                __started_at, "%Y-%m-%dT%H:%M:%SZ") +
                self.KST_TIMEDELTA).strftime('%Y-%m-%d %H:%M:%S')

            stream_result_dict = {
                'streamId': stream_id,
                'title': title,
                'streamerId': streamer_id,
                'streamerName': streamer_name,
                'startedAt': started_at,
            }

            stream_detail_result_dict = {
                'streamId': stream_id,
                'streamerName': streamer_name,
                'viewerCount': viewer_count,
                'title': title,
                'categoryId': category_id,
                'tagIds': ','.join(tag_ids) if tag_ids else ""
            }

            stream_result_list.append(stream_result_dict)
            stream_detail_result_list.append(stream_detail_result_dict)

        print("현재 총 요청된 데이터 개수: %s" % len(stream_detail_result_list))
        return stream_result_list, stream_detail_result_list
