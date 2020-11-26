# -*- coding: utf-8 -*-
import os
import scrapy
import requests
import re
from datetime import datetime as dt
from crawler.pipelines import AfreecaStreams
from crawler.pipelines import AfreecaActiveStreams
from crawler.items import AfreecatvChat
from crawler.middlewares import chatAllData, temporary_private, targetVideoId
from crawler.logger import logger as lg
from selenium import webdriver


class AfreecatvSpider(scrapy.Spider):
    name = 'afreecatv'
    allowed_domains = ['play.afreecatv.com', 'login.afreecatv.com']
    
    def __init__(self, *args, **kargs):
        afreecaActiveStream = AfreecaActiveStreams()
        self.start_url = kargs['start_url']
        self.creatorId = self.start_url[26:-1]
        self.is_private = afreecaActiveStream.getPrivateCreator(self.creatorId)
        
        
    def start_requests(self):
        yield scrapy.Request(url=self.start_url, callback=self.parse, method='GET', encoding='utf-8')

    def parse(self, response):
        afreecaStreams = AfreecaStreams()
        item = AfreecatvChat()

        creatorName = response.xpath('//*[@id="player_area"]/div[2]/div[2]/div[1]/text()').get
        videoTitle = response.xpath('//*[@id="player_area"]/div[2]/div[2]/div[4]/span/text()').get()
        startDateStr = response.xpath('//*[@id="player_area"]/div[2]/div[2]/ul/li[1]/span/text()').get()
        startDate = dt.strptime(startDateStr, '%Y-%m-%d %H:%M:%S')
        endDate = dt.strptime(dt.now().strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
        resolution = response.xpath('//*[@id="player_area"]/div[2]/div[2]/ul/li[2]/span/text()').get()
        videoQuality = response.xpath('//*[@id="player_area"]/div[2]/div[2]/ul/li[3]/span/text()').get()
        bookmark = response.xpath('//*[@id="player_area"]/div[2]/div[2]/div[6]/ul/li[2]/span/text()').get()
        
        if self.is_private[0] == 0:
            # 정상방송을 지속 진행하고 방송종료하는 경우
            if temporary_private == 0:
                afreecaStreams.addAfreecaStream(targetVideoId[0], videoTitle, startDate, endDate, bookmark, resolution, videoQuality, 0, 0)
            else:
                afreecaStreams.addAfreecaStream(targetVideoId[0], videoTitle, startDate, endDate, bookmark, resolution, videoQuality, 1, 1)

        else:
            if temporary_private == 0:
            # 비번설정한 후, 다시 크롤러가 프로세스를 돌렸는데 정상방송으로 변경한 경우
                afreecaActiveStream = AfreecaActiveStreams()
                afreecaActiveStream.updateLiveCreator([self.creatorId], 'private-off')
                afreecaStreams.updateAfreecaStream(targetVideoId, endDate, bookmark, resolution, videoQuality, 0, 0)

        lg.info(f'{creatorName}님의 채팅 데이터를 저장합니다.')
        
        for chatData in chatAllData:
            item['videoId'] = chatData['videoId']
            item['text'] = chatData['text']
            item['is_mobile'] = chatData['is_mobile']
            item['sex'] = chatData['sex']
            item['grade'] = chatData['grade']
            item['chatTime'] = chatData['chatTime']
            item['viewerId'] = chatData['viewerId']
            item['viewer'] = chatData['viewer']
            item['category'] = chatData['category']
            item['videoTitle'] = chatData['videoTitle']
            item['like'] = chatData['like']
            item['bookmark'] = chatData['bookmark']
            item['creatorId'] = chatData['creatorId']
            item['playTime'] = chatData['playTime']
            yield item
        