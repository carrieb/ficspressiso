#!/usr/bin/env python

import sys
from pymongo import MongoClient
import math
import ffnet
import copy

mongodb_url = 'mongodb://localhost:27017/fanfic'
db_name = 'fanfic'
collection_name = 'docs'

def main(argv):
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

        # parse extra string
        #meta = ffnet.parse_fields(doc['meta'], {})
        try:
            print doc['chracters']
            bulk.find({'_id': doc['_id']}).update({'$set': {'characters': doc['chracters']}, '$unset': {'chracters' : ''} })
        except KeyError:
            continue # nothing to fix

        if math.floor(perc_done) % 5 == 0:
            print "%d stories updated, %d%% complete." % (curr, perc_done)
    bulk.execute()

if __name__ == "__main__":
   main(sys.argv[1:])
