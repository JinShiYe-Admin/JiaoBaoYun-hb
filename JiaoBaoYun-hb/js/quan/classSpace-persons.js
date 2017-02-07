mui.init();
mui.plusReady(function() {
	window.addEventListener('personsList', function(e) {
		console.log('传过来的数值:' + JSON.stringify(e.detail.data));
		var classSpaceInfo = e.detail.data;
		var title=document.querySelector('.mui-title');
		events.clearChild(document.getElementById('gride'));
		if(classSpaceInfo.type) { //点赞
			title.innerText='谁点的赞';
			getZanPersons(classSpaceInfo.classSpaceId);
		} else { //查看
			title.innerText='谁看过';
			getChakanPersons(classSpaceInfo.classSpaceId);
		}
	})
})
var getZanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getIsLikeUsersById({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		console.log('获取的点赞列表数据：'+JSON.stringify(data));
		if(data.RspCode==0){
			if(data.RspData.Users.length>0){
				getPersonsInfo(data.RspData.Users);
			}else{
				mui.toast("没啥人点赞")
			}	
		}else{
			mui.toast('你逮到我啦，有错误')
		}
		
	})
}
var getPersonsInfo=function(userIds){
	var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl:userIds.toString(),//用户id，查询的值,p传个人ID,g传ID串
		vtp:'g'//查询类型,p(个人)g(id串)
	},wd,function(data){
		wd.close();
		console.log('获取的用户信息：'+JSON.stringify(data));
		var gride=document.getElementById('gride');
		createGride(gride,data.RspData);
	})
}
var getChakanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getReadUserBySpaceId({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		console.log('获取的已查看人员数据：'+JSON.stringify(data));
		if(data.RspCode==0){
			if(data.RspData.Users.length>0){
				getPersonsInfo(data.RspData.Users);
			}else{
				mui.toast("没啥人浏览")
			}	
		}else{
			mui.toast('你逮到我啦，有错误');
		}
	})
}