from selenium.webdriver.support.ui import Select

def get_story_url(ff_id):
    return "http://www.fanfiction.net/s/"+str(ff_id)

def fill_in_raw_data(driver, metadata):
    raw_data_el = driver.find_element_by_css_selector("#profile_top span.xgray")
    raw_data = raw_data_el.text
    split = raw_data.split(' - ')
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
    field, value = map(lambda s: s.strip(), item.split(':'))
    if field == "Rated":
        metadata['rating'] = value.replace("Fiction ", "")
    if field == "Chapters":
        metadata['chapter_cnt'] = int(value.replace(',', ''))
        metadata['chapters'] = []
    if field == "Words":
        metadata['word_cnt'] = int(value.replace(',', ''))
    if field == "Reviews":
        metadata['review_cnt']= int(value.replace(',', ''))
    if field == "Favs":
        metadata['fav_cnt'] = int(value.replace(',', ''))
    if field == "Follows":
        metadata['follow_cnt'] = int(value.replace(',', ''))
    if field == "Status":
        metadata['status'] = value
    # TODO: convert these to ISO dates
    if field == "Published":
        metadata['publish_date'] = value
    if field == "Updated":
        metadata['update_date'] = value

def get_fandoms(driver):
    fandom_cont_els = driver.find_elements_by_css_selector('#pre_story_links a');
    most_desc_fandom = fandom_cont_els[-1]
    return [most_desc_fandom.text]

def get_title(driver):
    title_el = driver.find_element_by_css_selector("#profile_top b.xcontrast_txt")
    return title_el.text

def get_author(driver):
    author_el = driver.find_element_by_css_selector('#profile_top a.xcontrast_txt[href*="/u/"]')
    return author_el.text

def get_author_url(driver):
    author_el = driver.find_element_by_css_selector('#profile_top a.xcontrast_txt[href*="/u/"]')
    return author_el.get_attribute('href')

def get_summary(driver):
    summary_el = driver.find_element_by_css_selector("#profile_top div.xcontrast_txt")
    return summary_el.text

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
    print metadata
    return metadata

def get_chapter_data(driver, data = {}):
    chp_dropdown_el = driver.find_element_by_id("chap_select")
    chp_select = Select(chp_dropdown_el)
    data['title'] = chp_select.all_selected_options[0].text

    chapter_text_el = driver.find_element_by_id("storytext")
    chapter_text = chapter_text_el.text
    data['word_cnt'] = len(chapter_text.split())
    return data, chapter_text

def paginate(driver):
    next_btn = driver.find_element_by_xpath('//button[text()="Next >"]')
    next_btn.click()
