'use strict';
exports.main = async (event, context) => {
	let res = await uniCloud.httpclient.request(`http://www.kuaidi100.com/autonumber/auto?num=` + event.num + '&key=JSDSPEix6693',
	{
		"dataType":"json",
	})
	res.data = res.data.data
	return res;
};