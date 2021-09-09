var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
/* GET home page. */
<<<<<<< HEAD
router.get('/', function (req, res, next) {
  User.find().then((users) =>
    res.render('index', { title: 'Express', users })
  )
});

module.exports = router;
=======
router.get('/', function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { title: 'Express', users})
  )
});

module.exports = router;
>>>>>>> 01859d42c10834c2d9d36f65cd398936ba9fddbe
