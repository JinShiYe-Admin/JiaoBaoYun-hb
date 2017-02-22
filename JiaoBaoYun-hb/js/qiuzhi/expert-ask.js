var expertData; //专家详细页传来的 专家信息
var pageIndex = 1; //请求数据页面
var totalPageCount = 10; //总页码10 测试用

mui.init();

mui.plusReady(function() {
	console.log(111111)
	//25.获取某个用户的提问列表
	getAsksByUser(33);
}
//25.获取某个用户的提问列表
function getAsksByUser(userId) { //需要加密的数据
	var comData = {
		userId: userId, //用户ID
		pageIndex: '1', //当前页数
		pageSize: 0 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//25.获取某个用户的提问列表
	postDataQZPro_getAsksByUser(comData, wd, function(data) {
		wd.close();
		console.log('25.获取某个用户的提问列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {

		} else {
			mui.toast(data.RspTxt);
		}
	});
};