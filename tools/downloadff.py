#!/usr/bin/env python

import sys, getopt, time, os, json, importlib
from selenium import webdriver
import copy

OUTPUT_DIR = 'fanfiction/'

def main(argv):
   ff_id = None
   site = None
   driver = webdriver.Chrome('/home/carrie/chromedriver')
   try:
       opts, args = getopt.getopt(argv,"h",["ffnet=","ao3=","update"])
   except getopt.GetoptError:
       print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
       sys.exit(2)
   for opt, arg in opts:
       if opt == '-h':
           print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
           sys.exit()
       elif opt in ("--update"):
           update_all_metadata(driver)
           driver.quit()
           sys.exit()
       elif opt in ("--ffnet"):
           ff_id = arg
           site = importlib.import_module('ffnet')
       elif opt in ("--ao3"):
           ff_id = arg
           site = importlib.import_module('ao3')

   if ff_id is not None and site is not None:
       try:
   	       download_fic(driver, ff_id, site)
       finally:
   	       driver.quit()
   else:
        print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
        sys.exit()

def make_path_if_not_exists(filename):
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

def write_chapter_file(title, chapter, text):
    filename = OUTPUT_DIR + title + '/' + chapter + ".txt"
    make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        f.write(text.encode('utf-8'))

def write_metadata_file(metadata):
    filename = OUTPUT_DIR + metadata['title'] + '/metadata.json'
    make_path_if_not_exists(filename)
    with open(filename, "w") as f:
        json.dump(metadata, f)

def get_metadata(title):
    filename = OUTPUT_DIR + title + '/metadata.json'
    with open(filename, "r") as f:
        return json.loads(f.read())

def update_all_metadata(driver):
    for f in os.listdir(OUTPUT_DIR):
        if f != '.DS_Store':
            meta = get_metadata(f)
            if 'site' not in meta or meta['site'] == "ffnet":
                site = importlib.import_module('ffnet')
            else:
                site = importlib.import_module('ao3')
            url = site.get_story_url(str(meta['id']))
            driver.get(url)
            new_meta = site.get_basic_metadata(driver, meta['id'])
            for key in new_meta:
                if key != 'chapters':
                    meta[key] = new_meta[key]
            write_metadata_file(meta)

def download_fic(driver, ff_id, site):
    url = site.get_story_url(ff_id)
    driver.get(url)
    metadata = site.get_basic_metadata(driver, ff_id)
    print metadata
    write_metadata_file(metadata)
    chp_num = 0
    while(True):
        print "Retrieving chapter " + str(chp_num+1) + " ..."
        chapter_data, text = site.get_chapter_data(driver)
        write_chapter_file(metadata['title'], chapter_data['title'], text)
        metadata['chapters'].append(copy.deepcopy(chapter_data))
        print metadata
        try:
            site.paginate(driver)
            time.sleep(1)
            chp_num += 1
        except:
            print "Finished downloading story."
            write_metadata_file(metadata)
            break;

if __name__ == "__main__":
   main(sys.argv[1:])
