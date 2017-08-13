const Timeline = require('../src/timeline');
const Sources = require('../src/constants/sources');

Timeline.inferTimeline(Sources.FFNET, 12188463, (timeline) => {
   console.log(timeline);
});