//setup enviornment variables
require('dotenv').config();
//import type defintions
import { NextFunction,Request, Response } from "express";
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

var app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
});
//setup mongoose, connecting to the database url in .env
export const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('Successfully connected to the mongodb database.')
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:any ,req:Request, res: Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
