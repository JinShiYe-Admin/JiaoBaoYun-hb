mui.init();
mui.plusReady(function(){
	window.addEventListener('citiesInfo',function(e){
		console.log('展示主界面获取的城市数组：'+JSON.stringify(e.detail.data));
		cities=e.detail.data;
		slide_selector.getPages(cities, 'senedu-sub.html');
	})
})