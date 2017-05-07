const DAO = require('../src/dao')

DAO.getTop(
  'dont care',
  '2013-01-01',
  '2013-12-31',
  'fav_cnt',
  10,
  (res) => console.log(res)
);
