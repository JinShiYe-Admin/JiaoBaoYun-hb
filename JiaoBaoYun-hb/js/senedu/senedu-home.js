mui.init();
mui.plusReady(function() {
	//自己定制的城市数组
	var cities = [];

	window.addEventListener('citiesInfo', function(e) {
		console.log('展示主界面获取的城市数组：' + JSON.stringify(e.detail.data));
		cities = e.detail.data;
		slide_selector.getPages(cities, 'senedu-sub.html');
	});

	//---订制城市---start---
	//进入订制城市界面
	window.addEventListener('tapTitleLeft', function() {
		events.openNewWindowWithData('../utils/customizeCity.html', {
			id: '0', //0科教，1展现
			webid: '../scienceeducation/scienceeducation_home.html', //当前webview的id
			cities: cities //已经定制的城市数组
		});
	});

	//退出订制城市界面返回的数据
	window.addEventListener('customizeCity', function(e) {
		cities = e.detail.data;
	});

	//---订制城市---end---
});