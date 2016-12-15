
mui.init();
mui.plusReady(function(){
	window.addEventListener('checkResult',function(e){
		var answerResultId=e.detail.data;
	})
})
