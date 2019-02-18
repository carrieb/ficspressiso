#!/usr/bin/env python

import sys, getopt, os, json, importlib, time, codecs
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

OUTPUT_DIR = 'fanfiction/'
VERBOSE = False

def main(argv):
    ff_id = None
    site = None
    global OUTPUT_DIR
    global VERBOSE

    driver_options = ChromeOptions();
    driver_options.add_argument("--headless");
    driver = webdriver.Chrome(
        '/Users/carolyn/projects/ficspressiso/tools/chromedriver',
        chrome_options=driver_options
    )

    try:
        opts, args = getopt.getopt(argv, "hv", ["ffnet=", "ao3=", "update", "help", "out=", "verbose"])
    except getopt.GetoptError:
        print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h' or opt == '--help':
            print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
            sys.exit()
        elif opt == '-v' or opt == '--verbose':
            VERBOSE = True
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
        elif opt == '--out':
            print arg
            OUTPUT_DIR = arg
            make_path_if_not_exists(OUTPUT_DIR)

    if ff_id is not None and site is not None:
        try:
            download_fic(driver, ff_id, site)
        finally:
            driver.quit()
    else:
        print argv
        print 'downloadff --ffnet <ffnet_id> | --ao3 <ao3_id>'
        sys.exit()


def make_path_if_not_exists(filename):
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:  # Guard against race condition
            if exc.errno != OSError.errno.EEXIST:
                raise


def write_chapter_file(title, chapter, text):
    filename = OUTPUT_DIR + title + '/' + chapter + ".txt"
    print "Writing out to %s" % filename.encode('utf-8')
    sys.stdout.flush()
    make_path_if_not_exists(filename)

    doublespaced = text.replace('\n', '\n\n')

    with codecs.open(filename, "w", "utf-8") as f:
        f.write(doublespaced)


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


def write_html_record(ff_id, chp_num, driver):
    html = driver.page_source
    filename = 'tmp/%s/%s/%d' % (time.strftime('%Y-%m-%d'), ff_id, chp_num)
    make_path_if_not_exists(filename)
    with codecs.open(filename, "w", "utf-8") as f:
        f.write(html)


def download_fic(driver, ff_id, site):
    url = site.get_story_url(ff_id)
    chp_num = 1
    metadata = {}
    driver.get(url)

    while True:
        print "Retrieved chapter " + str(chp_num) + " ..."
        sys.stdout.flush()
        write_html_record(ff_id, chp_num, driver)

        if not metadata:
            metadata = site.get_basic_metadata(driver, ff_id)
            if (VERBOSE):
                print json.dumps(metadata, sort_keys=True, indent=4)
            write_metadata_file(metadata)

        chapter_data, chapter_text = site.get_chapter_data(driver)
        write_chapter_file(metadata['title'], chapter_data['title'], chapter_text)
        metadata['chapters'].append(chapter_data)

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
