var router = require('express').Router();
var AV = require('leanengine');
var https = require('https'); 
var qs = require('querystring');
var iconv = require("iconv-lite");   
const APP_ID = 'wx94c22b17e4147dc3';//输入小程序appid  
const APP_SECRET = '6cefab0998ec5784d53533e1934140e7';//输入小程序app_secret 
router.post('/',function(req,resq)
{   
	var js_code = req.body.js_code;
	console.log(req.body.js_code)
	var data = {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: req.body.js_code,
            grant_type: 'authorization_code'            
          };
    //url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APP_ID+'&secret='+APP_SECRET+'&js_code='+js_code+'&grant_type=authorization_code';
	var content = qs.stringify(data);
	url = 'https://api.weixin.qq.com/sns/jscode2session?'+content
	var options = { 
    hostname: 'https://api.weixin.qq.com', 
    path: '/sns/jscode2session?' + content, 
    method: 'GET' 
	};
    https.get(url, function (res) {  
        var datas = [];  
        var size = 0;  
        res.on('data', function (data) {  
            datas.push(data);  
            size += data.length;  
        //process.stdout.write(data);  
        });  
        res.on("end", function () {  
            var buff = Buffer.concat(datas, size);  
            var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
            console.log(result);
			resq.send(result);			
        });  
    }).on("error", function (err) {  
        Logger.error(err.stack)  
        callback.apply(null);  
    });  
	// var req = http.request(options, function (res) { 
    // console.log('STATUS: ' + res.statusCode); 
    // console.log('HEADERS: ' + JSON.stringify(res.headers)); 
    // res.setEncoding('utf8'); 
    // res.on('data', function (chunk) { 
        // console.log('BODY: ' + chunk); 
    // }); 
// }); 
   
	// req.on('error', function (e) { 
		// console.log('problem with request: ' + e.message); 
	// }); 
   
	// req.end();
		
	
});

module.exports = router;