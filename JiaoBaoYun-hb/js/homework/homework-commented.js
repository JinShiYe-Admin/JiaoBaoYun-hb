
mui.init();
mui.plusReady(function(){
	window.addEventListener('checkResult',function(e){
		var answerResultId=e.detail.data;
	})
	window.addEventListener('workDetail',function(e){
		var workInfo=e.detail.data;
		console.log('学生查看作业结果界面：'+JSON.stringify(workInfo));
	})
})
