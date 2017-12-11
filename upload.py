#upload.py
import xlrd
import json
import urllib
import urllib2
workbook =  xlrd.open_workbook(r'data.xlsx')
sheet1 = workbook.sheet_by_index(0) 
nrows = sheet1.nrows
print nrows
for i in range(nrows):	
	BoxNo = sheet1.cell(i,0).value
	SN = sheet1.cell(i,1).value
	CarNo = sheet1.cell(i,2).value
	CreatTime = sheet1.cell(i,3).value
	#print BoxNo,SN,CarNo,CreatTime
	json_data = json.dumps({'BoxNo':BoxNo,'SN':SN,'CarNo':CarNo,'CreatTime':CreatTime})
	print json_data
	url="http://localhost:3000/addlock"
	headers = {'Content-Type': 'application/json'}
	req = urllib2.Request(url = url,data =json_data,headers = headers)
	#print req
	res_data = urllib2.urlopen(req)
	res = res_data.read()
	print res