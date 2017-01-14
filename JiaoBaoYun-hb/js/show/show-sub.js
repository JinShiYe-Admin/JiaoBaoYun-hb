
mui.init();
mui.plusReady(function() {
    // 获取当前窗口对象
    var self = plus.webview.currentWebview();
   h5fresh.addRefresh(function(){
   	
   })
    window.addEventListener('cityInfo',function(e){
		console.log("展示子页面获取的城市信息："+JSON.stringify(e.detail));
//		document.write(e.detail);
	})
    // 读取传递过来的参数
//  var index = self.index;
    /**
     * 获取父窗口对象
     * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.parent
     */
    var parent = self.parent();
    // 左滑事件
    document.addEventListener("swipeleft", function(event) {
        var angle = event.detail.angle;
        angle = Math.abs(angle);
        console.log('左滑事件：'+angle);
        /**
         * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
         */
        if(angle > 100 && angle < 185) {
            parentEvent(parent,"left");
        }
    });
    // 右滑事件
    document.addEventListener("swiperight", function(event) {
    
        var angle = event.detail.angle;
        angle = Math.abs(angle);
        	console.log('右滑事件：'+angle);
        /**
         * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
         */
        if(angle <15) {
            parentEvent(parent,"right");
        }
    });
});

/**
 * 触发父窗口自定义事件
 * @param {Object} wvobj 目标窗口对象
 * @param {Number} index 索引值
 * @param {String} direction 方向
 */
function parentEvent(wvobj, direction) {
    /**
     * 触发自定义事件
     * http://dev.dcloud.net.cn/mui/event/#customevent
     */
    mui.fire(wvobj, "swipe_event", {
        direction: direction
    });
}
/**
 * 请求数据
 */
var requestData=function(callbak){
	
}
var setData=function(data){
	
}