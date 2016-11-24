mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

mui.plusReady(function() {
	getStuList(); //获取学生列表
	getGroupList(); //获取所有的群
	//跳转到学生动态界面
	mui('.mui-table-view').on('tap', '.studentsdynamic', function() {
		var index = this.id.replace('studentsdynamic', '');
		mui.openWindow({
			url: 'studentdynamic_main.html',
			id: 'studentdynamic_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: ''
			},
		});
	});
	//跳转到班级动态界面
	mui('.mui-table-view').on('tap', '.tarClass', function() {
		var index = this.id.replace('tarClass', '');
		console.log('index：' + index)
		mui.openWindow({
			url: 'class_space.html',
			id: 'class_space.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: {
					userId: personalUTID,
					classId: datasource[index].gid
				},
				className: datasource[index].gname
			},
		});
	});

})

//获取学生列表
function getStuList() {
	//所需参数
	var comData = {
		utid: personalUTID
	};
	//返回值model：model_userDataInfo
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//24.通过用户表ID获取用户关联的学生
	postDataPro_PostUstu(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_PostUstu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);

		if(data.RspCode == 0) {

		} else {
			mui.toast(data.RspTxt);
		}
	});
}
//获取所有的群
function getGroupList() {
	//	//需要参数
	var comData = {
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群)
		vvl: personalUTID, //查询的各项，对应人的utid，可以是查询的任何人
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//	获取用户群
	postDataPro_PostGList(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_PostGList:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);

		if(data.RspCode == 0) {
			datasource = data.RspData; //底部列表数据
			requestTimes = datasource.length; //记录顶部 班级动态请求次数
			requestTimes2 = datasource.length; //记录底部 通过循环请求群用户列表请求次数
			var userList = []; //临时用户列表
			for(var i = 0; i < datasource.length; i++) {
				//判断img是否为null，或者空
				if(datasource[i].gimg == '' || datasource[i].gimg == null) { //赋值
					datasource[i].gimg = '../../image/utils/default_personalimage.png';
				} else { //修改值
					var myDate = new Date();
					datasource[i].uimg = datasource[i].uimg[i] + '?' + myDate.getTime();
				}
				getTopList(i); //获取顶部列表
				getBottomList(i, userList); //获取底部列表

			}

		} else {
			mui.toast(data.RspTxt);
		}
	});

}
//获取顶部列表
function getTopList(i) {
	var comData = {
		userId: personalUTID, //用户ID----utid
		classId: datasource[i].gid, //班级ID----cid
		pageIndex: '1', //当前页数
		pageSize: '1' //每页记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//	16.（班级空间）获取用户针对某班级的空间列表
	postDataPro_getClassSpacesByUserForClass(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_getClassSpacesByUserForClass{:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt + '}');
		if(data.RspCode == 0) {
			if(data.RspData.Data.length == 0) { //数据为空时 添加默认数据
				var temp = {
					index: i, //排序索引
					MsgContent: '暂无动态',
					PublishDate: '2016-11-17'
				}
				topArray.push(temp);
			} else { //取班级空间的第一条数据
				data.RspData.Data[0].index = i; //排序索引
				topArray.push(data.RspData.Data[0]);
			}

			requestTimes--;
			if(requestTimes == 0) { //循环请求班级空间完毕
				//排序
				topArray.sort(function(a, b) {
						return a.index - b.index
					})
					//				顶部列表添加cell
				var ul = document.getElementById('top-list');
				ul.innerHTML = '';
				for(var i = 0; i < topArray.length; i++) {
					var li = document.createElement('li');
					li.id = 'tarClass' + i;
					li.className = 'mui-table-view-cell mui-media tarClass';
					li.innerHTML = '<img class="mui-media-object mui-pull-left" src="' + datasource[i].gimg + '">' + '<p class="time">' + topArray[i].PublishDate +
						'</p>' +
						'<div class="mui-media-body">' +
						datasource[i].gname +
						'<p class="mui-ellipsis">' + topArray[i].MsgContent + '</p></div>';
					ul.appendChild(li);
				}

			}

		} else {
			mui.toast(data.RspTxt);
		}
	})
}
// 通过群ID获取群的正常用户
function getBottomList(index, userLists) {
	//需要参数
	var comData = {
		top: '10', //选择条数
		vvl: datasource[index].gid, //群ID，查询的值
		vvl1: '-1', //群员类型，0家长,1管理员,2老师,3学生,-1取全部

	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	// 通过群ID获取群的正常用户
	postDataPro_PostGusers(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var tepDic = {
				index: index, //排序索引
				data: data.RspData
			}
			userLists.push(tepDic);

			requestTimes2--;
			if(requestTimes2 == 0) { //全部请求完毕
				requestTimes2 = datasource.length; //重置请求次数为群的个数
				//				排序
				userLists.sort(function(a, b) {
						return a.index - b.index
					})
					//把用户列表添加到数据源中
				for(var i = 0; i < datasource.length; i++) {
					datasource[i].userList = userLists[i].data;

				}

				for(var i = 0; i < datasource.length; i++) {
					var userIds = []; //群用户id数组
					for(var j = 0; j < datasource[i].userList.length; j++) {
						tempModel = datasource[i].userList[j];
						//判断img是否为null，或者空
						if(tempModel.uimg == '' || tempModel.uimg == null) { //赋值
							tempModel.uimg = '../../image/utils/default_personalimage.png';
						} else { //修改值
							var myDate = new Date();
							tempModel.uimg = tempModel.uimg + '?' + myDate.getTime();
						}
						userIds.push(tempModel.utid)
					}
					userIds.join(',');
					var upString = '[' + userIds.join() + ']';
					getUserSpaces(upString, i); //获取多用户空间列表

				}

			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
//36.（用户空间）获取多用户空间列表
function getUserSpaces(upString, index) {
	//所需参数
	var comData = {
		userId: personalUTID, //用户ID
		publisherIds: upString //发布者ID，例如[1,2,3]
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//返回model：model_homeSchoolList，model_userNoteInfo
	//36.（用户空间）获取多用户空间列表
	postDataPro_getUserSpacesByUser(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_getUserSpacesByUser:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var userList = data.RspData.Data;//某群用户列表
			requestTimes2--; //全部请求完毕
			datasource[index].NoReadCnt = 0; //群未读信息条数
			//			计算群未读总数并加到数据源中
			for(var i = 0; i < userList.length; i++) {
				if(!userList[i].NoReadCnt){
					userList[i].NoReadCnt=0;
				}
				if(!userList[i].MsgContent){
					userList[i].MsgContent='暂无空间';
				}
				console.log('3333333333333===='+JSON.stringify(userList[i]));
				datasource[index].NoReadCnt = datasource[index].NoReadCnt + userList[i].NoReadCnt;
				mui.extend(datasource[index].userList[i], userList[i])
			}
			console.log('datasource===' + JSON.stringify(datasource));

			if(requestTimes2 == 0) { //请求完毕刷新界面
				refreshUI();
			}

		}

	})

}
//刷新界面
function refreshUI() {
	if(datasource.length == 0) {
		return;
	}

	if(isRefresh == 0) { //不是上拉刷新
		var seg = document.getElementById('segmentedControl');
		var userTable = document.getElementById('userList');
		for(var i = datasource.length - 1; i >= 0; i--) {
			var userList = datasource[i].userList; //用户列表数据
			var segitem = document.createElement('a');
			var userItem = document.createElement('div');
			if(i == 0) {
				segitem.className = 'mui-control-item mui-active';
				userItem.className = 'mui-control-content mui-active'
			} else {
				segitem.className = 'mui-control-item';
				userItem.className = 'mui-control-content'
			}
			segitem.href = '#item' + i;
			if(datasource[i].NoReadCnt != 0) {
				var span = document.createElement('span');
				span.className = 'mui-badge mui-badge-danger custom-badge1';
				span.innerHTML = datasource[i].NoReadCnt;

				segitem.insertBefore(span, segitem.firstChild);
				if(i == datasource.length - 1) {
					segitem.innerHTML = datasource[i].gname + segitem.innerHTML;
				} else {
					segitem.innerHTML = datasource[i].gname + segitem.innerHTML + '<span class="spliter">|</span>';
				}

			} else {
				if(i == datasource.length - 1) {
					segitem.innerHTML = datasource[i].gname;
				} else {
					segitem.innerHTML = datasource[i].gname + '<span class="spliter">|</span>';
				}
			}

			//在第一个位置中插入元素
			seg.insertBefore(segitem, seg.firstChild);
			userItem.id = 'item' + i;
			var ul = document.createElement('ul');
			ul.className = 'mui-table-view parent-table' + i;
			for(var j = 0; j < userList.length; j++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media parent-cell' + i;
				if(userList[j].NoReadCnt != 0) {
					noReadHTML = '<span style="float: left;" ><span  class="mui-badge mui-badge-danger custom-badge2">' + userList[j].NoReadCnt + '</span></span>';
				} else {
					noReadHTML = '';
				}
				li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="' + userList[j].uimg + '" />' +
					noReadHTML + '<p class="time">' + userList[j].PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
					userList[j].ugname + '<p class="mui-ellipsis">' + userList[j].MsgContent + '</p>';
					ul.appendChild(li);

			}
			userItem.insertBefore(ul, userItem.firstChild);
			userTable.insertBefore(userItem, userTable.firstChild)

		}
	} else { //下拉刷新
		var itemId = getActiveControl();
		var tableFlag = itemId.replace('#item', '');
		var flagInt = parseInt(tableFlag);
		var seg = document.getElementById('segmentedControl');
		var userTable = document.getElementById('userList');
		seg.innerHTML = '';
		userTable.innerHTML = '';
		for(var i = datasource.length - 1; i >= 0; i--) {
			var userList = datasource[i].userList; //用户列表数据
			var segitem = document.createElement('a');
			var userItem = document.createElement('div');
			if(i == flagInt) {
				segitem.className = 'mui-control-item mui-active';
				userItem.className = 'mui-control-content mui-active';
			} else {
				segitem.className = 'mui-control-item';
				userItem.className = 'mui-control-content'
			}

			segitem.href = '#item' + i;
			if(datasource[i].NoReadCnt != 0) {
				var span = document.createElement('span');
				span.className = 'mui-badge mui-badge-danger custom-badge1';
				span.innerHTML = datasource[i].NoReadCnt;
				segitem.insertBefore(span, segitem.firstChild);
				if(i == datasource.length - 1) {
					segitem.innerHTML = datasource[i].gname + segitem.innerHTML;
				} else {
					segitem.innerHTML = datasource[i].gname + segitem.innerHTML + '<span class="spliter">|</span>';
				}

			} else {
				if(i == datasource.length - 1) {
					segitem.innerHTML = datasource[i].gname;
				} else {
					segitem.innerHTML = datasource[i].gname + '<span class="spliter">|</span>';
				}
			}

			//在第一个位置中插入元素
			seg.insertBefore(segitem, seg.firstChild);
			userItem.id = 'item' + i;
			var ul = document.createElement('ul');
			ul.className = 'mui-table-view parent-table' + i;
			for(var j = 0; j < userList.length; j++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media parent-cell' + i;
				if(userList[j].NoReadCnt != 0) {
					noReadHTML = '<span style="float: left;" ><span  class="mui-badge mui-badge-danger custom-badge2">' + userList[j].NoReadCnt + '</span></span>';
				} else {
					noReadHTML = ''
				}
				li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="' + userList[j].uimg + '" />' +
					noReadHTML + '<p class="time">' + userList[j].PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
					userList[j].ugname + '<p class="mui-ellipsis">' + userList[j].MsgContent + '</p>';
				ul.appendChild(li);

			}
			userItem.insertBefore(ul, userItem.firstChild);
			userTable.insertBefore(userItem, userTable.firstChild)

		}

	}

	//跳转到家长空间界面
	for(var i = 0; i < datasource.length; i++) {
		for(var j = 0; j < datasource[i].userList.length; j++) {
			addBottomTap(i, j);
		}
	}

}
//点击底部列表cell 跳转到家长圈空间界面
function addBottomTap(tableIndex, cellIndex) {
	//	跳转到家长圈空间界面
	mui('.mui-table-view').on('tap', '.parent-cell' + tableIndex, function() {
		var publisherId = datasource[tableIndex].userList[cellIndex].utid //空间用户id
		mui.openWindow({
			url: 'zone_main.html',
			id: 'zone_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: publisherId
			}

		});
	});
}
//下拉刷新
function pulldownRefresh() {

	setTimeout(function() {
		isRefresh = 1; //下拉刷新
		datasource = []; //重置数据源
		topArray = []; //重置底部列表数据
		var itemId = getActiveControl(); //获取当前所选群的id
		var tableFlag = itemId.replace('#item', '');
		var flagInt = parseInt(tableFlag);
		getGroupList();
		//		var comData = {
		//			top: '10', //选择条数
		//			vvl: datasource[flagInt].gid, //群ID，查询的值
		//			vvl1: '-1', //群员类型，0家长,1管理员,2老师,3学生,-1取全部
		//
		//		};
		//		// 等待的对话框
		//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//		// 通过群ID获取群的正常用户
		//		postDataPro_PostGusers(comData, wd, function(data) {
		//			wd.close();
		//			console.log('postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		//			if(data.RspCode == 0) {
		//				datasource[flagInt].userList = data.RspData;
		//				var userList = datasource[flagInt].userList;
		//				var upString = '['
		//				for(var i = 0; i < userList.length; i++) {
		//					upString = upString + userList[i].utid + ',';
		//					if(i == userList.length - 1) {
		//						upString = upString + ']';
		//					}
		//				}
		//				upString = upString.replace(',]', ']');
		//				getUserSpaces(upString, tableFlag);
		//36.（用户空间）获取多用户空间列表
		//所需参数
		//				var comData = {
		//					userId: personalUTID, //用户ID
		//					publisherIds: upString //发布者ID，例如[1,2,3]
		//				};
		//				//返回model：model_homeSchoolList，model_userNoteInfo
		//				postDataPro_getUserSpacesByUser(comData, wd, function(data) {
		//						console.log('postDataPro_getUserSpacesByUser:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		//						if(data.RspCode == 0) {
		//							for(var i = 0; i < datasource[flagInt].userList.length; i++) {
		//								console.log(JSON.stringify(datasource));
		//								mui.extend(datasource[flagInt].userList[i], data.RspData[i])
		//							}
		//						}
		//						console.log(JSON.stringify(datasource));
		//
		//					})
		//				var parentCell = 'parent-cell' + tableFlag;
		//				var item = document.getElementById('item' + tableFlag);
		//				item.removeChild(item.firstChild);
		//				var ul = document.createElement('ul');
		//				ul.className = 'mui-table-view parent-table' + tableFlag;
		//				var userList = datasource[flagInt].userList;
		//				for(var j = 0; j < userList.length; j++) {
		//					var li = document.createElement('li');
		//					li.className = 'mui-table-view-cell mui-media parent-cell' + tableFlag;
		//					li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../../image/tab_zone/u72.png" />' +
		//						'<span style="float: left;" ><span  class="mui-badge mui-badge-danger custom-badge2">' + userList[0].gid + '</span></span>' + '<p class="time">' + userList[j].PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
		//						userList[j].ugname + '<p class="mui-ellipsis">' + userList[j].MsgContent + '</p>';
		//					ul.insertBefore(li, ul.firstChild);
		//
		//				}
		//				item.insertBefore(ul, item.firstChild);
		//			} else {
		//				mui.toast(data.RspTxt);
		//			}
		//		})

		//		for(var i = datasource[flagInt].userList; i < len; i++) {
		//			var li = document.createElement('li');
		//			li.className = 'mui-table-view-cell mui-media ' + parentCell;
		//			li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../image/tab_zone/u34.png">\<p class="time">10月18</p>\<div class="mui-media-body">张曦曦<p class="mui-ellipsis">\在今天的全校演讲比赛中，我班有6名同学获奖...</p>\</div>';
		//			//下拉刷新，新纪录插到最前面；
		//			table.insertBefore(li, table.firstChild);
		//		}
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);
}
var count = 0;

function pullupRefresh() {
	//	setTimeout(function() {
	mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
	//		var itemId = getActiveControl();
	//		console.log(itemId);
	//		var table;
	//		var cells;
	//		if(itemId == '#item1') {
	//			parentCell = 'parent-cell1';
	//			table = document.body.querySelector('.parent-table1');
	//			cells = document.body.querySelectorAll('.parent-cell1');
	//		} else {
	//			parentCell = 'parent-cell2';
	//			table = document.body.querySelector('.parent-table2');
	//			cells = document.body.querySelectorAll('.parent-cell2');
	//		}
	//		for(var i = cells.length, len = i + 20; i < len; i++) {
	//			var li = document.createElement('li');
	//			li.className = 'mui-table-view-cell mui-media ' + parentCell;
	//			li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../image/tab_zone/u34.png">\<p class="time">10月18</p>\<div class="mui-media-body">张曦曦<p class="mui-ellipsis">\在今天的全校演讲比赛中，我班有6名同学获奖...</p>\</div>';
	//			//下拉刷新，新纪录插到最前面；
	//			table.appendChild(li);
	//		}
	//	}, 1500);
}
//获取所选群的id
function getActiveControl() {
	var segmentedControl = document.getElementById("segmentedControl");
	var links = segmentedControl.getElementsByTagName('a');
	for(var i = 0; i < links.length; i++) {
		if(links[i].getAttribute('class').indexOf('mui-active') > 0) {
			var id = links[i].getAttribute('href');
			return id;
		}
	}
}