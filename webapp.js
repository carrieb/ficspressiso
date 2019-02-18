const express = require('express');

const path = require('path');

const favicon = require('serve-favicon');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const api = require('./routes/api');

const config = require('./config');

const routes = require('./routes/index');

const compression = require('compression');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// logging
app.use(logger('dev'));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    console.log('not compressing');
    return false;
  }

  return compression.filter(req, res);
}

// compression
app.use(compression({ filter: shouldCompress }));

// request parsing
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// statics
app.use(express.static(path.join(__dirname, 'public')));
app.use('/semantic', express.static(path.join(__dirname, 'semantic', 'dist')));
app.use('/semantic', express.static(path.join(__dirname, 'node_modules', 'semantic-ui-calendar', 'dist')))

// routes
app.use('/', routes);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.dbUrl, (err, db) => {
  console.log(`Initiatilized mongo connection to ${config.dbUrl}`);

  app.locals.db = db;
  console.log(app.get('env'));
  app.listen(3000, () => {
    console.log(`Node.js app is listening at http://localhost:${3000}`);
  });
});

module.exports = app;
