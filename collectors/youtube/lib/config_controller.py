import os
from dotenv import load_dotenv


class ConfigController:
    environment = ''

    def __init__(self):
        self.environment = os.getenv('PYTHON_ENV')

    def init(self):
        load_dotenv(verbose=True)

    def load(self):
        self.DB_HOST = os.getenv('DB_HOST')
        self.DB_USER = os.getenv('DB_USER')
        self.DB_PASSWORD = os.getenv('DB_PASSWORD')
        self.DB_DATABASE = os.getenv('DB_DATABASE')
        self.DB_CHARSET = os.getenv('DB_CHARSET')
        self.DB_PORT = os.getenv('DB_PORT')
