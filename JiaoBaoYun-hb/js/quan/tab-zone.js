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
	getGroupList();//获取所有的群

	//跳转到学生动态界面
	mui('.mui-table-view').on('tap', '.studentsdynamic', function() {

		mui.openWindow({
			url: 'studentdynamic_main.html',
			id: 'studentdynamic_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			}
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
			datasource = data.RspData;
			requestTimes = datasource.length;//记录请求次数
			requestTimes2 = datasource.length;//记录请求次数
			var userList = [];
			for(var i = 0; i < datasource.length; i++) {
				getTopList(i);
				getBottomList(i, userList);

			}

		} else {
			mui.toast(data.RspTxt);
		}
	});

}
//获取顶部列表
function getTopList(i) {

	//获取个人信息
	var comData = {
		userId: personalUTID, //用户ID----utid
		classId: datasource[i].gid, //班级ID----cid
		pageIndex: '1', //当前页数
		pageSize: '1' //每页记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getClassSpacesByUserForClass(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_getClassSpacesByUserForClass{:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt + '}');
		if(data.RspCode == 0) {
			if(data.RspData.Data.length == 0) {
				var temp = {
					index: i,
					MsgContent: '暂无动态',
					PublishDate: '2016-11-17'
				}
				topArray.push(temp);
			} else {
				data.RspData.Data[0].index = i;
				topArray.push(data.RspData.Data[0]);
			}

			requestTimes--;
			if(requestTimes == 0) {
				topArray.sort(function(a, b) {
					return a.index - b.index
				})
				var ul = document.getElementById('top-list');
				for(var i = 0; i < topArray.length; i++) {
					var li = document.createElement('li');
					li.id = 'tarClass' + i;
					li.className = 'mui-table-view-cell mui-media tarClass';
					li.innerHTML = '<img class="mui-media-object mui-pull-left" src="../../image/tab_zone/u72.png">' + '<p class="time">' + topArray[i].PublishDate +
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
function getBottomList(i, userList) {
	//需要参数
	var comData = {
		top: '10', //选择条数
		vvl: datasource[i].gid, //群ID，查询的值
		vvl1: '-1', //群员类型，0家长,1管理员,2老师,3学生,-1取全部

	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	// 通过群ID获取群的正常用户
	postDataPro_PostGusers(comData, wd, function(data) {
		wd.close();
		console.log('postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var tepDic = {
				index: i,
				data: data.RspData
			}
			userList.push(tepDic);

			requestTimes2--;
			if(requestTimes2 == 0) { //全部请求完毕0
				userList.sort(function(a, b) {
					return a.index - b.index
				})
				for(var i = 0; i < datasource.length; i++) {
					datasource[i].userList = userList[i].data;
				}
				userIds = [];
//for(var i=0;i<datasource[0].userList;i++){
//	userIds.push(datasource[0].userList.utid)
//}
//console.log('dddddddd'+JSON.stringify(userIds));
				getUserSpaces(0);

			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

function getUserSpaces(classFlag) {
	var List = datasource[classFlag].userList;
	classFlag++;

	var flag2 = List.length;
	for(var z = 0; z < List.length; z++) {
		var comData = {
			userId: personalUTID, //用户ID
			publisherId: List[z].utid, //发布用户ID
			noteType: '2', //信息类型,1云笔记,2个人空间动态
			pageIndex: '1', //当前页数
			pageSize: '1' //每页记录数
		};
		// 等待的对话框
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_getUserSpacesByUserForPublisher(comData, wd, function(data) {
			wd.close();
			console.log('postDataPro_getUserSpacesByUserForPublisher:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				flag2--;
				if(flag2 == 0) {
					var tempResult = data.RspData.Data;
					for(var i = 0; i < tempResult.length; i++) {
						for(var j = 0; j < List.length; j++) {
							if(List[j].utid == tempResult[i].PublisherId) {
								List[j].PublishDate = tempResult[i].PublishDate;
								List[j].MsgContent = tempResult[i].MsgContent;
							}
						}
					}

					if(classFlag < datasource.length) {

						getUserSpaces(classFlag);
					} else {
						refreshUI();

					}

				}
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
}



function refreshUI() {
	if(datasource.length == 0) {
		return;
	}

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
		var span = document.createElement('span');
		span.className = 'mui-badge mui-badge-danger custom-badge1';
		span.innerHTML = '3'

		segitem.insertBefore(span, segitem.firstChild);
		if(i == datasource.length - 1) {
			segitem.innerHTML = datasource[i].gname + segitem.innerHTML;
		} else {
			segitem.innerHTML = datasource[i].gname + segitem.innerHTML + '<span class="spliter">|</span>';
		}

		//在第一个位置中插入元素
		seg.insertBefore(segitem, seg.firstChild);
		userItem.id = 'item' + i;
		var ul = document.createElement('ul');
		ul.className = 'mui-table-view parent-table' + i;
		for(var j = 0; j < userList.length; j++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media parent-cell' + i;
			li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../../image/tab_zone/u72.png" />' +
				'<span style="float: left;" ><span  class="mui-badge mui-badge-danger custom-badge2">' + userList[0].gid + '</span></span>' + '<p class="time">' + userList[j].PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
				userList[j].ugname + '<p class="mui-ellipsis">' + userList[j].MsgContent + '</p>';
			ul.insertBefore(li, ul.firstChild);

		}
		userItem.insertBefore(ul, userItem.firstChild);
		userTable.insertBefore(userItem, userTable.firstChild)

	}
	//跳转到家长空间界面
	for(var i = 0; i < datasource.length; i++) {
			//跳转到家长空间界面
		mui('.mui-table-view').on('tap', '.parent-cell' + i, function() {
			mui.openWindow({
				url: 'zone_main.html',
				id: 'zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				}
			});
		});
	}

}

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

function pulldownRefresh() {

	setTimeout(function() {
		var itemId = getActiveControl();
		var tableFlag = itemId.replace('#item', '');
		var flagInt = parseInt(tableFlag);
		var comData = {
			top: '10', //选择条数
			vvl: datasource[flagInt].gid, //群ID，查询的值
			vvl1: '-1', //群员类型，0家长,1管理员,2老师,3学生,-1取全部

		};
		// 等待的对话框
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		// 通过群ID获取群的正常用户
		postDataPro_PostGusers(comData, wd, function(data) {
			wd.close();
			console.log('postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				datasource[flagInt].userList = data.RspData;
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
			} else {
				mui.toast(data.RspTxt);
			}
		})

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