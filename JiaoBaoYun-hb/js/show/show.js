mui.plusReady(function() {
	var cities = ['上海', '北京', '济南', '青岛'];
	slide_selector.setCities(cities);
	slide_selector.getPages('show-sub.html');
	window.addEventListener('tapTitleLeft', function() {
		console.log('展现-tapTitleLeft');
		events.openNewWindowWithData('../utils/customizeCity.html', {
			id: '1',
			webid: '../show/show_home.html', //当前webview的id
			cities: cities //已经定制的城市数组
		});
	});
})