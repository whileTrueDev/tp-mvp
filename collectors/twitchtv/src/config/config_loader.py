import os
import json
import boto3
from botocore.config import Config
from dotenv import load_dotenv


class ConfigLoader:
    environment = ''

    def __init__(self):
        self.environment = os.getenv('PYTHON_ENV')

    def init(self):
        if self.environment != 'production':
            load_dotenv(verbose=True)

    def load(self):
        self.DB_HOST = os.getenv('DB_HOST')
        self.DB_USER = os.getenv('DB_USER')
        self.DB_PASSWORD = os.getenv('DB_PASSWORD')
        self.DB_DATABASE = os.getenv('DB_DATABASE')
        self.DB_CHARSET = os.getenv('DB_CHARSET')
        self.DB_PORT = os.getenv('DB_PORT')
        self.DB_LOGFLAG = os.getenv('DB_LOGFLAG')
        self.CRAWL_TWITCH_API_KEY = os.getenv('CRAWL_TWITCH_API_KEY')
        self.CRAWL_TWITCH_API_CLIENT_SECRET = os.getenv(
            'CRAWL_TWITCH_API_CLIENT_SECRET')

    def load_dbconfig_from_aws_secrets_manager(self):
        '''
        @description  
        AWS Secrets Manager로부터 DB 설정을 로드합니다.
        사용하고자 하는 IAM 유저의 AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY 값이 환경변수로 설정되어 있어야 합니다.

        @return <dict>  
        {
            "password": string,
            "dbname": string,
            "engine": string,
            "host": string,
            "port": number,
            "username": string
        }
        '''
        self.__REGION_NAME = 'ap-northeast-2'
        self.__AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
        self.__AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
        self.CRAWL_TWITCH_API_KEY = os.getenv('CRAWL_TWITCH_API_KEY')
        self.CRAWL_TWITCH_API_CLIENT_SECRET = os.getenv(
            'CRAWL_TWITCH_API_CLIENT_SECRET')

        my_config = Config(
            region_name=self.__REGION_NAME,
            signature_version='v4',
        )

        print('Loading DB CONFIG...')
        client = boto3.client('secretsmanager', config=my_config)
        secrets = client.list_secrets(
            Filters=[{'Key': 'name', 'Values': ['WhileTrueCollector']}])

        if (secrets):
            if len(secrets['SecretList']) > 0:
                secret_id = secrets['SecretList'][0]['Name']

                # get secret values
                db_secrets = client.get_secret_value(SecretId=secret_id)
                self.DB_CONFIG = json.loads(db_secrets['SecretString'])
                print('Successfully Load DB config from aws secrets manager')
