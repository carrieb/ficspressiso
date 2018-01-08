#!/usr/bin/env python

import sys, copy, json, os
from pymongo import MongoClient, UpdateOne
from datetime import datetime
import pprint as pp
import util

mongodb_url = 'mongodb://localhost:27017/fanfic'
db_name = 'fanfic'
collection_name = 'docs'

json_dir = '/home/carrie/Desktop/projects/ficspressiso/tools/output/'
archive_dir = '/home/carrie/Desktop/projects/ficspressiso/tools/archive/'

curr_blob = 0
skipped = 0

bulk_ops = []

# TODO: read new json files -> insert into DB -> dedub on author / title
def main(argv):
    client = MongoClient(mongodb_url)
    db = client[db_name]
    coll = db[collection_name]
    global bulk_ops

    for folder, subfolders, files in os.walk(json_dir, topdown=False):
        for subfolder in subfolders:
            process_all_json_blobs_in_dir(os.path.join(folder, subfolder), coll, False)
    try:
        if len(bulk_ops) > 0:
            coll.bulk_write(bulk_ops)
        print "Complete. Modified %d and upserted %s" % (res["nModified"], res["nUpserted"])
        print "Skipped %d" % skipped
    except:
        raise

def process_all_json_blobs_in_dir(path, coll, archive):
    global curr_blob
    global bulk_ops
    curr_file = 0
    curr_file_name = current_json_file(path, curr_file)
    try:
        while os.path.exists(curr_file_name):
            print "Opening %s" % curr_file_name
            with open(curr_file_name, 'r') as f:
                for line in f:
                    load_json_blob(line)
                    if curr_blob % 1000 == 0:
                        print "Processed %d stories..." % (curr_blob)
                    if len(bulk_ops) == 20000:
                        print "Pushing to mongo..."
                        result = coll.bulk_write(bulk_ops)
                        bulk_ops = []
                    curr_blob += 1
            if archive:
                # make file & path
                archive_file_name = curr_file_name.replace('/output/', '/archive/')
                if os.path.exists(archive_file_name):
                    pass # TODO: multiple passes of the same day
                else:
                    util.make_path_if_not_exists(archive_file_name)
                    os.rename(curr_file_name, archive_file_name)

            curr_file += 1
            curr_file_name = current_json_file(path, curr_file)
        # remove dir
        if archive:
            try:
                os.rmdir(path)
            except:
                print "[Error] could not remove " + path
                #ignore
    except:
        print "[Error] on %s" % curr_file_name
        raise

def current_json_file(path, curr_file):
    return os.path.join(path, str(curr_file) + ".json")

def archive_file(dir_path, curr_file):
    return archive_dir + dir_path + "/" + str(curr_file) + ".json"

def load_json_blob(json_str):
    global skipped
    blob = json.loads(json_str)

    publish_date = blob['publish_date']
    publish_ts = publish_date
    blob['publish_ts'] = publish_ts

    update_date = blob['update_date']
    update_ts = update_date
    blob['update_ts'] = update_ts

    #pp.pprint(blob)

    if blob['title'] == "":
        print "Skipping, no title"
        # just skip this entry for now
        skipped += 1
        return

    if blob['author'] == "":
        print "Skipping %s, no author" % blob['title']
        # just skip this entry for now
        skipped += 1
        return

    global bulk_ops
    bulk_ops.append(
        UpdateOne({
            'author': blob['author'],
            'title': blob['title']
        }, {'$set': blob }, upsert=True)
    )

if __name__ == "__main__":
   main(sys.argv[1:])
