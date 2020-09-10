from src.main import TwitchCollector

if __name__ == "__main__":
    import sys
    crawler = TwitchCollector()
    crawler.run()
    crawler.exit()
