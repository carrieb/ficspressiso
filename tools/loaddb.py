#!/usr/bin/env python

import sys
from pymongo import MongoClient
import json
from datetime import datetime
import copy

mongodb_url = 'mongodb://localhost:27017/fanfic'
db_name = 'fanfic'
collection_name = 'documents'

json_dir = 'output/'

now = datetime.now()
current_year = now.year - 1 # fucking 2017

seen_set = set()

# TODO: read new json files -> insert into DB -> dedub on author / title
def main(argv):
    client = MongoClient(mongodb_url)
    db = client[db_name]
    coll = db[collection_name]

    curr = 0
    bulk = coll.initialize_ordered_bulk_op()
    min_ts = 1454284800 # jan, 1 2016, so we don't need to worry about dupes
    last_ts = 1454284800 + 100 # it doesn't matter what i am, as long as i'm bigger than min_ts
    max_file = 201
    curr_file = 200
    skipped = 0
    while True:
        curr_file_name = json_dir + str(curr_file) + ".json"
        try:
            print "Opening", curr_file_name
            with open(curr_file_name, 'r') as f:
                for line in f:
                    fic = json.loads(line)
                    publish_date = fic['publish_date']

                    # try to parse publish_date (guaranteed to exist)
                    try:
                        published = datetime.strptime(fic['publish_date'], "%b %d")
                        published = published.replace(year=current_year)
                    except ValueError:
                        try:
                            published = datetime.strptime(fic['publish_date'], "%b %d, %Y")
                        except ValueError:
                            published = datetime(2016, 12, 14)
                    publish_ts = int(published.strftime("%s"))
                    #print publish_ts
                    fic['publish_ts'] = publish_ts

                    # handle missing author
                    if fic['author'] == "":
                        # just skip this entry for now
                        # we'll need to go back through json and update
                        #print "Skipping " + str(curr)
                        skipped += 1
                        pass
                    else:
                        # handle bad chracter string
                        try:
                            temp = copy.copy(fic['chracters'])
                            fic['characters'] = temp
                            fic.pop('chracters', None)
                        except KeyError:
                            pass # nothing to do

                        seen_hash = fic['title'] + ' by ' + fic['author']
                        if seen_hash in seen_set:
                            print "DUPE: " + seen_hash
                        else:
                            seen_set.add(seen_hash)

                        bulk.find({
                            'author': fic['author'],
                            'title': fic['title']
                        }).upsert().update({'$set': fic})

                    if curr % 100 == 0:
                        print "Processed %d stories... (%s)" % (curr, curr_file_name)

                    curr += 1
                    last_ts = publish_ts
        except:
            print "error", curr_file_name
            break
        curr_file += 1
        if (curr_file > max_file):
            print curr_file
            break
    try:
        res = bulk.execute()
        print res
        print "Skipped", skipped
    except:
        print "error"

if __name__ == "__main__":
   main(sys.argv[1:])
