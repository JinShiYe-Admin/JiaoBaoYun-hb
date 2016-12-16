mui.init()
mui.plusReady(function(){
	window.addEventListener('workInfo',function(e){
		var workInfo=e.setail.data;
		console.log('老师评价页面获取的作业信息：'+JSON.stringify(workInfo))
	})
})
