#!/usr/bin/env python

import sys
from selenium import webdriver
import ffnet
import util
import pprint as pp
import json
import os
import time
import datetime

MAX_FILE_SIZE = 1024 * 1024 * 4
current_file_num = 0

# All Ratings, Sort by publish date, only English
base_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"
initial_page = 0

def main(argv):
    #driver = webdriver.Chrome('/usr/bin/chromedriver')
    options = ["--load-images=false"]
    driver = webdriver.PhantomJS(service_args=options)
    try:
        crawl(driver)
    finally:
        driver.quit()


def crawl(driver):
    page_num = initial_page

    global current_file_num
    if not os.path.exists(current_file()):
        initialize_metadata_file(current_file())

    f = open(current_file(), 'a')
    while(process_page(driver, page_num, f)):
        page_num+=1
        time.sleep(.5)

        #print os.path.getsize(current_file())
        if os.path.getsize(current_file()) > MAX_FILE_SIZE:
            f.close()
            current_file_num+=1
            initialize_metadata_file(current_file())
            f = open(current_file(), 'a')

    # TODO: 
    # two cronjobs
    # 1) (this) runs the crawler, writes crawler_status.json
    # 2) (loaddb) opens up output json, reads into db, deletes old files

last_timestamp = None
with open('./crawler_status.json', 'r') as f:
    crawler_status = json.loads(f.read())
    last_timestamp = crawler_status['last_timestamp']
print last_timestamp

def process_page(driver, page_num, f):
    url = base_url + page_query(page_num)
    print "Requesting %s" % url
    start = time.time()
    driver.get(url)
    end = time.time()
    print end - start, 'seconds'
    metadata = ffnet.get_story_metadata_from_list(driver)
    #pp.pprint(metadata)
    write_metadata(metadata, f)
    next_url = base_url + page_query(page_num + 1)

    last_btn = driver.find_element_by_css_selector("center a:last-child")
    last_publish = metadata[-1]['publish_date']
    # TODO: determine this based off of a crawler_status.json ?
    should_stop = last_publish < last_timestamp - (60 * 60) # before last timestamp with 1 hour buffer
    print "Processed up to %s" % datetime.datetime.fromtimestamp(last_publish).strftime("%b %d %Y")
    #print should_stop, last_publish, last_timestamp
    return not should_stop
    #return last_btn.get_attribute('href') == next_url # has next

def initialize_metadata_file(filename):
    util.make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        # nothing
        return

def current_file():
    today = time.strftime('%Y-%m-%d')
    return 'output/' + today + '/' + str(current_file_num) + '.json'

def page_query(num):
    return "&p="+str(num)

def write_metadata(metadata, f):
    for meta in metadata:
        json.dump(meta, f)
        f.write("\n")

if __name__ == "__main__":
   main(sys.argv[1:])
