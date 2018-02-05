import selenium.common.exceptions as ex


def get_story_url(ff_id):
    return "http://archiveofourown.org/works/" + ff_id


def paginate(driver):
    next_btn = driver.find_element_by_css_selector(".chapter.next a")
    next_btn.click()


def get_basic_metadata(driver, ff_id, metadata={}):
    try:
        proceed_button = driver.find_element_by_css_selector('a[href*="view_adult"]')
        proceed_button.click();
    except ex.NoSuchElementException:
        pass

    metadata['site'] = "ao3"
    metadata['id'] = int(ff_id)
    metadata['fandoms'] = get_fandoms(driver)
    metadata['title'] = get_title(driver)
    metadata['author'] = get_author(driver)
    metadata['summary'] = get_summary(driver)
    metadata['chapters'] = []
    metadata['characters'] = get_characters(driver)
    metadata['word_cnt'] = get_words(driver)
    metadata['chapter_cnt'] = get_chapters(driver)

    # TODO: convert these to ISO dates
    metadata['publish_date'] = get_published(driver)
    metadata['update_date'] = get_updated(driver)

    metadata['rating'] = get_rating(driver)

    # no notion of genre on ao3?? tags fill in i guess
    # TODO: comments, kudos, bookmarks,

    return metadata


def get_rating(driver):
    rating_el = driver.find_element_by_css_selector("dd.rating a")
    return rating_el.text


def get_published(driver):
    published_el = driver.find_element_by_css_selector("dd.published")
    return published_el.text


def get_updated(driver):
    updated_el = driver.find_element_by_css_selector("dd.status")
    return updated_el.text


def get_chapters(driver):
    chapters_el = driver.find_element_by_css_selector("dd.chapters")
    current, total = chapters_el.text.split("/")
    # TODO: process total
    return int(current)


def get_words(driver):
    words_el = driver.find_element_by_css_selector("dd.words")
    return int(words_el.text)


def get_characters(driver):
    character_els = driver.find_elements_by_css_selector("dd.character a")
    return map(lambda el: el.text, character_els)


def get_fandoms(driver):
    fandom_els = driver.find_elements_by_css_selector("dd.fandom a")
    return map(lambda el: el.text, fandom_els)


def get_title(driver):
    title_el = driver.find_element_by_css_selector("h2.title")
    return title_el.text


def get_author(driver):
    author_el = driver.find_element_by_css_selector('a[rel="author"]')
    return author_el.text


def get_summary(driver):
    summary_el = driver.find_element_by_css_selector("div.summary blockquote")
    return summary_el.text


def get_chapter_data(driver, data={}):
    chapter_el = driver.find_element_by_css_selector(".chapter .title")
    data['title'] = chapter_el.text

    chapter_text_el = driver.find_element_by_css_selector("div.userstuff")
    chapter_text = chapter_text_el.text
    data['word_cnt'] = len(chapter_text.split())
    return data, chapter_text
