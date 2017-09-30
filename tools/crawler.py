import os, time, json
import util
import ffnet

from selenium import webdriver

MAX_FILE_SIZE = 1024 * 1024 * 4

class Crawler:
    def __init__(self, output_dir, base_url, stop_func, initial_file=0, initial_page=1, backwards=False):
        chop = webdriver.ChromeOptions()
        chop.add_extension('/Users/carolyn/projects/ficspressiso/tools/adblockpluschrome-1.8.3.crx')
        prefs = { "profile.managed_default_content_settings.images": 2 }
        chop.add_experimental_option("prefs", prefs)
        driver = webdriver.Chrome('/usr/local/bin/chromedriver', chrome_options = chop)
        self.driver = driver

        self.output_dir = output_dir
        self.base_url = base_url
        self.stop_func = stop_func
        self.curr_file = initial_file
        self.curr_page = initial_page
        self.backwards = backwards

    def __str__(self):
        return "{ output:%s, base_url:%s, curr_file:%d, curr_page:%d, backwards:%s }" % (self.output_dir, self.base_url, self.curr_file, self.curr_page, self.backwards)

    def current_file(self):
        today = time.strftime('%Y-%m-%d')
        return self.output_dir + '/' + today + '/' + str(self.curr_file) + '.json'

    def current_url(self):
        return self.base_url + "&p="+str(self.curr_page)

    def write_metas(self, metas, f):
        for meta in metas:
            json.dump(meta, f)
            f.write("\n")

    def crawl(self):
        current_file = self.current_file()
        util.make_path_if_not_exists(current_file)

        f = open(current_file, 'a')
        stop = False
        while not stop:
            metas = self.process_page(f)
            stop = self.stop_func(metas, self.curr_page)
            current_size = os.path.getsize(current_file)

            if not stop:
                if current_size > MAX_FILE_SIZE:
                    f.close()
                    self.curr_file += 1
                    current_file = self.current_file()
                    util.make_path_if_not_exists(current_file)
                    f = open(current_file, 'a')
                if self.backwards:
                    self.curr_page -= 1
                else:
                    self.curr_page += 1
                time.sleep(.5)

    def process_page(self, f):
        url = self.current_url()
        print "[%s] %s Requesting %s.." % (self.curr_page, time.strftime('%Y-%m-%d %H:%M'), url)

        start = time.time() * 1000
        self.driver.get(url)
        end = time.time() * 1000
        print "\t[Success] in %d ms" % (end - start)

        metas = ffnet.get_story_metadata_from_list(self.driver)
        self.write_metas(metas, f)
        return metas
