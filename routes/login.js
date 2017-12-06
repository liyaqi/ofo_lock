'use strict';
var router = require('express').Router();
var AV = require('leanengine');


router.get('/', function(req, res) {
	console.log('get: login')
    res.render('login');
});
router.post('/',function(req,res)
{
	console.log('post: login')
	var username = req.body.username;
	var password = req.body.password;
	console.log('username: ',username);
	console.log('password: ',password);
	AV.User.logIn(username, password).then(function (loginedUser) {
   // console.log(loginedUser);
	res.saveCurrentUser(loginedUser);
//	res.send(200);
    res.redirect('/todos');
  }, function (error) {
	  console.log('log error');
	  res.redirect('/login');
  });
	
});
module.exports = router;