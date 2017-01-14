mui.plusReady(function() {
	var cities = ['上海', '北京', '济南', '青岛'];
	slide_selector.getPages(cities, 'show-sub.html');
	window.addEventListener('tapTitleLeft', function() {
		console.log('展现-tapTitleLeft');
		events.openNewWindowWithData('../utils/customizeCity.html', {
			id: '1',
			webid: '../show/show_home.html', //当前webview的id
			cities: cities //已经定制的城市数组
		});
	});
})

//自己定制的城市数组
var showArray = [];

//44.获取个人的订制城市
function requestUserCity() {
	//所需参数
	var comData = {
		vvl: '1' //订制频道,0科教频道,1展示频道,其他待定
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//44.获取个人的订制城市
	postDataPro_PostUTcity(comData, wd, function(data) {
		wd.close();
		console.log('获取个人的订制城市:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//先通过‘|’将返回值分为数组
			showArray = data.RspData[0].citys.split('|');
			//遍历此数组
			for(var m in showArray) {
				var tempStr = showArray[m];
				//初始化model
				var model_area = {
					acode: '', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码
					aname: '', //节点名称
					atype: '', //节点类型,0省1城市2区县
					dataArray: '', //对应城市的新闻数组
					index: 0 //获取第几页的新闻数据
				};
				console.log('tempStr:' + tempStr);
				//将分成的每个值，再通过‘_’拆分为model
				var tempArea = tempStr.split('_');
				model_area.acode = tempArea[0];
				model_area.aname = tempArea[1];
				model_area.atype = '1';
				//将对应的这个数组的str和model对换，将数组中的值，替换为model数组
				showArray.splice(m, 1, model_area);
				//如果有值，默认获取第一个城市的数据
				if(m == 0) {
					requestCityNews(tempArea[0]);
				}
			}
			console.log('修改后的最终值为:' + JSON.stringify(showArray));
		} else {
			mui.toast(data.RspTxt);
		}
	});
}