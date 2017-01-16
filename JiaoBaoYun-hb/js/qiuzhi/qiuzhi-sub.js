/**
 * 求知子页面界面逻辑
 */
mui.init();
mui.plusReady(function(){
	//加载h5刷新方式
	h5fresh.addRefresh(function(){
		//刷新的界面实现逻辑
	})
	setListener();
})
/**
 * 请求专家数据
 */
/**
 * 放置专家数据
 */
/**
 * 请求求知数据
 */
/**
 * 放置求知数据
 */
/**
 * 上拉加载的实现方法
 */
var pullUpFresh=function(){
	
}
/**
 * 各种监听事件
 */
var setListener=function(){
	events.addTap('submit-question',function(){
		events.openNewWindow('qiuzhi-questionSub.html');
	})
}
