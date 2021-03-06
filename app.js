'use strict';

var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var fs=require("fs");
var crypto = require('crypto');
var md5 = require('md5');
// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.set('etag','strong');
// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(AV.Cloud.CookieSession({ secret: '<put random string here>', maxAge: 3000000, fetchUser: true }));
// app.get('/', function(req, res) {
  // res.render('index', { currentTime: new Date() });
// });
// app.get('/login', function(req, res) {
  // res.render('login', { title: 'Login' });
// });
// 可以将一类的路由单独保存在一个文件中
app.use('/todos', require('./routes/todos'));
app.use('/login', require('./routes/login'));
app.use('/lockinfo', require('./routes/lockinfo'));
app.use('/addlock', require('./routes/addlock'));
app.use('/xiaochengxu', require('./routes/xiaochengxu'));
app.use('/',function(req,res,next){
	
	//res.send('hello')
	 var url = 'public/res/open.mp3';
	 var hash  = crypto.createHash('md5');
	 var data=fs.readFileSync(url);  
	 hash.update(data);
	 var etag = md5(data).toUpperCase();
	 var etag_str ="\""+etag+"\"";
	 var rs = fs.createReadStream(url);
     rs.on('data', function(chunk) {
        hash.update(chunk);
    });
	var md5_str = hash.digest('base64');
	console.log(md5_str);
	res.setHeader("Content-MD5",md5_str);
	res.setHeader("Content-type","audio/mp3");
	res.setHeader('ETag',etag_str);
	 res.writeHead(200,"成功！",{
		 "Content-Md5":md5,
         "Content-type":"audio/mp3"
     });
	 res.download(url);
});
app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});
// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
