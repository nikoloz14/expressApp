"use strict";
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('events_edit', { title: 'Edit Event' });
});


module.exports = router;