mui.init()
var check_parents = document.getElementById('check-parents');
var check_tea = document.getElementById('check-tea');
var check_stu = document.getElementById('check-stu');
var list = document.getElementById('groups-container');
var myGroups = [];
var groupRoles = [];
var choseGroupId; //选中申请的群Id
mui.plusReady(function() {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
	getAllGroups(personalUTID, manageMyGroups);
	var search_group = document.getElementById('search-group');
	getChecked();
	search_group.addEventListener('search', function() {
		console.log('search监听开始')
			//清空子数据
		clearChildren();
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostUList({
			vvl: search_group.value
		}, wd, function(data) {
			wd.close();
			console.log('通过手机号获取个人信息：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				getAllGroups(data.RspData[0].utid, setData);
			} else {
				mui.toast(data.RspTxt);
			}
		})
	})
	setListListener();
	setButtonsListener();
})
var setData = function(data) {
	console.log('界面显示Data:' + JSON.stringify(data));
	data.forEach(function(cell, i, data) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.gid = cell.gid;
		li.innerHTML = createInner(cell);
		console.log(i + createInner(cell))
		list.appendChild(li);
	})
}
var setListListener = function() {
	mui('.mui-table-view').on('tap', '.apply-group', function() {
		choseGroupId = parseInt(this.getAttribute('gid'));
		console.log('选中的申请的群id：' + choseGroupId);
	})
}
var setButtonsListener=function() {
	var btn_sure = document.getElementById('btn-sure');
	var btn_cancel = document.getElementById('btn-cancle');
	btn_sure.addEventListener('tap', function() {
		if(groupRoles.length > 0) {
			//			gid: '',//群ID
			//			beinvnick:'',//申请人昵称
			//			mstype:'',//申请成为，0家长,2老师,3学生
			//			urel:''//备注
			var myNick = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick;
			var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
			postDataPro_PostJoinGuser({
				gid: choseGroupId,
				beinvnick: myNick,
				mstype: groupRoles[0],
				urel: ''
			}, wd, function(data) {
				wd.close();
				if(data.RspCode=='0000'){
					mui.toast('申请成功！');
				}else{
					mui.toast("申请失败:"+data.RspTxt)
				}
				mui('.mui-popover').popover('toggle');
			})
		} else {
			mui.toast('请选择入群身份');
		}
	});
	btn_cancel.addEventListener('tap', function() {
		mui('.mui-popover').popover('toggle')
	})
}
var manageMyGroups = function(data) {
		myGroups = data;
	}
	/**
	 * 
	 * @param {Object} cell (gid gname gimg)
	 */
var createInner = function(cell) {
	var isIn = false;
	myGroups.forEach(function(myGroup) {
		if(myGroup.gid == cell.gid) {
			isIn = true;
			return;
		}
	})
	if(isIn) {
		return '<a>' +
			'<img src="' + getGimg(cell) + '"/>' + cell.gname + '<p>已入群</p></a>'
	} else {
		return '<a href="#chose-roles" class="apply-group" gid="' + cell.gid + '">' +
			'<img src="' + getGimg(cell) + '"/>' + cell.gname + '</a>'
	}
}
var getGimg = function(cell) {
	return cell.gimg ? cell.gimg : '../../image/utils/default_personalimage.png';
}
var clearChildren = function() {
	while(list.firstElementChild) {
		list.removeChild(list.firstElementChild);
	}
}
var getAllGroups = function(utid, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGList({
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: utid
	}, wd, function(data) {
		wd.close();
		console.log('申请入群获取的群数据：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			callback(data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
	})

}
var getChecked = function() {
		mui('.mui-input-group').on('change', 'input', function() {
			this.checked ? groupRoles.push(parseInt(this.value)) : groupRoles.splice(groupRoles.indexOf(parseInt(this.value), 1))
			if(this.checked) {
				console.log('this.value' + this.value);
				switch(parseInt(this.value)) {
					case 0:
					case 2:
						check_stu.checked = false;
						groupRoles = removeItemFromArray(3, groupRoles);
						break;
					case 3:
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