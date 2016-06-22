"use strict";
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('events_create', { title: 'Create Event' });
});

router.post('/', function(req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send("/events");
});



module.exports = router;