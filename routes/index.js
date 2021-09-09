var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
/* GET home page. */
<<<<<<< HEAD
router.get('/', function (req, res, next) {
  User.find().then((users) =>
    res.render('index', { title: 'Express', users })
=======
router.get('/', function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { title: 'Express', users})
>>>>>>> ba1af9504f9b9b41999d6bdabfaa757d2d6ba153
  )
});

module.exports = router;
