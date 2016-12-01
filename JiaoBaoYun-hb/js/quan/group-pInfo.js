mui.init()
var pInfo; //{"gid":1,"gutid":9,"utid":5,
//"ugname":"BugHunter","ugnick":"BugHunter",
//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge5.png","mstype":3}
var accountInfo;
mui.plusReady(function() {
		events.preload('zone_main.html',100);
		window.addEventListener('postPInfo', function(e) {
			pInfo = e.detail.data;
			console.log('獲取的個人信息：' + JSON.stringify(pInfo));
			getAccountInfo(manageAccountInfo);
		})
		addListener();
	})
	/**
	 * 獲取個人賬號信息
	 */
var getAccountInfo = function(callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: pInfo.utid,
		vtp: 'p'
	}, wd, function(data) {
		wd.close();
		console.log('詳細資料頁面獲取的個人資料：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			callback(data.RspData[0]);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
var manageAccountInfo = function(data) {
	accountInfo=data;
	console.log('獲取的個人賬號信息：' + JSON.stringify(data));
	//{"utid":5,"uid":"18853113151","uname":"test867830028690115",
	//"unick":"BugHunter","usex":0,"utxt":null,
	//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge5.png"}
	document.getElementById('info-headImg').src=data.uimg;
	document.getElementById('info-name').innerText=data.uname;
	document.getElementById('info-nick').innerText=data.unick;
}
var addListener=function(){
	events.addTap('personal-space',function(){
		events.fireToPageWithData('zone_main.html','postUTID',pInfo.utid);
	})
}
