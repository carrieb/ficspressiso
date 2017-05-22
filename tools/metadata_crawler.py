#!/usr/bin/env python

import sys, json, os, time, datetime
from selenium import webdriver
import ffnet
import util
import pprint as pp

MAX_FILE_SIZE = 1024 * 1024 * 4
current_file_num = 0
initial_page = 0
most_recent_publish = None
last_timestamp = None

# All Ratings, Sort by publish date, only English
base_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"

crawler_status_path = "/Users/carolyn/projects/ficspressiso/tools/crawler_status.json"
print "Loading previous crawler status.."
with open(crawler_status_path, 'r') as f:
    crawler_status = json.loads(f.read())
    last_timestamp = crawler_status['last_timestamp']
    print "[Success] Most recent crawl processed up to %s" % datetime.datetime.fromtimestamp(last_timestamp).strftime("%x %X")

def main(argv):
    options = ["--load-images=false"]
    driver = webdriver.PhantomJS('/usr/local/bin/phantomjs', service_args=options)
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

        if os.path.getsize(current_file()) > MAX_FILE_SIZE:
            f.close()
            current_file_num+=1
            initialize_metadata_file(current_file())
            f = open(current_file(), 'a')

    write_crawler_status(most_recent_publish)
    print "Complete"

    # two cronjobs
    # 1) (this) runs the crawler, writes crawler_status.json (turned ON)
    # 2) (loaddb) opens up output json, reads into db, deletes old files (TODO)

def process_page(driver, page_num, f):
    url = base_url + page_query(page_num)
    print "[%s] Requesting %s.." % (page_num, url)

    start = time.time()
    driver.get(url)
    end = time.time()
    print "\t[Success] in %d seconds" % (end - start)

    metadata = ffnet.get_story_metadata_from_list(driver)
    #pp.pprint(metadata)
    write_metadata(metadata, f)

    last_publish = metadata[-1]['publish_date']

    global most_recent_publish
    if (page_num == 1):
        most_recent_publish = metadata[0]['publish_date']

    should_stop = last_publish < last_timestamp - (60 * 60) # before last timestamp with 1 hour buffer
    #print should_stop, last_publish, last_timestamp
    print "\tProcessed %d fics up to %s" % (len(metadata), datetime.datetime.fromtimestamp(last_publish).strftime("%b %d %Y"))
    return not should_stop

# quick utils

def current_file():
    today = time.strftime('%Y-%m-%d')
    return 'output/' + today + '/' + str(current_file_num) + '.json'

def page_query(num):
    return "&p="+str(num)

# file writes

# makes path and clears out filename with empty file
def initialize_metadata_file(filename):
    util.make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        # nothing
        return

def write_metadata(metadata, f):
    for meta in metadata:
        json.dump(meta, f)
        f.write("\n")

def write_crawler_status(most_recent_publish):
    with open('./crawler_status.json', 'w') as f:
        crawler_status = { "last_timestamp" : most_recent_publish }
        json.dump(crawler_status, f)

if __name__ == "__main__":
   main(sys.argv[1:])
