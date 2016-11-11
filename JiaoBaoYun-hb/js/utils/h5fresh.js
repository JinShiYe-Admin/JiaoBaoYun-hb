/**
 * h5下拉刷新
 * 解决与水平滚动的冲突
 * @anthor an
 */
var h5fresh=(function(mod){
	var ws=null;//当前webview
	var list=null;//列表
	// 扩展API加载完毕，现在可以正常调用扩展API 
	function plusReady(){
		ws=plus.webview.currentWebview();
		ws.setPullToRefresh({
			support:true,//是否开启Webview窗口的下拉刷新功能
			height:"50px",//窗口的下拉刷新控件高度
			range:"200px",//)窗口可下拉拖拽的范围
			contentdown:{
				caption:"下拉可以刷新"
			},
			contentover:{
				caption:"释放立即刷新"
			},
			contentrefresh:{
				caption:"正在刷新..."
			}
		},onRefresh);//刷新
	//	plus.nativeUI.toast("下拉可以刷新");
	}
	mod.addRefresh=function(listId){
		// 判断扩展API是否准备，否则监听"plusready"事件
		if(window.plus){
			plusReady();
		}else{
			document.addEventListener("plusready",plusReady,false);
		}
		//获取dom
		document.addEventListener("DOMContentLoaded",function(){
			list=document.getElementById(listId);
		})
	}

	// 刷新页面
	function onRefresh(){
		setTimeout(function(){
			if(list){
				var item=document.createElement("li");
				item.innerHTML="<span>New Item "+(new Date())+"</span>";
				list.appendChild(item,list.firstChild);
			}
			ws.endPullToRefresh();
		},2000);
	}

	return mod
})(h5fresh||{})
