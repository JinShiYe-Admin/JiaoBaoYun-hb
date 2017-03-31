mui.init();
mui(".mui-scroll-wrapper").scroll();
var classSpaceInfo;
mui.plusReady(function() {
	window.addEventListener('personsList', function(e) {
		console.log('传过来的数值:' + JSON.stringify(e.detail.data));
		classSpaceInfo = e.detail.data;
		var title = document.querySelector('.mui-title');
		document.querySelector("#person-list").innerHTML="";
//		events.clearChild(document.getElementById('gride'));
		if(classSpaceInfo.type==1) { //点赞
			title.innerText = '谁点的赞';
			getZanPersons(classSpaceInfo.classSpaceId);
		} else if(classSpaceInfo.type==0){ //查看
			title.innerText = '谁看过';
			getChakanPersons(classSpaceInfo.classSpaceId);
		}else if(classSpaceInfo.type==3){
			title.innerText = '谁点的赞';
			setData(classSpaceInfo.zanList);
		}
	})
})
/**
 * 获取点赞成员
 * @param {Object} classSpaceId
 */
var getZanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getIsLikeUsersById({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		console.log('获取的点赞列表数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.Users.length > 0) {
				getPersonsInfo(data.RspData.Users);
			} else {
				mui.toast("没啥人点赞")
			}
		} else {
			mui.toast('你逮到我啦，有错误')
		}

	})
}
//获取人员基本信息
var getPersonsInfo = function(users) {
	var userIds=[];
	for(var i in users){
		userIds.push(users[i].UserId);
	}
	var infos = [];
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: userIds.toString(), //用户id，查询的值,p传个人ID,g传ID串
		vtp: 'g' //查询类型,p(个人)g(id串)
	}, wd, function(data) {
		wd.close();
		console.log("获取的个人信息：" + JSON.stringify(data))
		if(data.RspCode == 0) {
			for(var i in users){
				for(var j in data.RspData){
					if(users[i].UserId==data.RspData[j].utid){
						jQuery.extend(data.RspData[j],users[i]);
					}
				}
			}
			getGroupUsers(userIds,data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 
 * @param {Object} users 接口获取的信息
 * @param {Object} userIds 用户ids
 * @param {Object} infos
 */
var getGroupUsers = function(userIds, infos) {
	var comData = {
		top: -1, //选择条数
		vvl: classSpaceInfo.classId.toString(), //群ID或IDS,查询的值,多个用逗号隔开
		vvl1: -1 //群员类型，0家长,1管理员,2老师,3学生,-1取全部
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGusers(comData, wd, function(data) {
		wd.close();
		console.log('获取的用户信息：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			getRemark(userIds, data.RspData, infos);
		} else {
			mui.toast(data.RspTxt);
		}

	})
}
//获取备注
var getRemark = function(userIds, groupPersons, infos) {
	var wd = events.showWaiting();
	postDataPro_PostUmk({
		vvl: userIds.toString()
	}, wd, function(data) {
		wd.close();
		console.log("获取的备注信息：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			for(var i in data.RspData) {
				for(var j in groupPersons) {
					if(data.RspData[i].butid == groupPersons[j].utid) {
						jQuery.extend(groupPersons[j], data.RspData[i]);
						break;
					}
				}
			}
		}
		rechargeInfo(groupPersons, infos);
	})
}
//重整数据
var rechargeInfo = function(groupPersons, infos) {
	//	var infos = [];
	console.log("userIds:" + JSON.stringify(infos) + ';人员信息：' + JSON.stringify(groupPersons))
	for(var m in infos) {
		for(var n in groupPersons) {
			if(infos[m].utid == groupPersons[n].utid) {
				//				console.log("userId:" + userIds[m] + ";groupPersonsId:" + groupPersons[n].utid)
				//				infos.push(groupPersons[n]);
				jQuery.extend(infos[m], groupPersons[n]);
				break;
			}
		}
	}
	
//	var gride = document.getElementById('gride');
	console.log("最终要放置的数据：" + JSON.stringify(infos))
	setData(infos);
}
var setData=function(infos){
	var list=document.getElementById("person-list");
	for(var i in infos){
		var li=document.createElement("li");
		li.className="mui-table-view-cell";
		li.innerHTML=createInner(infos[i]);
		list.appendChild(li);
	}

}
var createInner=function(person){
	return '<div class="person-cell"><img src="'+updateHeadImg(person.uimg,2)+'"/><div class="person-info"><h6>'+
	getName(person)+'</h6>'+getTime(person)+'</div></div>'
}
var getName=function(person){
	if(person.bunick){
		return person.bunick;
	}
	if(person.ugname){
		return person.ugname;
	}
	return person.unick;
}
var getTime=function(person){
	if(person.ReadDate){
	  return '<p>'+events.shortForDate(getTime(person))+'</p>'
	}
	if(person.LikeDate){
		return '<p>'+events.shortForDate(getTime(person))+'</p>'
	}
	return "";
}
/**
 * 获取浏览的信息
 * @param {Object} classSpaceId
 */
var getChakanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getReadUserBySpaceId({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		console.log('获取的已查看人员数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.Users.length > 0) {
				getPersonsInfo(data.RspData.Users);
			} else {
				mui.toast("没啥人浏览");
			}
		} else {
			mui.toast('你逮到我啦，有错误');
		}
	})
}