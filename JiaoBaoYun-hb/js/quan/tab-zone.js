mui.init({

});
mui.plusReady(function() {
	getStuList(); //获取学生列表
	addSomeEvent();

})

function addSomeEvent() {
	//跳转到学生动态界面
	mui('.mui-table-view').on('tap', '.studentsdynamic', function() {
		var index = this.id.replace('studentsdynamic', '');
		console.log('studentsdynamic====' + index)
		mui.openWindow({
			url: 'studentdynamic_main.html',
			id: 'studentdynamic_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: {
					studentId: topStudentArr[index].stuid,
					classId: topStudentArr[index].gid,
					studentName: topStudentArr[index].stuname,
					stuimg: topStudentArr[index].stuimg
				}

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
	window.addEventListener('infoChanged', function() {
		var wobj = plus.webview.currentWebview();
		wobj.reload(true);
		//		personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
		//
		//		datasource = []; //底部列表数据
		//		topStudentArr = [];
		//		topArray = []; //顶部班级列表数据
		//		requestTimes = 0; //记录班级空间请求次数--等于0时，请求完毕，刷新界面
		//		requestTimes2 = 0; //记录群用户列表请求次数--等于0时，请求完毕，刷新界面
		//		requestTimes3 = 0;
		//		isRefresh = 0; //是否下拉刷新--1：下拉刷新 0：不是下拉刷新
		//		selectCell = {}; //选择的cell
		//		var ul = document.getElementById('top-list');
		//		ul.innerHTML = '';
		//
		//		var seg = document.getElementById('segmentedControl'); //群名称segmentedControl
		//		var userTable = document.getElementById('userList'); //多个放置用户列表
		//		seg.innerHTML = '';
		//		userTable.innerHTML = '';
		//		getStuList();
	})
	window.addEventListener('addUserSpaceForMutiUsers', function(data) {
		var userIdArr = [];
		for(var i = 0; i < datasource.length; i++) {
			var tempUserList = datasource[i].userList;

			for(var j = 0; j < tempUserList.length; j++) {
				var userId = tempUserList[j].utid;
				userIdArr.push(userId);
			}
		}
		userIdArr = arrayDupRemoval(userIdArr)
		var userIds = arrayToStr(userIdArr);
		for(var z=0;z<userIds.length;z++){
			if(userIds[z]==personalUTID){
				userIds.slice(z,1);
				break;
			}
		}
		

		data.detail.postData.userIds = userIds
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_addUserSpace(data.detail.postData, wd, function(data) {
			wd.close();
			mui.toast('发布成功！');
			console.log('推送个人空间成功' + JSON.stringify(data));
			var wobj = plus.webview.currentWebview();
			wobj.reload(true);
		})
	})

	window.addEventListener('setRead', function(e) {
		var tableIndex = selectCell.tableIndex;
		var cellIndex = selectCell.cellIndex;
		var cellNoReadCnt = selectCell.NoReadCnt
		datasource[tableIndex].userList[selectCell.cellIndex].NoReadCnt = 0;
		datasource[tableIndex].NoReadCnt = datasource[tableIndex].NoReadCnt - cellNoReadCnt;
		var currentTable = document.getElementsByClassName('parent-table' + tableIndex);
		var ul = currentTable[0];
		var li = ul.children[cellIndex];
		var tempModel = datasource[tableIndex].userList[cellIndex];
		li.innerHTML = '	<img class="mui-media-object mui-pull-left dynamic-personal-image" src="' + tempModel.uimg + '" />' + '<p class="time">' + tempModel.PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
			tempModel.ugname + '<p class="mui-ellipsis">' + tempModel.MsgContent + '</p>';

		var seg = document.getElementById('segmentedControl');
		var a = seg.children[tableIndex];
		a.innerHTML = '';
		var lineHTML = '<span class="spliter">|</span>';
		if(tableIndex == datasource.length - 1) {
			lineHTML = '';
		}
		if(datasource[tableIndex].NoReadCnt != 0) {
			var span = document.createElement('span');
			span.className = 'mui-badge mui-badge-danger custom-badge1';
			span.innerHTML = datasource[tableIndex].NoReadCnt;
			a.appendChild(span);

			a.innerHTML = datasource[tableIndex].gname + a.innerHTML + lineHTML;

		} else {
			a.innerHTML = datasource[tableIndex].gname + lineHTML;
		}

	});
	var ws = plus.webview.currentWebview();
	ws.setPullToRefresh({
		support: true, //是否开启Webview窗口的下拉刷新功能
		height: "50px", //窗口的下拉刷新控件高度
		range: "200px", //)窗口可下拉拖拽的范围
		contentdown: {
			caption: "下拉可以刷新"
		},
		contentover: {
			caption: "释放立即刷新"
		},
		contentrefresh: {
			caption: "正在刷新..."
		}
	}, pulldownRefresh); //刷新
	//	plus.nativeUI.toast("下拉可以刷新");
}

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
		console.log('获取学生列表_PostUstu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);

		if(data.RspCode == 0 || data.RspCode == 9) {//9为查询记录为空
			topStudentArr = data.RspData;
			if(!topStudentArr || topStudentArr.length == 0) {//如果查询记录为空
				var ul = document.getElementById('top-list');
				ul.innerHTML = '';
				getGroupList();//获取所有群
				return;
			}
			requestTimes3 = topStudentArr.length;
			var StuDyArr = [];
			console.log('topStudentArr===' + JSON.stringify(topStudentArr));

			for(var i = 0; i < topStudentArr.length; i++) {
				getNotes(i, StuDyArr);//获取点到记事
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 获取用户针对某学生的点到记事列表
 * @param {Object} pageIndex 当前页数
 * @param {Object} pageSize 每页记录数
 */
function getNotes(index, StuDyArr) {
	//4.（点到记事）获取用户针对某学生的点到记事列表
	//所需参数
	var comData = {
		userId: personalUTID, //用户ID----utid
		studentId: topStudentArr[index].stuid, //学生ID----stuid
		classId: topStudentArr[index].gid,
		pageIndex: '1', //当前页数
		pageSize: '1' //每页记录数
	};
	//返回model：model_homeSchoolList,model_userNoteInfo
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getNotesByUserForStudent(comData, wd, function(data) {
		console.log('某学生的点到记事列表_getNotesByUserForStudent:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var tempArr = data.RspData.Data;
			if(tempArr.length == 0) { //数据为空时 添加默认数据
				var temp = {
					index: index, //排序索引
					MsgContent: '暂无学生动态',
					PublishDate: ''
				}
				StuDyArr.push(temp);
			} else { //取班级空间的第一条数据
				tempArr[0].index = index; //排序索引
				StuDyArr.push(tempArr[0]);
			}
			requestTimes3--;
			if(requestTimes3 == 0) { //循环请求班级空间完毕
				//排序
				StuDyArr.sort(function(a, b) {
					return a.index - b.index
				})
				console.log('tempArr===' + JSON.stringify(tempArr));
				//				顶部列表添加cell
				var ul = document.getElementById('top-list');
				ul.innerHTML = '';
				for(var i = 0; i < topStudentArr.length; i++) {
					var li = document.createElement('li');
					li.id = 'studentsdynamic' + i;
					li.className = 'mui-table-view-cell mui-media studentsdynamic';

					li.innerHTML = '<img class="mui-media-object mui-pull-left dynamic-personal-image " src="' + updateHeadImg(topStudentArr[i].stuimg, 2) + '">' +
						'<p class="time">' + StuDyArr[i].PublishDate +
						'</p>' +
						'<div class="mui-media-body">' +
						topStudentArr[i].stuname +
						'<p class="mui-ellipsis">' + StuDyArr[i].MsgContent + '</p></div>';
					ul.appendChild(li);
				}
				getGroupList();

			}

		} else {
			mui.toast('获取点到记事列表:' + data.RspTxt);
		}
		wd.close();
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
		console.log('获取用户群_PostGList:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);

		if(data.RspCode == 0) {
			showBlankPage(false);
			datasource = data.RspData; //底部列表数据
			var tempArr = [];
			var tempDatasource = [];
//			群去重
			for(var i = 0; i < datasource.length; i++) {
				if(tempArr.indexOf(datasource[i].gid) > -1) {
					//					console.log(i+'已存在'+datasource[i].gid);
				} else {
					//					console.log(i+'不存在'+datasource[i].gid);
					tempArr.push(datasource[i].gid);
					tempDatasource.push(datasource[i]);
				}

			}
			datasource = tempDatasource;

			requestTimes = datasource.length; //记录顶部 班级动态请求次数
			requestTimes2 = datasource.length; //记录底部 通过循环请求群用户列表请求次数
			var userList = []; //临时用户列表
			for(var i = 0; i < datasource.length; i++) {

				//判断img是否为null，或者空
				datasource[i].gimg = updateHeadImg(datasource[i].gimg, 2)

				getTopList(i); //获取顶部列表
				getBottomList(i, userList); //获取底部列表

			}

		} else if(data.RspCode == 9) { //没有群
			showBlankPage(true);//显示空白页

		} else {
			mui.toast(data.RspTxt);
		}
	});

}
//获取顶部列表
function getTopList(index) {
	
	var comData = {
		userId: personalUTID, //用户ID----utid
		classId: datasource[index].gid, //班级ID----cid
		pageIndex: '1', //当前页数
		pageSize: '1' //每页记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//	16.（班级空间）获取用户针对某班级的空间列表
	postDataPro_getClassSpacesByUserForClass(comData, wd, function(data) {
		wd.close();
		console.log('某班级的空间列表_getClassSpacesByUserForClass{:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt + '}');
		if(data.RspCode == 0) {
			if(data.RspData.Data.length == 0) { //数据为空时 添加默认数据
				var temp = {
					index: index, //排序索引
					MsgContent: '暂无动态',
					PublishDate: '2016-11-17'
				}
				topArray.push(temp);
			} else { //取班级空间的第一条数据
				data.RspData.Data[0].index = index; //排序索引
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
				console.log('topArray====' + JSON.stringify(topArray))
				for(var i = 0; i < topArray.length; i++) {
					var li = document.createElement('li');
					li.id = 'tarClass' + i;
					li.className = 'mui-table-view-cell mui-media tarClass';
					li.innerHTML = '<img class="mui-media-object mui-pull-left dynamic-personal-image " src="' + datasource[i].gimg + '">' + '<p class="time">' + topArray[i].PublishDate +
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
		console.log('通过群ID获取群的正常用户_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
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
						tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
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
		console.log('获取多用户空间列表_getUserSpacesByUser:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var userList = data.RspData.Data; //某群用户列表
			requestTimes2--; //全部请求完毕
			datasource[index].NoReadCnt = 0; //群未读信息条数
			//			计算群未读总数并加到数据源中
			var tempUserList = datasource[index].userList;
			for(var i = 0; i < userList.length; i++) {
				if(!userList[i].NoReadCnt) {
					userList[i].NoReadCnt = 0;
				}
				if(!userList[i].MsgContent) {
					userList[i].MsgContent = '暂无空间';
				}
				
			}
			
			for(var i = 0; i < userList.length; i++) {
				for(var j = 0; j < tempUserList.length; j++) {
					if((tempUserList[j].utid == userList[i].PublisherId)) {
						mui.extend(userList[i], tempUserList[j])
						tempUserList.splice(j, 1);
						break;

					}
				}

			}
			datasource[index].userList = userList;
			var groupUserList = datasource[index].userList;
			//			群用户去重
			var tempUtidArr=[];
			var tempUserArr=[];

			for(var i=0;i<groupUserList.length;i++){
							if(groupUserList[i].mstype == 0) { //0家长,1管理员,2老师,3学生
				groupUserList[i].mstypeName =  '[家长]';
			} else if(groupUserList[i].mstype == 1) {
				groupUserList[i].mstypeName =  '[管理员]';
			} else if(groupUserList[i].mstype == 2) {
				groupUserList[i].mstypeName =  '[老师]';
			} else {
				groupUserList[i].mstypeName =  '[学生]';
			}
				var Arrindex = tempUtidArr.indexOf(groupUserList[i].utid);
				if(Arrindex>-1){
					tempUserArr[Arrindex].ugname = tempUserArr[Arrindex].ugname+groupUserList[i].mstypeName;
				}else{
					groupUserList[i].ugname = groupUserList[i].ugname+groupUserList[i].mstypeName;
					tempUtidArr.push(groupUserList[i].utid);
					tempUserArr.push(groupUserList[i]);
					
				}
			}
			datasource[index].userList = tempUserArr;
			for(var i=0;i<tempUserArr.length;i++){
				datasource[index].NoReadCnt = datasource[index].NoReadCnt + tempUserArr[i].NoReadCnt;
			}
//			console.log('datasource[index].userList==='+datasource[index].userList);
			if(requestTimes2 == 0) { //请求完毕刷新界面
				console.log('底部列表全部数据' + JSON.stringify(datasource));
				refreshUI();
			}

		}

	})

}
//刷新界面
function refreshUI() {
	console.log(datasource.length);
	if(datasource.length == 0) {
		return;
	}

	var activeId = 0;
	if(isRefresh == 1) { //下拉刷新
		var itemId = getActiveControl();
		var activeId = itemId.replace('#item', '');
	}

	var seg = document.getElementById('segmentedControl'); //群名称segmentedControl
	var userTable = document.getElementById('userList'); //多个放置用户列表
	seg.innerHTML = '';
	userTable.innerHTML = '';
	for(var i = 0; i < datasource.length; i++) {
		var userList = datasource[i].userList; //用户列表数据
		var segitem = document.createElement('a');
		var userItem = document.createElement('div'); //单个用户列表
		if(i == activeId) {
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

			segitem.appendChild(span);
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
		seg.appendChild(segitem);
		userItem.id = 'item' + i;
		var ul = document.createElement('ul');
		ul.className = 'mui-table-view parent-table' + i;
		for(var j = 0; j < userList.length; j++) {
			if(!userList[j].NoReadCnt) {
				userList[j].NoReadCnt = 0;
			}
			if(!userList[j].MsgContent) {
				userList[j].MsgContent = '暂无成员动态';
			}
			if(!userList[j].PublishDate) {
				userList[j].PublishDate = '';
			}
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media parent-cell' + j;
			if(userList[j].NoReadCnt != 0) {
				noReadHTML = '<span style="float: left;" ><span  class="mui-badge mui-badge-danger custom-badge2">' + userList[j].NoReadCnt + '</span></span>';
			} else {
				noReadHTML = '';
			}
			var name= userList[j].ugname;
			li.innerHTML = '	<img class="mui-media-object mui-pull-left dynamic-personal-image " src="' + userList[j].uimg + '" />' +
				noReadHTML + '<p class="time">' + userList[j].PublishDate + '</p><div class="mui-media-body" style="padding-left: 5px;";>' +
				name + '<p class="mui-ellipsis">' + userList[j].MsgContent + '</p>';
			ul.appendChild(li);

		}
		userItem.appendChild(ul);
		userTable.appendChild(userItem);

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
	mui('.parent-table' + tableIndex).on('tap', '.parent-cell' + cellIndex, function() {
		selectCell = {
			tableIndex: tableIndex,
			cellIndex: cellIndex,
			NoReadCnt: datasource[tableIndex].userList[cellIndex].NoReadCnt
		}
		var publisherId = datasource[tableIndex].userList[cellIndex].utid //空间用户id
		console.log('tableIndex==' + tableIndex + 'cellIndex==' + cellIndex + 'publisherId==' + publisherId);
		mui.openWindow({
			url: 'zone_main.html',
			id: 'zone_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: publisherId,
				NoReadCnt:selectCell.NoReadCnt
			}

		});
	});
}

function showBlankPage(isBlank) {
	if(isBlank == true) {
		//	隐藏家长圈
		var leftImg = document.getElementById('leftImg');
		var parent = document.getElementById('parent');
		leftImg.style.visibility = 'hidden';
		parent.style.visibility = 'hidden';
		//	显示加号
		var div = document.createElement('div');
		div.id = 'plusDIv';
		var p = document.createElement('p')
		div.style.height = '1000px'
		div.style.marginTop = '50px'
		p.style.textAlign = 'center'
		p.style.fontSize = '18px'
		div.appendChild(p)
		p.innerHTML = '您还没有创建班级，请点击下方按钮创建班级';
		var a = document.createElement('img');
//		a.className = 'mui-icon iconfont icon-tianjia ';
//		a.style.display='block'
		a.style.width = '80px';
		a.style.height = '80px';
		a.src = '../../image/quan/add.png';
		a.id = 'add'
		a.style.marginLeft = '40%'
		a.style.verticalAlign = '-15px'
		div.appendChild(a);
		div.style.visibility = 'visible'
		var content = document.getElementsByClassName('mui-content');
		content[0].insertBefore(div, content[0].firstChild);
		events.addTap('add', function() {
			events.openNewWindow('../mine/qun_manage_info.html');
		})
	} else {
		var leftImg = document.getElementById('leftImg');
		var parent = document.getElementById('parent');
		leftImg.style.visibility = 'visible';
		parent.style.visibility = 'visible';
		var plusDIv = document.getElementById('plusDIv');
		if(plusDIv) {
			plusDIv.style.visibility = 'hidden';
		}
	}

}
//下拉刷新
function pulldownRefresh() {

	setTimeout(function() {
		datasource = []; //底部列表数据
		topStudentArr = [];
		topArray = []; //顶部班级列表数据
		requestTimes = 0; //记录班级空间请求次数--等于0时，请求完毕，刷新界面
		requestTimes2 = 0; //记录群用户列表请求次数--等于0时，请求完毕，刷新界面
		requestTimes3 = 0;
		isRefresh = 1; //是否下拉刷新--1：下拉刷新 0：不是下拉刷新
		selectCell = {}; //选择的cell
		getStuList();
		var ws = plus.webview.currentWebview();
		ws.endPullToRefresh(); //refresh completed
	}, 1500);
}
var count = 0;

function pullupRefresh() {
	mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。

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