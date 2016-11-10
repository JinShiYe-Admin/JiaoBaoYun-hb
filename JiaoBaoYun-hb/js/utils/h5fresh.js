var ws=null;
var list=null;
// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady(){
	ws=plus.webview.currentWebview();
	ws.setPullToRefresh({support:true,
		height:"50px",
		range:"200px",
		contentdown:{
			caption:"下拉可以刷新"
		},
		contentover:{
			caption:"释放立即刷新"
		},
		contentrefresh:{
			caption:"正在刷新..."
		}
	},onRefresh);
	plus.nativeUI.toast("下拉可以刷新");
}
// 判断扩展API是否准备，否则监听"plusready"事件
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
// DOM构建完成获取列表元素
document.addEventListener("DOMContentLoaded",function(){
	list=document.getElementById("list");
})
// 刷新页面
function onRefresh(){
	setTimeout(function(){
		if(list){
			var item=document.createElement("li");
			item.innerHTML="<span>New Item "+(new Date())+"</span>";
			list.insertBefore(item,list.firstChild);
		}
		ws.endPullToRefresh();
	},2000);
}