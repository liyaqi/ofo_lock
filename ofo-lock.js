// use for lock platform api
var md5=require("md5");
var request =require('request-json');
var http=require('http');  
var auth_secret ="";
var auth_key = ""
var host_url  =""
function info(){
	console.log("this is use for lock platform api!");
}
function init(secret,key,url)
{
	auth_secret = secret;
	auth_key = key;
	host_url= url;
	console.log(auth_secret);
}
//
function objKeySort(arys) { 
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();　　 
    console.log('newkey='+newkey);
	var req_str ="";
    for(var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
        req_str = req_str+arys[newkey[i]]; 
                    //向新创建的对象中按照排好的顺序依次增加键值对

      }
	  req_str = req_str+auth_secret;
      return req_str; //返回排好序的新对象
}
// use for caculation md5
function token_cal(str){
	console.log(str);
	var jsonstr=objKeySort(str);
	var token = md5(jsonstr);
	//console.log(jsonstr);
	console.log(token);
	return token;
}
function get_sn(car_no){
	timestamp =Date.now();
	req = {
			"car_no":car_no,
			"timestamp":timestamp
		}
	var token = token_cal(req);
	console.log('Token: ',token);
	var url = "/lockWorker/queryBikeLockBindInfo?car_no="+car_no+"&timestamp="+timestamp+"&auth_key="+auth_key+"&token="+token;
	console.log('url: ',url);
	var full_url = host_url+url;
	console.log('url: ',full_url);
	http.get(full_url,function(res){
		console.log("Got response: " + res.statusCode); 
		    res.on('data', function (chunk) {  
        console.log('BODY: ' + chunk);  
    });
			}).on('error', function(e) { 
		console.log("Got error: " + e.message); 
		
	});
	
}
exports.info=info;
exports.token_cal=token_cal;
exports.init=init;
exports.get_sn=get_sn;