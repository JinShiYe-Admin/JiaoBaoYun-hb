mui.init();
window.addEventListener('cityInfo',function(e){
		console.log("展示子页面获取的城市信息："+JSON.stringify(e.detail));
		document.write(e.detail);
	})
mui.plusReady(function(){

})
/**
 * 请求数据
 */
var requestData=function(callbak){
	
}
var setData=function(data){
	
}