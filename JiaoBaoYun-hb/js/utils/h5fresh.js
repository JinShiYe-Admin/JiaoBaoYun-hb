/**
 * h5下拉刷新
 * 解决与水平滚动的冲突
 * @anthor an
 */
var h5fresh = (function(mod) {
	var ws = null; //当前webview
	// 扩展API加载完毕，现在可以正常调用扩展API
	mod.addRefresh = function(refresh, data) {
		var height = 50;
		var range = 200;
		if(data) {
			if(data.height) {
				height = data.height;
			}
			if(data.range) {
				height = data.range;
			}
		}
		ws = plus.webview.currentWebview();
		ws.setPullToRefresh({
			support: true, //是否开启Webview窗口的下拉刷新功能
			height: height + 'px', //窗口的下拉刷新控件高度
			range: range + 'px', //)窗口可下拉拖拽的范围
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, function() {
			setTimeout(function() {
				refresh();
				ws.endPullToRefresh();
			}, 2000)
		}); //刷新
		//	plus.nativeUI.toast("下拉可以刷新");
	}

	// 刷新页面
	function onRefresh() {
		setTimeout(function() {
			if(list) {
				var item = document.createElement("li");
				item.innerHTML = "<span>New Item " + (new Date()) + "</span>";
				list.appendChild(item, list.firstChild);
			}
			ws.endPullToRefresh();
		}, 2000);
	}

	return mod
})(h5fresh || {})