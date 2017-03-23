mui.init();
var newsDetail;
mui.plusReady(function(){
	mui.fire(plus.webview.currentWebview().opener(),"subReady",0);
	window.addEventListener("newsDetail",function(e){
		newsDetail=e.detail.data;
		console.log("获取的新闻详情："+JSON.stringify(newsDetail));
		//放置数据
		setData();
	})
	
})
//放置数据
var setData=function(){
	
}
//加载监听
var setListener=function(){
	
}
//