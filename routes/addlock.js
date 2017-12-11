'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var Lock = AV.Object.extend('Lock');

router.post('/',function(req,res)
{
	var lock = new Lock();
	var query = new AV.Query('Lock');
	query.equalTo('CarNo',req.body.CarNo);
	query.find().then(function(result)
	{
		console.log('type: ',result.type);
		if(result.length ==0)
		{
			console.log('not find CarNo');
			lock.set('SN',req.body.SN);
			lock.set('CarNo',req.body.CarNo);
			lock.set('BoxNo',req.body.BoxNo);
			lock.set('CreatTime',req.body.CreatTime);
			lock.save().then(function(lock){
			console.log('save id : ',lock.id);
			var data =  {"result" : "saved","id":lock.id};
			res.send(JSON.stringify(data));
			},function(error){
				console.error(error);
				var data =  {"result" : "error"};
				res.send(JSON.stringify(data));
			});
		}
		else
		{   
			console.log('carno is exit');
			var data =  {"result" : "carno is exit"};
			res.send(JSON.stringify(data));
		}
	},function(error)
	{
				var data =  {"result" : "error"};
				res.send(JSON.stringify(data))
	});
	
});

module.exports = router;