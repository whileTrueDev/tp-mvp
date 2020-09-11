from botocore.config import Config
from dotenv import load_dotenv
import os
import boto3
import json

class ConfigController:

    def __init__(self):
        dirpath = os.path.dirname(os.path.abspath(__file__))
        load_dotenv(dotenv_path=os.path.join(dirpath, ".env"), verbose=True)
        self.AFREECA_ID = os.getenv('AFREECA_ID')
        self.AFREECA_PASSWORD = os.getenv('AFREECA_PASSWORD')

    def load_dbconfig_from_aws_secrets_manager(self):
        self.REGION_NAME = 'ap-northeast-2'
        self.AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
        self.AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

        my_config = Config(
            region_name=self.REGION_NAME,
            signature_version='v4',
        )

        client = boto3.client('secretsmanager', config=my_config)
        secrets = client.list_secrets(
            Filters=[{'Key': 'name', 'Values': ['WhileTrueCollector']}]
        )
        
        if (secrets):
            if len(secrets['SecretList']) > 0:
                secret_id = secrets['SecretList'][0]['Name']
                db_secrets = client.get_secret_value(SecretId=secret_id)
                self.DB_CONFIG = json.loads(db_secrets['SecretString'])

