/**
 * 審核入群界面邏輯
 * @anthor an
 */
mui.init();
mui('.mui-scroll-wrapper').scroll({
	indicators: true, //是否显示滚动条
})
var list = document.getElementById('list-container');
var groupRoles = new Array();
var check_parents = document.getElementById('check-parents');
var check_tea = document.getElementById('check-tea');
var check_stu = document.getElementById('check-stu');
var gutid = 0; //申请记录id
var gid = 0; //群id
var defaultRole = 0; //默认角色
var stuname = '';
mui.plusReady(function() {
	//预加载界面
	events.preload('add-info.html', 200);
	//	getData('inv', setData);
	//获取数据，并填充
	getData('inv', []);
	//checkBox加载监听
	getChecked()
	//列表加载监听
	addListener();
	//选择身份后，加载监听
	setButtonsListener();
	/**
	 * 申请通过后传递的事件
	 */
	window.addEventListener('appPassed', function(e) {
		console.log('接受邀请');
		events.clearChild(list);
		getData('inv', []);
	})
	window.addEventListener('applied', function(e) {
		console.log('申请入群');
		events.clearChild(list);
		getData('inv', []);
	})
})
/**
 * 获取数据
 * @param {Object} type 类型 inv=被邀请入群 app=申请入群
 * @param {Object} callback
 */
var getData = function(type, records) {
	console.log("申请记录：" + JSON.stringify(records));
	//获取申请人
	var wd = events.showWaiting();
	postDataPro_PostGrInv({
		vtp: type
	}, wd, function(data) {
		wd.close();
		console.log('申请人数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			records = records.concat(data.RspData);
		}
		if(type == 'inv') {
			getData('app', records);
		} else {
			getApplyRecord(records);
		}
	})
}
/**
 * 获取申请记录
 */
var getApplyRecord = function(records) {
	var wd = events.showWaiting();
	console.log("申请记录：" + JSON.stringify(records));
	postDataPro_PostMJoin({}, wd, function(data) {
		wd.close();
		console.log('获取的我的群申请记录：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			records = records.concat(data.RspData);
		}
		sortData(records);
	})
}
/**
 * 为数据排序 并放置数据
 * @param {Object} records
 */
var sortData = function(records) {
	console.log("待排序的记录:" + JSON.stringify(records));
	records.sort(function(a, b) {
		return Date.parse(b.aptime) - Date.parse(a.aptime);
	})
	setData(records);
}
/**
 * 填充数据
 * @param {Object} data
 */
var setData = function(records) {
	console.log("记录："+JSON.stringify(records));
	var apply_container=document.createElement('li');
	apply_container.className="mui-table-view-cell";
//	apply_container.setAttribute("id","btn-apply")
	apply_container.innerHTML='<div id="btn-apply" class="apply-container"><p><span class="mui-icon mui-icon-search"></span>&nbsp;&nbsp;申请加入班级</p><div>'
	list.appendChild(apply_container);
	
	if(records.length > 0) {
		var divider=document.createElement('li');
		divider.className="mui-table-view-divider";
		divider.innerText="新消息";
		list.appendChild(divider);
		//填充真实数据
		records.forEach(function(item, i, records) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			li.innerHTML = getInnerHTML(item);
			list.appendChild(li);
		})
	}

}
/**
 * 加载监听
 */
var addListener = function() {
	/**
	 * 别人邀请我入群后
	 * 点击接受按钮事件
	 */
	mui('.mui-table-view').on('tap', '.btn-apply', function() {
		//获取群申请记录id;
		gutid = parseInt(this.getAttribute('gutid'));
		//获取要申请的群id
		gid = parseInt(this.getAttribute('gid'));
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//向接口传递数据，用户同意邀请
		postDataPro_PostInvDo({
			gutid: gutid,
			stat: 1
		}, wd, function(data) {
			wd.close();
			if(data.RspCode = '0000') {
				mui.toast('您已同意入群');
				events.clearChild(list);
				getData('inv', setData);
				events.fireToPageNone('mine.html', 'newsChanged');
				events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');

			} else {
				mui.toast(data.RspTxt);
			}
			console.log('用户同意邀请入群:' + JSON.stringify(data));
		})

	})
	/**
	 * 申请入群
	 * 我点击接受后选择身份
	 */
	mui('.mui-table-view').on('tap', '.btn-openPopover', function() {
		//清空选中身份信息
		groupRoles = [];
		//获取默认身份
		defaultRole = parseInt(this.getAttribute('mstype'));
		//添加默认身份
		groupRoles.push(defaultRole);
		//默认身份选中
		defaultCheck(defaultRole);
		//获取群申请记录id;
		gutid = parseInt(this.getAttribute('gutid'));
		//获取要申请的群id
		gid = parseInt(this.getAttribute('gid'));
		//			//关联学生name
		//			stuname = this.getAttribute('st');
	})
	mui(".mui-table-view").on("tap",".apply-container",function(){
		events.openNewWindow('apply-group.html');
	})
}
/**
 * 默认身份值
 * @param {Object} type 选中默认身份
 */
var defaultCheck = function(type) {
	console.log('默认身份:' + type);

	check_parents.checked = false;
	check_stu.checked = false;
	check_tea.checked = false;
	switch(type) {
		//家长
		case 0:
			check_parents.checked = true;
			break;
			//老师
		case 2:
			check_tea.checked = true;
			break;
			//学生	
		case 3:
			check_stu.checked = true;
			break;
		default:
			break;
	}
}
/**
 * checkbox加载监听
 * 获取选中身份数组
 */
