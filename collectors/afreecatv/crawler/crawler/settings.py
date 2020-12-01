from .configController import ConfigController

config = ConfigController()
config.load_dbconfig_from_aws_secrets_manager()

BOT_NAME = 'crawler'

SPIDER_MODULES = ['crawler.spiders']
NEWSPIDER_MODULE = 'crawler.spiders'
DOWNLOADER_MIDDLEWARES = {
    'crawler.middlewares.SeleniumMiddleware': 100
}

ROBOTSTXT_OBEY = False
CONCURRENT_REQUESTS = 32
DOWNLOAD_DELAY = 3
CONCURRENT_REQUESTS_PER_DOMAIN = 32
CONCURRENT_REQUESTS_PER_IP = 32
ITEM_PIPELINES = {
   'crawler.pipelines.DatabasePipeline': 300,
}

ORATOR_CONFIG = {    
    'mysql': {
        'driver': config.DB_CONFIG["engine"],
        'host': config.DB_CONFIG["host"],
        'database': config.DB_CONFIG["dbname"],
        'user': config.DB_CONFIG["username"],
        'password': config.DB_CONFIG["password"],
        'port': config.DB_CONFIG["port"]
    }
}