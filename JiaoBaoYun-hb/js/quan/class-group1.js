mui.init();
mui.plusReady(function() {
	events.preload('group-pInfo.html', 200);
	window.addEventListener('postGroupInfo', function(e) {
		masterInfo = null;
		isMaster = false;
		console.log('班级群组界面获取的数据：' + JSON.stringify(e.detail.data));
		if(e.detail.data) {
			groupId = e.detail.data.classId;
			groupName = e.detail.data.className;
			document.getElementById('title').innerText = getHeadText(groupName);
			groupRoles = [];
			allcount = 0;
			getUserInGroup(-1, function(data) {
				getGroupAllInfo();
				groupRoles = data;
				console.log('班级群组界面获取的用户在群中的信息:' + JSON.stringify(groupRoles));
				for(var i in groupRoles) {
					if(groupRoles[i].mstype == 1) {
						isMaster = true;
						break;
					}
				}
			})
		}
	})
	mui('#gride').on('tap', '.mui-table-view-cell', function() {
		events.fireToPageWithData('group-pInfo.html', 'postPInfo', jQuery.extend({},this.info,{isMaster:isMaster}) );
	})
})
/**
 * 获取用户在群组中的信息
 * @param {Object} mstype
 * @param {Object} callback
 */
var getUserInGroup = function(mstype, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGuI({
		vvl: groupId,
		vtp: mstype
	}, wd, function(data) {
		wd.close()
		console.log('用户在群的身份 ' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			if(callback) {
				callback(data.RspData);
			}
		}
	})
}
var getGroupAllInfo = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
	//請求群組成員數據
	postDataPro_PostGusers({
		top: -1,
		vvl: groupId,
		vvl1: -1
	}, wd, function(groupData) {
		wd.close();
		console.log('获取群组成员：' + JSON.stringify(groupData));
		//成功囘調
		if(groupData.RspCode == 0) {
			getRemarkInfos(groupData.RspData);
		}
	});
}
var getRemarkInfos = function(data) {
	getRemarkData(data, function(Remarkdata) {
		var list = [];
		if(Remarkdata.RspCode == '0000') {
			list = addRemarkData(data, Remarkdata.RspData);
		} else {
			list = addRemarkData(data)
		}
		events.clearChild(gride);
		console.log('最终呈现的数据：' + JSON.stringify(list));
		list=resortArray(list);
		createGride(gride, list);
	})
}
var resortArray = function(list) {
	list.sort(function(a,b){
		return a.order-b.order;
	})
	return list;
}
var addRemarkData = function(list, remarkList) {
	if(remarkList) {
		for(var i in list) {
			list[i]=setOrder(list[i]);
			var hasBunick = false;
			for(var j in remarkList) {
				if(list[i].utid == remarkList[j].butid) {
					hasBunick = true;
					list[i].bunick = remarkList[j].bunick;
					break;
				}
			}
			if(!hasBunick) {
				list[i].bunick = list[i].ugname;
			}
		}
	} else {
		list.forEach(function(cell, i) {
			list[i].bunick = cell.ugname;
		})
	}
	return list;
}
var setOrder = function(cell) {
	switch(cell.mstype) {
		case 0:
			cell.order = 2;
			break;
		case 1:
			cell.order = 0;
			break;
		case 2:
			cell.order = 1;
			break;
		case 3:
			cell.order = 3;
			break;
		default:
			break;
	}
	return cell;
}
/**
 * 获取备注
 */
var getRemarkData = function(list, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	var utids = [];
	list.forEach(function(cell) {
		utids.push(cell.utid);
	})
	console.log('传的字符串：' + utids.toString())
	postDataPro_PostUmk({
		vvl: utids.toString()
	}, wd, function(data) {
		wd.close();
		console.log('获取的备注信息：' + JSON.stringify(data));
		var remark = document.getElementById('person-remark');
		callback(data);
	})
}
/**
 * 加載九宮格數據
 * @param {Object} gride 九宫格父控件
 * @param {Object} array 元素数组，包括图标和标题
 */
var createGride = function(gride, array) {

	//数组遍历
	array.forEach(
		/**
		 * 创建子元素
		 * @param {Object} map 数组元素
		 * @param {Object} index 数组序号
		 * @param {Object} array 数组
		 */
		function(cell, index, array) {
			var li = document.createElement('li'); //子元素
			//			var bgColor=getRandomColor();//获取背景色
//			if(array.length <= 3) { //数组小于等于3，每行3个图标
				li.className = "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4";
//			} else { //数组大于3，每行四个图标
//				li.className = "mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3";
//			}
			cell.gname = groupName;
			if(!cell.bunick) {
				cell.bunick = cell.ugnick;
			}
			li.info = cell;
			//子控件的innerHTML
			li.innerHTML = '<a href="#">' +
				'<img class="circular-square" src="' + updateHeadImg(cell.uimg, 2) + '"/></br>' +
				'<small class="' + setMasterNameClass(cell) + '">' + getRoleInGroup(cell) + cell.bunick + '</small>' +
				'</a>';
			gride.appendChild(li);
		})
}
var setMasterNameClass = function(info) {
	if(info.mstype == 1) {
		return 'master-name'
	}
	return '';
}
var getRoleInGroup = function(cell) {
	var role = '';
	switch(cell.mstype) {
		case 0:
			role = '[家长]';
			break;
		case 1:
			role = '[群主]';
			break;
		case 2:
			role = '[老师]';
			break;
		case 3:
			role = '[学生]';
		default:
			break;
	}
	console.log(JSON.stringify(cell));
	return role;
}
var getHeadText = function(className) {
	if(className.length > 10) {
		className = className.substring(0, 8) + '...'
	}
	return className;
}