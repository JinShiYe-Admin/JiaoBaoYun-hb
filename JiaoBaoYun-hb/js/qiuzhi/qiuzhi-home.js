events.initSubPage('qiuzhi-sub.html');
var allChannels;
mui.plusReady(function() {
		var curPage = plus.webview.currentWebview();
		curPage.addEventListener("show", function(e) {
			requestAllChannels(setChannels);
		})
		setListener();
	})
	//1.获取所有话题
function requestAllChannels(callback) {
	//所需参数
	var comData = {
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.获取所有话题
	postDataQZPro_getAllChannels(comData, wd, function(data) {
		wd.close();
		console.log('获取所有话题:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var temArr = data.RspData.Data;
			callback(temArr);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 设置频道
 * @param {Object} subjectArr
 */
var setChannels = function(subjectArr) {
	var subjects=document.getElementById('subjects-container');
	console.log('要加载的类别:'+JSON.stringify(subjectArr));
	allChannels=subjectArr;
	var allChannel={
		TabId:0,
		ChannelCode:00,
		ChannelName:"全部"
	}
	subjectArr.splice(0,0,allChannel);
	events.clearChild(subjects);
	for(var i in subjectArr){
		var a=document.createElement('a');
		if(i==0){
			a.className="mui-control-item mui-active";			
		}else{
			a.className="mui-control-item";
		}
		a.innerHTML=subjectArr[i].ChannelName;
		a.info=subjectArr[i];
		subjects.appendChild(a);
	}
	events.fireToPageNone('qiuzhi-sub.html','channelInfo',{curChannel:subjectArr[0],allChannels:allChannels});
}
var setListener=function(){
	mui('.tabs-channels').on('tap','.mui-control-item',function(){
		var channelInfo=this.info;
		events.fireToPageNone('qiuzhi-sub.html','channelInfo',{curChannel:channelInfo,allChannels:allChannels});
	})
}
