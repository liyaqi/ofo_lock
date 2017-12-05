var app = require("./ofo-lock");
var authSecret = "G7qMjMTRYkG7tuc9zujGvkVImW4WJ5kh"
var auth_key = "fwCWYMqmRINlRtMp"
var host_url = "http://locktest.ofo.so"
var carno= "10018446";
var str = {
		"lock_sn":345,
		"car_no":123,
		"timestamp":678
		}
app.info();
app.init(authSecret,auth_key,host_url);
app.token_cal(str);
app.get_sn(carno);

