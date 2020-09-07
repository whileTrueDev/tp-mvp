from botocore.config import Config
from detenv import load_dotenv
import os
import boto3
import json

# class ConfigController:
#     environmnet = ''

#     def __init__(self):
#         # dirpath = os.path.dirname(os.path.abspath(__file__))
#         load_dotenv(dotenv_path=r"C:\Users\WHILETRUESECOND\Desktop\tp-mvp\collectors\afreecatv\crawler\crawler\.env", verbose=True)
        
#     def load(self):
#         self.DB_HOST = os.getenv('DB_HOST')
#         self.DB_NAME = os.getenv('DB_NAME')
#         self.DB_USER = os.getenv('DB_USER')
#         self.DB_PASSWORD = os.getenv('DB_PASSWORD')
#         self.DB_PORT = int(os.getenv('DB_PORT'))
#         self.AFREECA_ID = os.getenv('AFREECA_ID')
#         self.AFREECA_PASSWORD = os.getenv('AFREECA_PASSWORD')
#         self.DB_DRIVER = os.getenv('DB_DRIVER')

class ConfigController:

    def __init__(self):
        dirpath = os.path.dirname(os.path.abspath(__file__))
        load_dotenv(dotenv_path=os.path.join(dirpath, r"\.env"), verbose=True)
        self.AFREECA_ID = os.getenv('AFREECA_ID')
        self.AFREECA_PASSWORD = os.getenv('AFREECA_PASSWORD')

    def load_dbconfig_from_aws_secrets_manager(self):
        self.__REGION_NAME = 'ap-northeast-2'
        self.__AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
        self.__AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

        my_config = Config(
            region_name=self.__REGION_NAME,
            signature_version='v4',
        )

        client = boto3.client('secretsmanager', config=my_config)
        secrets = client.list_secrets(
            Filters=[{'Key': 'name', 'Values': ['WhileTrueCollectors']}]
        )

        if (secrets):
            if len(secrets['SecretList']) > 0:
                secret_id = secrets['SecretList'][0]['Name']

                #get secret values
                db_secrets = client.get_secret_value(SecretId=secret_id)
                self.DB_CONFIG = json.loads(db_secrets['SecretString'])

