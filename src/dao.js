// TODO: pass this in via a configuration file
const url = 'mongodb://localhost:27017/fanfic';

const moment = require('moment');

const MongoClient = require('mongodb').MongoClient;

const AggregationUtil = require('./util/aggregation-util');

const assert = require('assert');

const findForQuery = (query) => {
    const start = moment(query.start);
    const end = moment(query.end);
    const minWords = parseInt(query.minWords);
    const maxWords = parseInt(query.maxWords);
    return {
        "characters": {
            "$in": query.characters
        },
        "publish_ts": {
            "$gt": start.unix()
        },
        "update_ts": {
          "$lt": end.unix() + 1
        },
        "word_cnt": {
            "$gt": minWords,
            "$lt": maxWords
        }
    };
};

const DAO = {
  getFandoms(db, callback) {
    const docs = db.collection('docs');

    let fandoms = [];
    const cursor = docs.aggregate(AggregationUtil.FANDOM_PIPELINE);

    cursor.each((err, doc) => {
        if (err) {
          console.log(err);
        } else if (doc) {
          const fandom = {};
          fandom.name = doc._id.fandom;
          fandom.count = doc.count;
          fandoms.push(fandom);
        } else {
          callback(fandoms);
        }
    });
  },

  getCharacters(db, callback) {
      const docs = db.collection('docs');

      let characters = [];
      const cursor = docs.aggregate(AggregationUtil.CHARACTER_PIPELINE);

      cursor.each((err, doc) => {
          if (err) {
              console.log(err);
          } else if (doc) {
              const character = {};
              character.name = doc._id.character;
              character.count = doc.count;
              characters.push(character);
          } else {
              callback(characters);
          }
      });
  },

  saveFic(db, fic, callback) {
    const docs = db.collection('docs');
    docs.insertOne(fic, (err, res) => {
      assert.equal(null, err);
      callback(fic);
    });
  },

  findFicLike(query, callback) {
    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const docs = db.collection('docs');
      docs.findOne(query, (err, fic) => {
        assert.equal(null, err);
        if (fic) {
          // TODO: merge in feedback
          const feedback = db.collection('feedback');
          feedback.find({
            fic_id: fic._id
          }, (err, feedback) => {
            assert.equal(null, err);
            console.log(feedback);

            callback(fic);
          });
        } else {
          callback(fic);
        }
      });
    });
  },

  rateAndSave(fic, userFeedback, callback) {
    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const docs = db.collection('docs');
      const feedback = db.collection('feedback');
      if (fic._id) {
        // TODO: if fic has _id set, then update

      } else {
        // insert new fic
        // const now = moment().unix();
        // fic.date_created = now;
        // docs.insertOne(fic, (err, res) => {
        //   assert.equal(null, err);
        //   console.log(res);
        //   callback();
        //   //userFeedback.
        //   //feedback.insertOne()
        // });
      }
    });
  },

  saveFics(fics) {
      MongoClient.connect(url, (err, db) => {
        console.log('update list of fics');
        assert.equal(null, err);
        const coll = db.collection('docs');
        fics.forEach((fic) => {
          coll.updateOne(
            {
              "title": fic.title,
              "author": fic.author
            }, {
              "$set": fic
            }, {
              upsert: true
            }, (err, res) => {
                assert.equal(null, err);
            });
          });
      });
  },

  replaceFicData(ficUrl, data, callback) {
    MongoClient.connect(url, (err, db) => {
      console.log('find and replace');
      assert.equal(null, err);
      const coll = db.collection('docs');
      console.log(url);
      coll.findOneAndReplace({ "url": ficUrl }, data, (err, res) => {
        if (err) {
          console.error(err);
        }
        assert.equal(null, err);
        callback();
      });
    });
  },

  markAsDeleted(ficUrl, callback) {
    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const coll = db.collection('docs');
      console.log(ficUrl);
      coll.update({ "url": ficUrl }, {"$set" : { "deleted" : true }}, (err, res) => {
        if (err) {
          console.error(err);
        }
        assert.equal(null, err);
        callback();
      });
    });
  },

  getTop(characters, rating, startDate, endDate, field, limit, minWords, maxWords, page, callback) {
    const start = moment(startDate)
    const end = moment(endDate)
    const skip = 10 * (page - 1);

    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      const coll = db.collection('docs')
      sort = {}
      sort[field] = -1
      //console.log(sort)
      // TODO: put in character to find query
      query = {
        deleted: {'$exists': false},
        publish_ts: {'$gt': start.unix(), '$lt': end.unix() }
      };
      if (characters && characters.length > 0) {
        query.characters = {'$all' : characters};
      }
      if (rating && rating.length > 0) {
        query.rating = {'$in' : rating.map((r) => `Fiction  ${r}`)}
      }
      if (minWords || maxWords) {
        query.word_cnt = {}
        if (minWords) {
          query.word_cnt['$gt'] = minWords;
        }
        if (maxWords) {
          query.word_cnt['$lt'] = maxWords;
        }
      }
      //console.log(query)
      coll.find(query, { sort, limit, skip }).toArray((err, docs) => {
        assert.equal(null, err)
        callback(docs)
      });
    });
  },

  aggregateNumFics(query, delta = 'month', callback) {
    const start = moment(query.start);
    const end = moment(query.end);
    const numDelta = end.diff(start, delta + 's') + 1;
    console.log(numDelta);

    const labels = [];
    const raw_dataset = {};
    query.characters.forEach((character) => {
        raw_dataset[character] = {
            label: character,
            data: []
        }
    });

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      const coll = db.collection('docs');

      const match = {
          "$match" : findForQuery(query)
      };
      console.log(query, match);

      const unwind = {
          "$unwind": "$characters"
      };

      const publish_date = {
          "$add": [
              new Date(0),
              { "$multiply": [1000, "$publish_ts"] }
          ]
      };

      const project = {
        "$project":{
          "_id": 0,
          "publish_year": {
            "$year": publish_date
          },
          "publish_month": {
            "$month": publish_date
          },
          "character": "$characters",
          "words": "$word_cnt"
        }
      };
      //console.log(project);
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
        //console.log(err);
        //console.log(doc);
        if (doc) {
          const { _id, count, totalWords } = doc;
          const { month, year, character } = _id;
          const dataset = raw_dataset[character];
          const temp = moment([ year, month - 1 ]);

          const num_delta = temp.diff(start, delta + 's');
          raw_dataset[character].data[num_delta] = count;
        } else {
          while (start < end) {
            labels.push(start.format('MMM YY'));
            start.add(1, delta);
          }
          const datasets = query.characters.map((character) => {
            return raw_dataset[character];
          });
          //console.log(raw_datasets, labels, datasets);
          callback( labels, datasets );
        }
      });
    });
  }
};

module.exports = DAO;
