var personalUTID;
var showCity;
var pageIndex;
mui.init();
mui.plusReady(function() {
	// 获取当前窗口对象
	var self = plus.webview.currentWebview();
	h5fresh.addRefresh(function() {

	})
	window.addEventListener('cityInfo', function(e) {
			showCity = e.detail;
			console.log("展示子页面获取的城市信息：" + JSON.stringify(showCity));
			personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
			pageIndex = 1;
			requestData();
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
		console.log('左滑事件：' + angle);
		/**
		 * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
		 */
		if(angle > 100 && angle < 185) {
			parentEvent(parent, "left");
		}
	});
	// 右滑事件
	document.addEventListener("swiperight", function(event) {

		var angle = event.detail.angle;
		angle = Math.abs(angle);
		console.log('右滑事件：' + angle);
		/**
		 * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
		 */
		if(angle < 15) {
			parentEvent(parent, "right");
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
var requestData = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	/**
	 * 请求区域内的动态
	 */
	postDataPro_getUserSpacesByArea({
		userId: personalUTID, //用户ID
		area: showCity.acode, //区域
		pageIndex: pageIndex, //当前页数
		pageSize: 10 //每页记录数
	}, wd, function(data) {
		wd.close();
		console.log('展示获取的数据：' + JSON.stringify(data));
		if(data.RspCode == 0 && data.RspData.Data.length > 0) {
			getPersonIds(data.RspData.Data);
		} else {

		}
	})
}
/**
 * 获取所有人的id
 * @param {Object} data
 */
var getPersonIds = function(data) {
	var personIds = [];
	for(var i in data) {
		personIds.push(data[i].PublisherId);
		if(data.Comments) {
			for(var j in data[i].Comments) {
				if(data[i].Comments[j].UserId) {
					personIds.push(data[i].Comments[j].UserId);
				}
				if(data.Comments[j].ReplyId) {
					personIds.push(data[i].Comments[j].ReplyId);
				}
			}
		}
	}
	personIds = events.arraySingleItem(personIds);
	//如果只有一个id,通过串请求数据会有问题
	//所以另加一个id,以防不测
	if(personIds.length == 1) {
		var extraId=personIds[0]==1?2:personIds[0]-1;
		personIds.push();
	}
	getPersonalInfo(data, personIds);
}
/**
 * 
 * @param {Object} data
 * @param {Object} ids
 */
var getPersonalInfo = function(data, ids) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: ids.toString(), //用户id，查询的值,p传个人ID,g传ID串
		vtp: 'g' //查询类型,p(个人)g(id串)
	}, wd, function(personsData) {
		wd.close();
		console.log('展示子页面获取的个人信息：' + JSON.stringify(personsData));
		if(personsData.RspCode == 0) {
			data = rechargeData(data, personsData.RspData)
			console.log("重组后的数据：" + JSON.stringify(data));
			setData(data);
		} else {

		}
	})
}
/**
 * 重组数据
 * @param {Object} data 要重组的数据
 * @param {Object} personsData 添加的个人信息
 */
var rechargeData = function(data, personsData) {
	console.log('要重组的数据:' + JSON.stringify(data));
	//	console.log('加入的数据：'+JSON.stringfy(personsData));
	for(var i in data) {
		for(var j in personsData) {
			if(data[i].PublisherId == personsData[j].utid) {
				data[i].PublisherName = personsData[j].unick;
				data[i].PublisherImg = personsData[j].uimg;
			}
			if(data[i].Comments.length > 0) {
				for(var m in data[i].Comments) {
					if(data[i].Comments[m].UserId == personsData[j].utid) {
						data[i].Comments[m].UserName = personsData[j].unick;
					}
					if(data[i].Comments[m].ReplyId == personsData[j].utid) {
						data[i].Comments[m].ReplyName = personsData[j].unick;
					}
				}
			}

		}
	}
	return data;//返回重组后数据
}
/**
 * 放置数据
 * @param {Object} data
 */
var setData = function(data) {
	var list = document.getElementById('list-container');
	var li = document.createElement('li');
	li.innerHTML = '<a><div></div></a>'
}