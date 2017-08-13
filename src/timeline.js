const ffnet = require('./ffnet');

const _range = require('lodash/range');
const _minBy = require('lodash/minBy');

const Timeline = {
    inferTimeline(site, id, callback) {
        // get basic fic data
        // break timeline out into timeline: [{}, ..]
        // obj for each chapter { chapter: 2, posted: 2/2/2, words: 123, reviews: 12 }
        let timeline = [];
        const url = "https://www.fanfiction.net/s/" + id;
        console.log(url);
        ffnet.retrieveFic(url, (fic) => {
           let completed = 0;
           const done = () => {
               completed++;
               if (completed === fic.chapter_cnt-1) {
                   callback(timeline);
               }
           };
           _range(1, fic.chapter_cnt).forEach((chapter) => {
               const reviewsUrl = "https://www.fanfiction.net/r/" + id + "/" + chapter;
               // beautiful, should be all reviews for that chapter
               ffnet.parseReviews(reviewsUrl, (reviews) => {
                   const earliestReview = _minBy(reviews, 'ts');
                   let earliestTs = earliestReview ? earliestReview.ts : null;
                   // TODO: store in a different collection?
                   timeline[chapter-1] =  { chapter, earliestReview: earliestTs };
                   done();
               });
           });
        });
    }
};

module.exports = Timeline;