import scrapy


class AfreecatvChat(scrapy.Item):
    viwer = scrapy.Field()
    viewerId = scrapy.Field()
    category = scrapy.Field()
    videoTitle = scrapy.Field()
    videoId = scrapy.Field()
    text = scrapy.Field()
    is_mobile = scrapy.Field()
    sex = scrapy.Field()
    grade = scrapy.Field()
    chatTime = scrapy.Field()
    like = scrapy.Field()
    bookmark = scrapy.Field()
    creatorId = scrapy.Field()
    playTime = scrapy.Field()

class AfreecaStreams(scrapy.Item):
    videoId = scrapy.Field()
    videoTitle = scrapy.Field()
    startDate = scrapy.Field()
    endDate = scrapy.Field()
    bookmark = scrapy.Field()
    resolution = scrapy.Field()
    videoQuality = scrapy.Field()
    needAnalysis = scrapy.Field()
    needCollect = scrapy.Field()