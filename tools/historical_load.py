#!/usr/bin/env python

import sys
from crawler import Crawler
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

base_publish_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"
output = '/Users/carolyn/projects/ficspressiso/tools/output/backfill/'

def stop(metas, page):
    # TODO: pass in date from argv
    return False

def main(argv):
    chop = webdriver.ChromeOptions()
    chop.add_extension('/Users/carolyn/projects/ficspressiso/tools/adblockpluschrome-1.8.3.crx')
    prefs = { "profile.managed_default_content_settings.images": 2 }
    chop.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome('/usr/local/bin/chromedriver', chrome_options = chop)
    crawler = Crawler(driver, output, base_publish_url, stop, initial_file=0, initial_page=970, backwards=True)
    print crawler
    crawler.crawl()

if __name__ == "__main__":
   main(sys.argv[1:])
