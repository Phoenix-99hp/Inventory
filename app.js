var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var storeRouter = require('./routes/store');

var hbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

var app = express();

var mongoose = require('mongoose');
var dev_db_url = "mongodb://localhost/inventory";
var mongoDB = process.env.DB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.engine(
  "hbs",
  hbs({
    helpers: require("./public/javascripts/helpers.js").helpers,
    partialsDir: "views/partials",
    extname: ".hbs",
    layoutsDir: "views",
    defaultLayout: "layout"
  })
);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/store', storeRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

module.exports = app;