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
		getData('inv', setData);
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
			var passedGutid = e.detail.data;
			//获取通过的cell中的按钮
			var btn_passed = document.querySelector('[gtuid=' + passedGutid + ']');
			btn_passed.className = 'apply-passed';
			btn_passed.innerText = '已添加';
		})
	})
	/**
	 * 获取数据
	 * @param {Object} type 类型 inv=被邀请入群 app=申请入群
	 * @param {Object} callback
	 */
var getData = function(type, callback) {
		//获取申请人
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostGrInv({
			vtp: type
		}, wd, function(data) {
			wd.close();
			console.log('申请人数据：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				callback(type, data.RspData);
			} else if(data.RspCode = '0009' && type == 'inv') {
				getData('app', setData)
//			} else {
//				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 填充数据
	 * @param {Object} type
	 * @param {Object} data
	 */
var setData = function(type, data) {
		//填充分组信息
		createFirst(type);
		//填充真实数据
		data.forEach(function(item, i, data) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media cell-' + type;
				li.innerHTML = getInnerHTML(type, item);
				//			li.querySelector('button').addEventListener()
				list.appendChild(li);
			})
			//先载入被邀请数据，在加载申请数据
		if(type == 'inv') {
			getData('app', setData)
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
					if(data.RspCode='0000'){
						mui.toast('您已同意入群');
						events.clearChild(list);
						getData('inv', setData);
						events.fireToPageNone('mine.html','newsChanged');
					}else{
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
			defaultRole = parseInt(this.mstype);
			//默认身份选中
			defaultCheck(defaultRole);
			//获取群申请记录id;
			gutid = parseInt(this.getAttribute('gutid'));
			//获取要申请的群id
			gid = parseInt(this.getAttribute('gid'));
//			//关联学生name
//			stuname = this.getAttribute('st');
		})
	}
	/**
	 * 默认身份值
	 * @param {Object} type 选中默认身份
	 */
var defaultCheck = function(type) {
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
	/**
	 *	获取innerHTML
	 * @param {Object} type
	 * @param {Object} item
	 */
var getInnerHTML = function(type, item) {
	var inner = '';
	if(type == 'inv') {
		inner = ' <a href="javascript:;">' +
			'<img class = "mui-media-object mui-pull-left"' +
			'src = "' + getGimg(item) + '" >' +
			'<div class = "mui-media-body"' +
			'style = "margin-right: 4rem;" >' +
			item.gname +
			'<p class="mui-ellipsis">' + item.invname + '邀请你以'+getRole(item.mstype)+'身份加入群</p>' +
			'</div>' +
			'<a class = "mui-btn btn-green btn-apply" ' +
			' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" >接受</a></a>'
	} else {
		inner = ' <a href="javascript:;">' +
			'<img class = "mui-media-object mui-pull-left"' +
			'src = "' + getGimg(item) + '" >' +
			'<div class = "mui-media-body"' +
			'style = "margin-right: 4rem;" >' +
			item.gname +
			'<p class="mui-ellipsis">' + item.invname + '申请以'+getRole(item.mstype)+'身份加入你的群:' + item.gname + '</p>' +
			'</div>' +
			'<a href="#chose-roles" class = "mui-btn mui-btn-green btn-openPopover" ' +
			' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" stuname="' + item.stuname + '">接受</a></a>'
	}
	return inner;
}
var getRole=function(mstype){
	var role='';
	switch (mstype){
		case 0:
		role='家長';
			break;
		case 1:
		role='管理員';
			break
		case 2:
		role='老師';
		break;
		case 3:
		role='學生';
		break;
		default:
			break;
	}
	return role;
}
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
var setButtonsListener = function() {
	var btn_sure = document.getElementById('btn-sure');
	var btn_cancel = document.getElementById('btn-cancle');
	btn_sure.addEventListener('tap', function() {
		if(groupRoles.length>0){
			events.fireToPageWithData('add-info.html', 'postRoles', {
						gutid: gutid,
						gid: gid,
						groupRoles: groupRoles
					});
			mui('.mui-popover').popover('toggle');
		}else{
			mui.toast('请选择身份');
		}
	});
	btn_cancel.addEventListener('tap', function() {
		mui('.mui-popover').popover('toggle');
	});
}