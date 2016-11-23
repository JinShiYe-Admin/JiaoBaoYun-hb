mui.init()
var list = document.getElementById('list-container');
var groupRoles = new Array();
var check_parents = document.getElementById('check-parents');
var check_tea = document.getElementById('check-tea');
var check_stu = document.getElementById('check-stu');
var gutid = 0;//申请记录id
var gid = 0;//群id
var defaultRole = 0;//默认角色
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
		events.addTap('btn-submit', function() {
			//有选择身份
			if(groupRoles) {
				//包含家长身份
				if(groupRoles.indexOf(0) >= 0) {
					//不包含家长身份	
				} else {

				}
				events.fireToPageWithData('add-info.html', 'postRoles', {gutid:gutid,gid:gid,groupRoles:groupRoles});
				//没有选择身份
			} else {
				mui.toast('请选择 身份')
			}
		})
		/**
		 * 申请通过后传递的事件
		 */
		window.addEventListener('appPassed',function(e){
			var passedGutid=e.detail.data;
			//获取通过的cell中的按钮
			var btn_passed=document.querySelector('[gtuid='+passedGutid+']');
			btn_passed.className='apply-passed';
			btn_passed.innerText='已添加';
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
			} else {
				mui.toast(data.RspTxt);
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
				li.className = 'mui-table-view-cell cell-' + type;
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
				gutid = parseInt(this.gutid);
				//获取要申请的群id
				gid = parseInt(this.gid);
				var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
				//向接口传递数据，用户同意邀请
				postDataPro_PostInvDo({
					gutid: gutid,
					stat: 1
				}, wd, function(data) {
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
			gutid = parseInt(this.gutid);
			//获取要申请的群id
			gid = parseInt(this.gid);
			//关联学生name
			stuname = this.stuname;
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
		if(type = 'inv') {
			inner = '<div class="div-left">' +
				'<img class="img-left" src="' + item.gimg + '"/>' +
				'<div class="words-right">' +
				'<p>' + item.gname + '</p><br/>' +
				'<p>' + item.invname + '邀请你加入群:' + item.gname + '</p>' +
				'</div>' +
				'</div>' +
				'<a  class="mui-btn mui-btn-primary mui-btn-block btn-apply"' +
				' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" >接受</a>'
		} else {
			inner = '<div class="div-left">' +
				'<img class="img-left" src="' + item.invimg + '"/>' +
				'<div class="words-right">' +
				'<p>' + item.invname + '</p><br/>' +
				'<p>' + item.invname + '申请加入你的群:' + item.gname + '</p>' +
				'</div>' +
				'</div>'
			'<a href="#popover" class="mui-btn mui-btn-primary mui-btn-block btn-openPopover"' +
			' gutid="' + item.gutid + '" mstype="' + item.mstype + '" gid="' + item.gid + '" stuname="' + item.stuname + '">接受</a>';
		}
		return inner;
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