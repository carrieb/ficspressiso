#!/usr/bin/env python

import sys, json, os
from pymongo import MongoClient, UpdateOne

# TODO: so there's a bug right now with the version of mongo i have installed on the raspberry pi
# it's the highest the device supports
# but it has a bug that reports its version of mongo as 0, which pymongo rejects
# installing the fixed mongo (>3.4) requires at 64-bit build of the raspberry pi
# which involves reinstalling its OS
# TLDR: T_T
# mongodb_url = 'mongodb://192.168.0.14:27017/fanfic';
# If we did this all via a node script instead, we wouldn't have the issue.


mongodb_url = 'mongodb://localhost:27017/fanfic';
db_name = 'fanfic'
collection_name = 'docs'

# TODO: pass in via args
# json_dir = '/Users/carolyn/Desktop/projects/ficspressiso/tools/output/backfill/'
json_dir = '/home/carrie/projects/ficspressiso/tools/backfill/'
archive_dir = '/Users/carolyn/Desktop/projects/ficspressiso/tools/archive/'

curr_blob = 0
skipped = 0

bulk_ops = []

archive = False


def validateFicJSON(json):
    # TODO: validate the fields we need are there
    return True


def handle_walk_err(er):
    raise er


# TODO: read new json files -> insert into DB -> dedub on author / title
def main(argv):
    client = MongoClient(mongodb_url)
    db = client[db_name]
    coll = db[collection_name]
    global bulk_ops

    print "Parent JSON dir: %s" % json_dir
    if archive:
        print "Archiving to dir: %s" % archive_dir

    try:
        for folder, subfolders, files in os.walk(json_dir, topdown=False, onerror=handle_walk_err):
            for subfolder in subfolders:
                path = os.path.join(folder, subfolder)
                print "Processing all JSON in %s" % subfolder
                process_all_json_blobs_in_dir(path, coll)
        if len(bulk_ops) > 0:
            # coll.bulk_write(bulk_ops)
            # print "Complete. Modified %d and upserted %s" % (res["nModified"], res["nUpserted"])
            print "Skipped %d" % skipped
        else:
            print "No db operations being done."
    except:
        raise


def process_all_json_blobs_in_dir(path, coll, archive=False):
    global curr_blob
    global bulk_ops

    curr_file = 0
    curr_file_name = current_json_file(path, curr_file)

    try:
        while os.path.exists(curr_file_name):
            print "\t Processing file: %s" % curr_file_name
            with open(curr_file_name, 'r') as f:
                for line in f:
                    load_json_blob(line)
                    if curr_blob % 1000 == 0:
                        print "Processed %d stories..." % (curr_blob)
                    if len(bulk_ops) == 20000:
                        print "Pushing to mongo..."
                        try:
                            result = coll.bulk_write(bulk_ops)
                            print result.matched_count, result.inserted_count, result.modified_count, result.upserted_count
                            bulk_ops = []
                        except:
                            raise
                    curr_blob += 1
            # if archive:
            # ARCHIVE: make file & path
            # archive_file(file_name);

            curr_file += 1
            curr_file_name = current_json_file(path, curr_file)

        # ARCHIVE: remove dir
        if archive:
            try:
                os.rmdir(path)
            except:
                print "[Error] could not remove " + path
                # ignore
    except:
        print "[Error] on %s" % curr_file_name
        raise


def archive_file(file_name):
    # TODO:
    # archive_file_name = curr_file_name.replace('/output/', '/archive/')
    # if os.path.exists(archive_file_name):
    #     pass # TODO: multiple passes of the same day
    # else:
    #     util.make_path_if_not_exists(archive_file_name)
    #     os.rename(curr_file_name, archive_file_name)
    return ""


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
    blob['site'] = "https://www.fanfiction.net/"

    # pp.pprint(blob)

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
            'title': blob['title'],
            'site': blob['site']
        }, {'$set': blob}, upsert=True)
    )


if __name__ == "__main__":
    main(sys.argv[1:])
