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
    crawler = Crawler(output, base_publish_url, stop, initial_file=4, initial_page=1600, backwards=True)
    crawler.crawl()

if __name__ == "__main__":
   main(sys.argv[1:])
