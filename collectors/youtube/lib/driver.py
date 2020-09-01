
from selenium import webdriver as wd


class Driver:
    def __init__(self):

        # Headless
        options = wd.ChromeOptions()
        options.add_argument('headless')
        options.add_argument('window-size=1920x1080')
        options.add_argument("disable-gpu")
        options.add_argument("lang=ko_KR")

        # UserAgent
        options.add_argument('''user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6)
                          AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36''')

        self.options = options

    def get(self):
        driver = wd.Chrome(
            'C:/Users/dn020/Desktop/TRUEPOINT/tp-mvp/collectors/youtube-py/chromedriver.exe', options=self.options)
        return driver
