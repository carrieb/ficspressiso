const url = 'mongodb://localhost:27017/fanfic';

const moment = require('moment');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const assert = require('assert');

const DAO = {
  replaceFicData(mongoId, data, callback) {

    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const coll = db.collection('documents')
      const id = ObjectID(mongoId);
      coll.findOneAndReplace({ "_id": id }, data, (err, res) => {
        assert.equal(null, err);
        callback();
      });
    });
  },

  getTop(characters, startDate, endDate, field, limit, callback) {
    const start = moment(startDate)
    const end = moment(endDate)

    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const coll = db.collection('documents')
      sort = {}
      sort[field] = -1
      console.log(sort)
      // TODO: put in character to find query
      query = {
        publish_ts: {'$gt': start.unix(), '$lt': end.unix() }
      };
      if (characters && characters.length > 0) {
        query.characters = {'$in' : characters};
      }
      console.log(query)
      coll.find(query, { sort, limit }).toArray((err, docs) => {
        assert.equal(null, err)
        callback(docs)
      });
    });
  },

  aggregateNumFics(characters, startDate, endDate, delta = 'month', callback) {
    const start = moment(startDate);
    const end = moment(endDate);
    const numDelta = end.diff(start, delta + 's') + 1;
    console.log(numDelta);

    const labels = [];
    const raw_datasets = {};
    characters.reduce((obj, character, idx) => {
      obj[character] = {
        label: character,
        data: []
      };
      return obj;
    }, raw_datasets);

    console.log(raw_datasets);
    // TODO: move out chart specific things

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      const coll = db.collection('documents');

      console.log(characters);

      const project = {
        "$project":{
          "_id": 0,
          "publish_year": {
            "$year": {
              "$add": [
                new Date(0),
                { "$multiply": [1000, "$publish_ts"] }
              ]
            }
          },
          "publish_month": {
            "$month": {
              "$add": [
                new Date(0),
                { "$multiply": [1000, "$publish_ts"] }
              ]
            }
          },
          "character": "$characters",
          "words": "$word_cnt"
        }
      };
      const unwind = {
        "$unwind": "$characters"
      };
      const match = {
        "$match" : {
          "characters": {
            "$in": characters
          },
          "publish_ts": {
            "$gt": start.unix(),
            "$lt": end.unix()
          }
        }
      };
      const group = {
        "$group": {
          "_id": {
            "year": "$publish_year",
            "month": "$publish_month",
            "character" : "$character"
          },
          "count" : { "$sum" : 1 },
          "totalWords" : { "$sum" : "$words" }
        }
      };
      const cursor = coll.aggregate([ match, unwind, match, project, group ]);

      cursor.each((err, doc) => {
        if (doc) {
          const { _id, count, totalWords } = doc;
          const { month, year, character } = _id;
          const dataset = raw_datasets[character];
          const temp = moment([ year, month - 1 ]);

          const num_delta = temp.diff(start, delta + 's');
          raw_datasets[character].data[num_delta] = count;
        } else {
          while (start < end) {
            labels.push(start.format('MMM YY'));
            start.add(1, delta);
          }
          const datasets = characters.map((character) => {
            return raw_datasets[character];
          });
          console.log(raw_datasets, labels, datasets);
          callback( labels, datasets );
        }
      });
    });
  }

}

module.exports = DAO;