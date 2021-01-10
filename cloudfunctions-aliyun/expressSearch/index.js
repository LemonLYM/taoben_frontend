'use strict';
/*
	快递100 http://api.kuaidi100.com/login/
	参数设置
	const key = 'xxxxxxx';		//客户授权key
	const customer = 'xxxxx';	//查询公司编号
*/

exports.main = async (event, context) => {
	let {code,com,number,res} = event
	//快递100 http://api.kuaidi100.com/login/
	//参数设置
	const key = 'JSDSPEix6693'; //客户授权key
	const customer = 'E3A3CED44D8F3C511C304D33F589E411'; //查询公司编号
	const param = {
		'com': code, //快递公司编码
		'num': number, //快递单号
		//'phone' : '',				//手机号
		//'from' : '',				//出发地城市
		//'to' : '',				//目的地城市
		//'resultv2' : '1'			//开启行政区域解析
	};

	//请求参数
	let post_data = {};
	post_data["customer"] = customer;
	post_data["param"] = JSON.stringify(param);
	const md5 = require('md5-node');
	//加密
	const sign = md5(post_data["param"] + key + post_data["customer"]);
	post_data["sign"] = sign.toUpperCase();
	const url = 'http://poll.kuaidi100.com/poll/query.do'; //实时查询请求地址
	var params = "";
	for (let k in post_data) {
		params += k + "=" + URLEncode(post_data[k]) + "&"; //默认UTF-8编码格式
	}
	post_data = params.substr(0, params.length - 1);
	console.log('请求参数<br/>' + post_data);
	let requestRes = await uniCloud.httpclient.request(url, {
		method: 'GET',
		data: post_data,
		dataType: 'json'
	})
	res = requestRes
	return res;
};

function URLEncode(clearString) {
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	var regex = /(^[a-zA-Z0-9-_.]*)/;
	while (x < clearString.length) {
		var match = regex.exec(clearString.substr(x));
		if (match != null && match.length > 1 && match[1] != '') {
			output += match[1];
			x += match[1].length;
		} else {
			if (clearString.substr(x, 1) == ' ') {
				//原文在此用 clearString[x] == ' ' 做判断, 但ie不支持把字符串当作数组来访问, 
				//修改后两种浏览器都可兼容 
				output += '+';
			} else {
				var charCode = clearString.charCodeAt(x);
				var hexVal = charCode.toString(16);
				output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
			}
			x++;
		}
	}
	return output;
}
