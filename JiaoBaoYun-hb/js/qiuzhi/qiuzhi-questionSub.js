/**
 * 问题界面逻辑
 */
mui.init();
mui.plusReady(function() {
		window.addEventListener('askId', function(e) {
				console.log('问题详情页面获取的问题id:' + e.detail.data);
			})
			//加载刷新
		events.initRefresh("控件id",
			function() { //刷新方法

			},
			function() { //加载更多

			});
	})
	/**
	 * 请求问题
	 */
	/**
	 * 请求答案列表
	 */
	/**
	 * 放置问题
	 */
	/**
	 * 放置答案列表
	 */
	/**
	 * 各种监听事件
	 */
var setListener = function() {

	}
