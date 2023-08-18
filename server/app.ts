//setup enviornment variables
import dotenv from 'dotenv';
dotenv.config();
import { NextFunction,Request, Response } from "express";
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import {apiRouter} from  './src/Routes/v1/api';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
});
//setup cors
import cors from 'cors';
app.use(cors());
//setup mongoose, connecting to the database url in .env
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('Successfully connected to the mongodb database.')
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'src', 'Views'));
app.set('view engine', 'jade');
app.use('/v1/api', apiRouter);

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
