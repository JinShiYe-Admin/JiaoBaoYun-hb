var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var role = 2;
//加载子页面
events.initSubPage('homework-tea-sub.html')
mui.plusReady(function() {
	mui('.mui-scrollbar-horizontal').scroll();
	//三道杠的点击事件
	events.addTap('more', function() {
		//通知子页面，显示、关闭菜单 
		events.fireToPageNone('homework-tea-sub.html', 'togglePop');
	})
	events.addTap('icon-camero', function() {
		events.openNewWindow('publish-answer.html');
	})
	var btn_published = document.getElementById('btn-published');
	var btn_homework = document.getElementById('btn-homework');
	btn_published.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green'
		btn_homework.className = 'mui-btn mui-btn-green mui-btn-outlined'
	});
	btn_homework.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green mui-btn-outlined';
		btn_homework.className = 'mui-btn mui-btn-green';
	})
	requestClassData(setChoices(btn_published,btn_homework));
})

function requestClassData(callback) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
	//获取当前账号，所在的群
	//需要参数
	var comData = {
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: personalUTID //查询的各项，对应人的utid，可以是查询的任何人
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//9.获取用户群
	postDataPro_PostGList(comData, wd, function(data) {
		wd.close();
		console.log('作业主界面获取的群信息：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var tempArray = data.RspData;
			//			gid:'14',//群ID
			//			gname:'10群',//群名
			//			gimg:'',//群头像,群头像的链接
			//			mstype:'2'//用户角色,0家长,1管理员,2老师,3学生
			//然后检索身份为老师的
			for(var i in tempArray) {
				var tempModel = tempArray[i];
				//2老师
				if(tempModel.mstype == 2 || tempModel.mstype == 1) {
					teacherClasses.push(tempArray[i]);
					//作业列表
					//					tempModel.homeworkArray = [];
					//					tempModel.index = 1;
					//					teacherHash.put(tempModel.gid, itempModel);
				}
				//家长、学生
				if(tempModel.mstype == 0 || tempModel.mstype == 3) {
					studentClasses.push(tempArray[i]);
					//作业列表
					//					tempModel.homeworkArray = [];
					//					tempModel.index = 1;
					//					studentHash.put(tempModel.gid, tempModel);
				}
			}
			callback;
			events.fireToPageWithData('homework-tea-sub.html', 'postClasses', {
				teacherClasses: teacherClasses,
				studentClasses: studentClasses
			})
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
var setChoices(btn_p, btn_h) {
	if(teacherClasses.length > 0) {
		btn_p.style.display = 'inline-block';
		role=2;
	} else {
		btn_p.style.display = 'none';
	}
	if(studentClasses.length > 0) {
		btn_h.style.display = 'inline-block';
		role=30;
	} else {
		btn_h.style.display = 'none';
	}
}