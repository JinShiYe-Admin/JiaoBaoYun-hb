var gutid; //申请记录id
var roles = [];
var gid; //群id
var choseId = 0;
var mstype;//类型信息
var list = document.getElementById('list-container');
mui.init();
mui.plusReady(function() {
		//获取传值
		window.addEventListener('postRoles', function(e) {
			console.log(JSON.stringify(e.detail.data));
			//获取申请记录id
			gutid = e.detail.data.gutid;
			//获取申请角色
			roles = e.detail.data.groupRoles;
			mstype=roles[0];
			//获取申请群id
			gid = e.detail.data.gid;
			//根据不同身份,请求数据，并保存至界面
			diffRoles(roles)
			addListener();
		});
	})
	/**
	 * 根据不同身份，放置不同数据
	 * @param {Object} roles 身份数组
	 */
var diffRoles = function(roles) {
		/**
		 * 角色为老师兼家长
		 */
		if(roles.length > 1) {
			getData(0, setData);
		} else {
			getData(roles[0], setData);
		}
	}
	/**
	 * 
	 * @param {Object} role
	 * @param {Object} callback
	 */
var getData = function(role, callback) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostGUInf({
				top: -1, //选择条数,-1为全部
				vvl: gid, //群ID,查询的值
				vvl1: role
			}, wd,
			function(data) {
				wd.close();
				console.log('角色'+role+'获取的班级资料'+JSON.stringify(data))
				if(data.RspCode == '0000') {
					callback(role, data.RspData);
				} else {
					mui.toast(data.RspTxt);
				}
			})
	}
	/**
	 * 
	 * @param {Object} type
	 * @param {Object} data
	 */
var setData = function(type, data) {
		createFirstChild(type);
		console.log('放置数据'+JSON.stringify(data));
		data.forEach(function(item) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.stuid=item.stuid;
				li.mstype=item.mstype;
				li.innerHTML = createInner(type, item);
				list.appendChild(li);
			})
			//两个身份，学生身份请求完毕，请求老师身份
		if(roles.length > 1 && type == 0) {
			getData(2, setData);
		}

	}
	/**
	 * 
	 * @param {Object} item
	 */
var createInner = function(type, item) {
		return '<a class="mui-navigate-right" stuid="' + item.stuid + 'mstype="' + type + '"><img src="' +
			getStuimg(item)+ '" />' + item.stuname + '</a>';
	}
var getStuimg = function(cell) {
	return cell.stuimg ? cell.stuimg : '../../image/utils/default_personalimage.png';
}
	/**
	 * 
	 * @param {Object} type
	 */
var createFirstChild = function(type) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-divider';
		switch(type) {
			//老师资料
			case 2:
				li.innerText = '老师资料';
				break;
				//学生资料	
			case 3:
				li.innerText = '学生资料';
				break;
			default:
				break;
		}
		list.appendChild(li);
	}
	/**
	 * 
	 */
var addListener = function() {
	document.querySelector('.mui-table-view.mui-table-view-radio').addEventListener('selected', function(e) {
		console.log("当前选中的为：" + e.detail.el.innerText);
		console.log("当前选中的资料id为：" + e.detail.el.stuid);
		choseId =e.detail.el.stuid?e.detail.el.stuid:0;
		mstype=e.detail.el.mstype?e.detail.el.mstype:roles[0];
	});
	//保存按钮
	//		var comData = {
	//			gutid: '',//申请记录ID，
	//			stat:'',//入群状态，0拒绝,后面的字段填0即可,1通过
	//			mstype:'',//审批用户类型，0家长,2老师,3学生
	//			lnkinfid:'',//关联资料ID，无资料关联填写0
	//			urel:''//与资料关系，与资料关系,一般申请加入家长的时候填写,如爸爸,妈妈,其他类型留空
	//		};
	events.addTap('btn-save', function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
		postDataPro_PostJoinDo({
				gutid: gutid,
				stat: 1,
				mstype: mstype+'',
				lnkinfid: choseId,
				urel: ''
			},
			wd,
			function(data) {
				wd.close();
				console.log(JSON.stringify(data));
				if(data.RspCode == '0000') {
					mui.toast('申请通过!');
					mui.fire('mine/approval-apply.html', 'appPassed', gutid);
					mui.back();
				} else {
					mui.toast(data.RspTxt);
				}
			})
	})
}