require('dotenv').config()

var createError = require('http-errors');
var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
<<<<<<< HEAD
const authRouter = require('./routes/auth.routes');
=======
const auth = require('./routes/auth.routes');
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153

var app = express();

// Functional curling style of loading configuration
require('./config/db.config')
require('./config/global')(app)


app.use('/', indexRouter);
app.use('/users', usersRouter);
<<<<<<< HEAD
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
=======
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
  next(createError(404));
});

// error handler
<<<<<<< HEAD
app.use(function (err, req, res, next) {
=======
app.use(function(err, req, res, next) {
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
