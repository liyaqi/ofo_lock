'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var LockInfo = AV.Object.extend('LockInfo');

router.post('/', function(req, res, next) {
	console.log("lock post");
  var query = new AV.Query(LockInfo);
  if(req.body.carno)
  {
	  query.equalTo('carno',req.body.carno);
	  query.find().then(function(results){
		console.log("carno",req.body.carno,'sn',results[0].get('sn'));
		res.render('lockinfo', {
		title: 'LockInfo',
		lockinfo: results
			});
	  });
	  
  }
  else
  {
	  console.log("sn",req.body.SN);
	  res.send(200);
  }
  
});

router.get('/', function(req, res, next){
	console.log("lock get");
	res.render('lockinfo', {
      title: 'Lock info',
      lockinfo: []
    });
});
module.exports = router;