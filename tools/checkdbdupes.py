#!/usr/bin/env python

import sys
from pymongo import MongoClient
import math
import ffnet
import copy

mongodb_url = 'mongodb://localhost:27017/fanfic'
db_name = 'fanfic'
collection_name = 'documents'

# TODO: This is super slow 

def main(argv):
    # TODO: let yosu override url, db_name with cmd args
    client = MongoClient(mongodb_url)
    db = client[db_name]
    coll = db[collection_name]

    total_size = coll.count({})
    curr = 0
    perc_done = (curr / total_size) * 100
    bulk = coll.initialize_ordered_bulk_op()
    for doc in coll.find():
        curr +=1
        perc_done = (curr * 1.0 / total_size) * 100

        dupes = coll.find({
            'author': doc['author'],
            'title': doc['title'],
            '_id': {'$ne': doc['_id']}
        })

        for dupe in dupes:
            print 'Found duplicate: ' + dupe['title'] + ' by ' + dupe['author']
            bulk.find({'_id' : dupe['_id']}).remove()

        if math.floor(perc_done) % 5 == 0:
            print "%d stories updated, %d%% complete." % (curr, perc_done)
    bulk.execute()

if __name__ == "__main__":
   main(sys.argv[1:])
