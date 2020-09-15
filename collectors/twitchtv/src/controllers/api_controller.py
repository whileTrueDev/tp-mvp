import requests
from src.services.api_service import APIService
from src.services.db_service import DBService
from src.utils.preprocessor import Preprocessor


class APIController:

    def __init__(self, dao, client_id, client_secret):
        self.api_service = APIService(dao, client_id, client_secret)
        self.db_service = DBService(dao)
        self.preprocessor = Preprocessor()

        # Have to operated. so, place in init function
        self.__target_streamers = self.db_service.selectTargetStreamers()

    def getStreams(self):
        # ###############################################################
        # Get twitch stream data
        streamers = self.api_service.getStreams(self.__target_streamers)
        # Preprocess the data
        streams_data, stream_details_data = self.preprocessor.streamPreprocess(
            streamers)

        # ###############################################################
        # Update TwitchTargetStreamers (if streamer change streamerName )
        self.db_service.updateTargetStreamersName(streams_data)

        # ###############################################################
        # Insert TwitchSterams, TwitchActiveStreams
        self.db_service.insertStream(streams_data)

        # ###############################################################
        # Get twitch follwer, subscriber data for exited streams
        exited_streams_with_followers = self.api_service.getFollowersCount(
            self.db_service.exited_streams
        )

        # Update TwitchStreams: followerCount
        self.db_service.updateExitedStream(exited_streams_with_followers)

        # ###############################################################
        # Insert TwitchStreamDetails
        self.db_service.insertStreamDetail(stream_details_data)

    def getCategories(self):
        # ###############################################################
        # Get twitch Categries data
        categories_data = self.api_service.getCategories()

        # ###############################################################
        # Insert TwitchStreamCategories
        self.db_service.insertCategories(categories_data)

    def getTags(self):
        # ###############################################################
        # Get twitch Tags data
        tags_data = self.api_service.getTags()
        # ###############################################################
        # Insert TwitchStreamTags
        self.db_service.insertTags(tags_data)
