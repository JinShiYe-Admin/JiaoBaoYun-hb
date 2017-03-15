mui.init();
var newsDetail;
mui.plusReady(function(){
	events.fireToPageNone("check-news.html","detailReady");
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