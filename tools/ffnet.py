from selenium.webdriver.support.ui import Select
import pprint as pp
import re

def get_story_url(ff_id):
    return "http://www.fanfiction.net/s/"+str(ff_id)

def fill_in_raw_data(driver, metadata):
    raw_data_el = driver.find_element_by_css_selector("#profile_top span.xgray")
    raw_data = raw_data_el.get_attribute('innerHTML')
    split = raw_data.split(' - ')
    #print split
    for i in range(len(split)):
        item = split[i].strip()
        #print i, item
        if ':' in item:
            update_count(item, metadata)
        else:
            if item == "English":
                continue # don't care about language
            if i < 3:
                update_genre(item, metadata)
            else:
                update_chars(item, metadata)

def parse_fields(metadata_string, metadata):
    split = metadata_string.split(' - ')
    for i in range(len(split)):
        item = split[i].strip()
        #print i, item
        if ':' in item:
            update_count(item, metadata)
        else:
            if item == "English":
                continue # don't care about language
            if item == "Complete":
                continue # don't care about completion
            if i < 3:
                update_genre(item, metadata)
            else:
                update_chars(item, metadata)
    return metadata

def update_genre(item, metadata):
    metadata['genres'] = []
    item = item.replace('Hurt/Comfort', 'Hurt-Comfort') #special case stupid genre
    genre_names = map(lambda s: s.strip(), item.split('/'))
    for g_name in genre_names:
        metadata['genres'].append(g_name)

def update_chars(item, metadata):
    metadata['chars'] = []
    item = item.replace('] [',',').replace(']', ',', 1).replace(']', '').replace('[','')
    chars = map(lambda s: s.strip(), item.split(','))
    for c_name in chars:
		if len(c_name) > 0:
			metadata['chars'].append(c_name);

def update_count(item, metadata):
    # Special case rating
    field, value = map(lambda s: s.strip(), item.split(':', 1))
    if field == "Rated":
        metadata['rating'] = value.replace("Fiction ", "")
    if field == "Chapters":
        metadata['chapter_cnt'] = int(value.replace(',', ''))
        metadata['chapters'] = []
    if field == "Words":
        metadata['word_cnt'] = int(value.replace(',', ''))
    #if field == "Reviews":
    #    metadata['review_cnt']= int(value.replace(',', ''))
    if field == "Favs":
        metadata['fav_cnt'] = int(value.replace(',', ''))
    if field == "Follows":
        metadata['follow_cnt'] = int(value.replace(',', ''))
    if field == "Status":
        metadata['status'] = value
    # TODO: convert these to ISO dates
    if field == "Published":
        metadata['publish_date'] = get_published_ts(value)
    if field == "Updated":
        metadata['update_date'] = value

published_ts_p = re.compile(r'data-xutime="(?P<published_ts>[0-9]+)"')
def get_published_ts(raw_string):
    #print published_ts_p.pattern, raw_string
    published_ts_match = published_ts_p.search(raw_string)
    #print published_ts_match.group('published_ts')
    return int(published_ts_match.group('published_ts'))

def get_fandoms(driver):
    fandom_cont_els = driver.find_elements_by_css_selector('#pre_story_links a');
    #print fandom_cont_els
    most_desc_fandom = fandom_cont_els[-1]
    return [most_desc_fandom.text]

def get_title(driver):
    title_el = driver.find_element_by_css_selector("#profile_top b")
    return title_el.text

def get_author(driver):
    author_el = driver.find_element_by_css_selector('a[href*="/u/"]')
    return author_el.text

def get_author_url(driver):
    author_el = driver.find_element_by_css_selector('a[href*="/u/"]')
    return author_el.get_attribute('href')

def get_summary(driver):
    summary_el = driver.find_element_by_css_selector("#profile_top div.xcontrast_txt")
    return summary_el.text

id_p = re.compile(r'/s/(?P<id>[0-9]+)/')
def get_id(url):
    id_m = id_p.search(url);
    #print id_m, id_m.group('id');
    return int(id_m.group('id'))

def get_story_metadata_from_list(driver):
    title_els = driver.find_elements_by_css_selector(".stitle");
    author_els = driver.find_elements_by_css_selector('a[href*="/u/"]')
    metadata_els = driver.find_elements_by_css_selector(".z-padtop2.xgray")
    if len(title_els) is not len(author_els) or len(metadata_els) is not len(title_els):
        return []
    metadata = []
    for i in range(len(metadata_els)):
        parsed_fields = parse_fields(metadata_els[i].get_attribute('innerHTML'), {})

        url = title_els[i].get_attribute('href')
        id = get_id(url)
        meta = {
            'site': 'ffnet',
            'title': title_els[i].text,
            'url': url,
            'id': id,
            'author': author_els[i].text,
            'author_url': author_els[i].get_attribute('href'),
            'characters': parsed_fields['chars'] if 'chars' in parsed_fields else [],
            'genres': parsed_fields['genres'] if 'genres' in parsed_fields else [],
            'rating': parsed_fields['rating'],
            'word_cnt': parsed_fields['word_cnt'],
            'chapter_cnt': parsed_fields['chapter_cnt'],
            'review_cnt': parsed_fields['review_cnt'] if 'review_cnt' in parsed_fields else 0,
            'fav_cnt': parsed_fields['fav_cnt'] if 'fav_cnt' in parsed_fields else 0,
            'follow_cnt': parsed_fields['follow_cnt'] if 'follow_cnt' in parsed_fields else 0,
            'publish_date': parsed_fields['publish_date']
        }
        #pp.pprint(meta)
        metadata.append(meta)
    return metadata

def get_basic_metadata(driver, ff_id, metadata = {}):
    metadata['site'] = "ffnet"
    metadata['id'] = int(ff_id)
    metadata['fandoms'] = get_fandoms(driver)
    metadata['title'] = get_title(driver)
    metadata['summary'] = get_summary(driver)
    metadata['author'] = get_author(driver)
    metadata['author_url'] = get_author_url(driver)
    metadata['chapters'] = []
    metadata['url'] = get_story_url(ff_id)
    fill_in_raw_data(driver, metadata)
    return metadata

def get_chapter_data(driver, metadata):
    chapter_data = {}

    # get all chapters
    try:
        chp_dropdown_el = driver.find_element_by_id("chap_select")
        chp_select = Select(chp_dropdown_el)
        chapter_data['title'] = chp_select.all_selected_options[0].text
        #print chp_select.all_selected_options[0].text
    except:
        chapter_data['title'] = metadata['title']

    # get chapter content and determine word length
    chapter_text_el = driver.find_element_by_id("storytext")
    chapter_text = chapter_text_el.text
    chapter_data['word_cnt'] = len(chapter_text.split())
    return chapter_data, chapter_text

def paginate(driver):
    next_btn = driver.find_element_by_xpath('//button[text()="Next >"]')
    next_btn.click()
