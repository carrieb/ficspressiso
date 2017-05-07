#!/usr/bin/env python

import sys
from selenium import webdriver
import ffnet
import util
import pprint as pp
import json
import os
import time

MAX_FILE_SIZE = 1024 * 1024 * 4
current_file_num = 200

# All Ratings, Sort by publish date, only English
base_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"
initial_page = 9674

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
        print os.path.getsize(current_file())
        if os.path.getsize(current_file()) > MAX_FILE_SIZE:
            f.close()
            current_file_num+=1
            initialize_metadata_file(current_file())
            f = open(current_file(), 'a')


def process_page(driver, page_num, f):
    start = time.time()
    url = base_url + page_query(page_num)
    print "Requesting %s" % url
    start = time.time()
    driver.get(url)
    end = time.time()
    print end - start, 'seconds'
    metadata = ffnet.get_story_metadata_from_list(driver)
    pp.pprint(metadata)
    write_metadata(metadata, f)
    next_url = base_url + page_query(page_num + 1)
    last_btn = driver.find_element_by_css_selector("center a:last-child")
    last_publish = metadata[-1]['publish_date']
    stop = last_publish.startswith('May') and last_publish.endswith('2010')
    return not stop
    #return last_btn.get_attribute('href') == next_url # has next

def initialize_metadata_file(filename):
    util.make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        # nothing
        return

def current_file():
    return 'output/' + str(current_file_num) + '.json'

def page_query(num):
    return "&p="+str(num)

def write_metadata(metadata, f):
    for meta in metadata:
        json.dump(meta, f)
        f.write("\n")

if __name__ == "__main__":
   main(sys.argv[1:])
