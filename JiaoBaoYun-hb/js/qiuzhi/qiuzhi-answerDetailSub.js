mui.init()
mui.plusReady(function(){
	window.addEventListener('answerId',function(e){
		console.log('回答详情获取的答案id:'+e.detail.data);
		//8.获取某个回答的详情
				requestAnswerDetail(e.detail.data);
	})
})
	//8.获取某个回答的详情
function requestAnswerDetail(answerId) {
	//所需参数
	var comData = {
		answerId: answerId, //回答ID
		orderType: '2', //评论排序方式,1 时间正序排序,2 时间倒序排序
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//8.获取某个回答的详情
	postDataQZPro_getAnswerById(comData, wd, function(data) {
		wd.close();
		console.log('8.获取某个回答的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			datasource = data.RspData;
			//发送获取用户资料申请
			var tempData = {
					vvl: data.RspData.AnswerMan, //用户id，查询的值,p传个人ID,g传ID串
					vtp: 'p' //查询类型,p(个人)g(id串)
				}
				//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd, function(data1) {
				wd.close();
				console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
				if(data1.RspCode == 0) {
					mui.extend(datasource, data1.RspData[0])
					console.log(JSON.stringify(datasource))
					refreshUI();
				} else {

				}
			})

		} else {
			mui.toast(data.RspTxt);
		}
	});
}