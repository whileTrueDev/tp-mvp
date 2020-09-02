import schedule
import time
from crawler.pipelines import Afreecacreators
from crawler.spiders import creatorList as cL, afreecatv as af
import requests
import re
import os
from crawler.logger import logger as lg
from multiprocessing import Pool

def liveCreatorChecker():
    creatorChanels = {} # 전체 크리에이터 크리에이터 : 크리에이터 방송 채널
    nowliveCreator = [] # 현재 방송중인 크리에이터들 list
    
    for creator in cL.creatorList:
        creatorChanels[creator] = f'http://play.afreecatv.com/{creator}/'

    for creator, creatorChanel in creatorChanels.items():
        response = requests.get(creatorChanel)
        title  = re.search('"twitter:title" content=".*"', response.text, re.I)
        getTitle = title.group()[-12:-2]        
        if getTitle != '방송중이지 않습니다':
            nowliveCreator.append(creator)

    afreecaCreator  = Afreecacreators()
    liveCreator = afreecaCreator.getLiveCreator()
    afreecaCreator.updateLiveCreator(nowliveCreator, 'turn-on')
    
    # 현재 방송중인 크리에이터 중 기존에 방송중이던 크리에이터들을 제외한 애들
    crawlTargets = list(set(nowliveCreator) - set(liveCreator))

    crawlTargetChanel = [] # 크롤링 타겟 URL
    for crawlTarget in crawlTargets:
        crawlTargetChanel.append(f'http://play.afreecatv.com/{crawlTarget}/')

    return crawlTargetChanel

def run_crawl_url(crawl_url):
    os.system(f"curl -X POST http://localhost:6800/schedule.json -d project=crawler -d spider=afreecatv -d start_url={crawl_url}")

def run_crawl():
    """크롤링 실행"""
    lg.info('크롤러 프로그램 실행')
    crawl_urls = liveCreatorChecker()

    if len(crawl_urls) < 1:
        lg.info('새로 방송 킨 크리에이터가 없습니다')
    else:
        lg.info('타겟 크리에이터의 크롤링을 실시합니다')
        pool = Pool(processes=5)
        pool.map(run_crawl_url, crawl_urls)
        pool.close()
        pool.join()
        
if __name__ == "__main__":

    schedule.every(2).minutes.do(run_crawl)
    while True:
        schedule.run_pending()
        time.sleep(1)
