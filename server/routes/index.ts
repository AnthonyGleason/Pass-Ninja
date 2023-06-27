var express = require('express');
var router = express.Router();
import {Request,Response,NextFunction} from 'express';
/* GET home page. */
router.get('/', function(req: Request, res:Response, next:NextFunction) {
  res.status(200)
});

module.exports = router;