var getChecked = function() {
	mui('.mui-input-group').on('change', 'input', function() {
		console.log('选择事件：' + this.checked + ',值：' + this.value);
		if(this.checked) {
			groupRoles.push(parseInt(this.value));
		} else {
			groupRoles = removeItemFromArray(parseInt(this.value), groupRoles);
		}
		if(this.checked) {
			console.log('this.value' + this.value);
			switch(parseInt(this.value)) {
				case 0: //家长
				case 2: //老师
					check_stu.checked = false;
					groupRoles = removeItemFromArray(3, groupRoles);
					break;
				case 3: //学生
					check_tea.checked = false;
					check_parents.checked = false;
					groupRoles = removeItemFromArray(2, removeItemFromArray(0, groupRoles))
					break;
				default:
					break;
			}
		}
		console.log('groupRoles:' + groupRoles);
	});
}
/**
 * 删除数组目标元素
 * @param {Object} item 目标元素
 * @param {Object} arrays 数组
 */
var removeItemFromArray = function(item, arrays) {
	if(arrays.indexOf(item) >= 0) {
		arrays.splice(arrays.indexOf(item), 1);
	}
	return arrays;
}
/**
 *	获取innerHTML
 * @param {Object} type
 * @param {Object} item
 */
var getInnerHTML = function(item) {
	var inner = '';
	console.log("当前item状态" + item.stat);
	if(isNaN(item.stat)) {
		if(item.invname != item.beinvname) {
			inner = ' <a class="">' +
				'<img class = "mui-media-object mui-pull-left"' +
				'src = "' + getGimg(item) + '" >' +
				'<div class = "mui-media-body"' +
				'style = "margin-right: 4rem;" >' +
				item.gname +
				'<p class="single-line apply-message">' + events.shortForString(item.invname, 4) + '邀请你以' + getRole(item.mstype) + '身份加入群</p>' +
				'</div>' +
				'<a class = "mui-btn mui-btn-green btn-apply" ' +
				' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" >接受</a></a>'
		} else {
			inner = ' <a href="javascript:;">' +
				'<img class = "mui-media-object mui-pull-left"' +
				'src = "' + getGimg(item) + '" >' +
				'<div class = "mui-media-body"' +
				'style = "margin-right: 4rem;" >' +
				item.gname +
				'<p class="single-line apply-message">' + events.shortForString(item.invname, 4) + '申请以' + getRole(item.mstype) + '身份加入你的群:' + events.shortForString(item.gname, 4) + '</p>' +
				'</div>' +
				'<a href="#chose-roles" class = "mui-btn mui-btn-green btn-openPopover" ' +
				' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" stuname="' + item.stuname + '">接受</a></a>'
		}
	} else {
		inner = ' <a href="javascript:;" class="apply-container">' +
			'<img class = "mui-media-object mui-pull-left qun-portrait"' +
			'src = "' + getGimg(item) + '" />' +
			'<div class = "mui-media-body apply-info"' +
			'style = "margin-right: 4rem;" >' +
			item.gname +
			'<p class="single-line apply-message">';
		if(item.invname != item.beinvname) {
			inner += events.shortForString(item.invaname, 10) + '邀请你加入群：' + events.shortForString(item.gname, 10);
		} else {
			inner += '你已申请加入群：' + events.shortForString(item.gname, 10);
		}
		inner += '</p></div><a  class = "mui-btn mui-btn-outlined">' + setApplyState(item.stat) + '</a></a>'
	}

	return inner;
}
var setApplyState = function(type) {
	var applyState = '';
	switch(type) {
		case 0:
			applyState = '待审';
			break;
		case 1:
			applyState = '通过';
			break;
		case 2:
			applyState = '拒绝';
			break;
		default:
			break;
	}
	return applyState;
}
/**
 * 獲取角色
 * @param {Object} mstype
 */
var getRole = function(mstype) {
	var role = '';
	switch(mstype) {
		case 0:
			role = '家长';
			break;
		case 1:
			role = '管理员';
			break
		case 2:
			role = '老师';
			break;
		case 3:
			role = '学生';
			break;
		default:
			break;
	}
	return role;
}
/**
 * 群頭像
 * @param {Object} cell
 */
var getGimg = function(cell) {
	return cell.gimg ? cell.gimg : '../../image/utils/default_personalimage.png';
}
/**
 * 根据不同类型床架分类条目
 * @param {Object} type 申请类型
 */
var createFirst = function(type) {
	var li = document.createElement('li');
	if(type == 'inv') {
		li.className = 'group-inv mui-table-view-divider';
		li.innerText = '我的群邀请';
	} else {
		li.className = 'group-app mui-table-view-divider';
		li.innerText = '等待我审批';
	}
	list.appendChild(li);
}
/**
 * 按鍵監聽
 */
var setButtonsListener = function() {
	//獲取確定按鈕
	var btn_sure = document.getElementById('btn-sure');
	//獲取取消按鈕
	var btn_cancel = document.getElementById('btn-cancle');
	//確定按鈕加載監聽
	btn_sure.addEventListener('tap', function() {
		if(groupRoles.length > 0) {
			events.fireToPageWithData('add-info.html', 'postRoles', {
				gutid: gutid,
				gid: gid,
				groupRoles: groupRoles
			});
			mui('.mui-popover').popover('toggle');
		} else {
			mui.toast('请选择身份');
		}
	});
	//取消按鈕加載監聽
	btn_cancel.addEventListener('tap', function() {
		mui('.mui-popover').popover('toggle');
	});
}