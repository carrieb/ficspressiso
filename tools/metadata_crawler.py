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
current_file_num = 0

def initialize_metadata_file(filename):
    util.make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        # nothing
        return

def current_file():
    return 'output/' + str(current_file_num) + '.json'

initialize_metadata_file(current_file())

def page_query(num):
    return "&p="+str(num)

def main(argv):
    driver = webdriver.Chrome('/usr/bin/chromedriver')

    try:
        crawl(driver)
    finally:
        driver.quit()

base_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"

def process_page(driver, page_num):
    url = base_url + page_query(page_num)
    driver.get(url)
    metadata = ffnet.get_story_metadata_from_list(driver)
    pp.pprint(metadata)
    write_metadata(metadata)
    next_url = base_url + page_query(page_num + 1)
    last_btn = driver.find_element_by_css_selector("center a:last-child")
    return last_btn.get_attribute('href') == next_url # has next

def crawl(driver):
    page_num = 1
    while(process_page(driver, page_num)):
        print page_num
        page_num+=1
        time.sleep(.75)

def write_metadata(metadata, max_file_size = MAX_FILE_SIZE):
    global current_file_num
    filename = 'output/' + str(current_file_num) + '.json'
    if os.path.getsize(filename) > max_file_size:
        current_file_num+=1
        initialize_metadata_file(current_file())
    with open(filename, "a") as f:
        for meta in metadata:
            json.dump(meta, f)
            f.write("\n")

if __name__ == "__main__":
   main(sys.argv[1:])
