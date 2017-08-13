#!/usr/bin/env python

import sys, json, os, time, datetime
from selenium import webdriver
import ffnet
import util
import pprint as pp
from crawler import Crawler

MAX_FILE_SIZE = 1024 * 1024 * 4

current_file_num = 0
initial_page = 1

last_timestamp = None
last_update_timestamp = None

# All Ratings, Sort by publish date, only English
base_publish_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=2&lan=1&r=10"
# All Ratings, Sort by update date, only English
base_updates_url = "https://www.fanfiction.net/book/Harry-Potter/?&srt=1&lan=1&r=10"

crawler_status_path = "/Users/carolyn/projects/ficspressiso/tools/crawler_status.json"
crawler_output_path = "/Users/carolyn/projects/ficspressiso/tools/output/"

def tsstr(ts):
    return datetime.datetime.fromtimestamp(ts).strftime("%x %X")

def update_stop(metas, page):
    if page is 1:
        print "PAGE 1"
    print metas[-1]['publish_date']
    print last_timestamp
    print metas[-1]['publish_date'] < last_timestamp - 360
    return metas[-1]['publish_date'] < last_timestamp - 360

def main(argv):
    #phantomjs_options = ["--load-images=false", "--max-disk-cache-size=512"]
    load_crawler_status()
    update_crawler = Crawler(crawler_output_path + 'updates', base_updates_url, update_stop)
    update_crawler.crawl()
    print update_crawler
    try:
        most_recent_publish = crawl(driver, base_publish_url, 'new', 'publish_date', lambda ts: ts < last_timestamp - 360)
        #write status now so we don't lose history if update fails
        write_crawler_status(most_recent_publish, last_update_timestamp)
        most_recent_update = crawl(driver, base_updates_url, 'updates', 'update_date', lambda ts: ts < last_update_timestamp - 360)
        print "Processed up to: (update) %s and (publish) %s" % (tsstr(most_recent_publish), tsstr(most_recent_update))
        write_crawler_status(most_recent_publish, most_recent_update)
    except:
        print "Unexpected error:", sys.exc_info()[0]
    finally:
        driver.quit()

def load_crawler_status():
    print "Loading previous crawler status from %s" % crawler_status_path
    global last_timestamp, last_update_timestamp
    with open(crawler_status_path, 'r') as f:
        crawler_status = json.loads(f.read())
        last_timestamp = crawler_status['last_timestamp']
        last_update_timestamp = crawler_status['last_update_timestamp']
        print "[Success] Most recent crawl processed up to %s [publish] and %s [update]" % (tsstr(last_timestamp), tsstr(last_update_timestamp))

def crawl(driver, base_url, output_dir, ts_field, should_stop):
    page_num = initial_page

    global current_file_num
    current_file_num = 0
    if not os.path.exists(current_file(output_dir)):
        initialize_metadata_file(current_file(output_dir))

    f = open(current_file(output_dir), 'a')
    stop = False
    most_recent = None
    while not stop:
        metas = process_page(driver, base_url, page_num, f)
        #pp.pprint(metas);

        if page_num is 1:
            print "New most recent %s is %s" % (ts_field, tsstr(metas[0][ts_field]))
            most_recent = metas[0][ts_field]
        last_ts = metas[-1][ts_field]
        print "\tLast %s seen was %s" % (ts_field, tsstr(last_ts))
        #print last_ts

        #print "\tProcessed %d fics up to %s" % (len(metas), datetime.datetime.fromtimestamp(last_ts).strftime("%b %d %Y"))

        stop = should_stop(last_ts)
        #print stop, last_update_timestamp
        if (stop):
            break;
        else:
            page_num+=1
            time.sleep(.5)

            if not os.path.exists(current_file(output_dir)):
                initialize_metadata_file(current_file(output_dir))

                if not os.path.exists(current_file()) or os.path.getsize(current_file(output_dir)) > MAX_FILE_SIZE:
                    f.close()
                    current_file_num+=1
                    initialize_metadata_file(current_file(output_dir))
                    f = open(current_file(output_dir), 'a')

    #write_crawler_status(most_recent_publish)
    print "Complete"
    return most_recent

    # two cronjobs
    # 1) (this) runs the crawler, writes crawler_status.json (turned ON)
    # 2) (loaddb) opens up output json, reads into db, deletes old files (TODO)

def process_page(driver, base_url, page_num, f):
    url = base_url + page_query(page_num)
    print "[%s] %s Requesting %s.." % (page_num, time.strftime('%Y-%m-%d %H:%M'), url)

    start = time.time() * 1000
    driver.get(url)
    end = time.time() * 1000
    print "\t[Success] in %d ms" % (end - start)

    metadata = ffnet.get_story_metadata_from_list(driver)
    #pp.pprint(metadata)
    write_metadata(metadata, f)

    #last_publish = metadata[-1]['publish_date']

    # todo: put in update func that we pass in?
    #global most_recent_publish
    #if (page_num == 1):
        #most_recent_publish = metadata[0]['publish_date']
    return metadata

    #should_stop = # last_publish < last_timestamp - (60 * 60) # before last timestamp with 1 hour buffer
    #print should_stop, last_publish, last_timestamp
    #return not should_stop

# quick utils

def current_file(output_dir):
    today = time.strftime('%Y-%m-%d')
    return crawler_output_path + output_dir + '/' + today + '/' + str(current_file_num) + '.json'

def page_query(num):
    return "&p="+str(num)

# file writes

# makes path and clears out filename with empty file
def initialize_metadata_file(filename):
    util.make_path_if_not_exists(filename)

def write_metadata(metadata, f):
    for meta in metadata:
        json.dump(meta, f)
        f.write("\n")

def write_crawler_status(most_recent_publish, most_recent_update):
    with open(crawler_status_path, 'w') as f:
        crawler_status = { "last_timestamp" : most_recent_publish, "last_update_timestamp" : most_recent_update }
        json.dump(crawler_status, f)

if __name__ == "__main__":
   main(sys.argv[1:])
