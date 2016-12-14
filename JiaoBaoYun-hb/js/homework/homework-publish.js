//从老师的作业列表界面，将身份为老师的群，传到这个界面，总群数组
//var classArray = []; //{"gid":14,"gname":"10群","gimg":"","mstype":2}
var selectSubjectID;
//老师发布作业时，选择的群
var selectClassArray = [];
var submitOnLine = true; //是否在线提交 默认为是
//科目控件
var subjectsContainer = document.getElementById('subjects');
//个人id
var personalUTID;
mui.init();
mui.plusReady(function() {
		events.preload('classes-select.html', 200);
		personalUTID = parseInt(window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid);
		window.addEventListener('postClasses', function(e) {
			console.log('发布作业界面获取的班级数据：' + JSON.stringify(e.detail.data));
			//选中班级为全部班级
			selectClassArray = e.detail.data;
			//请求所有班级学生数据
			requestClassStudents();
			//科目
			requestSubjectList(setSubjects);
		})
		events.addTap('select-classes', function() {
				events.fireToPageWithData('classes-select.html', 'postClasses', selectClassArray);
			})
			/**
			 * 监听选择班级后的返回数据
			 */
		window.addEventListener('selectedClasses', function(e) {
				selectClassArray = e.detail.data;
				setClasses(selectClassArray);
			})
			//删除班级的监听
		setRemoveClassListener();
		//设置是否在线的监听
		setIsOnline();
		//提交作业的监听
		setSubmitEvent();
		var lastEditRange = null;
		var publish_container = document.getElementById('publish-content');
		//录音键
		events.addTap('getRecord', function() {
				startRecord()
			})
			//相机按钮
		events.addTap('getImg', function() {
				camera.getPic(camera.getCamera(), function(picPath) {
					console.log("picPath:" + picPath);
				})
			})
			//录像按钮
		events.addTap('getVideo', function() {
			camera.getVideo(camera.getCamera(), function(videoPath) {
				console.log("videoPath:" + videoPath);
			})
		});
	})
	//17.获取所有科目列表
function requestSubjectList(callback) {
	//所需参数
	var comData = {};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//17.获取所有科目列表
	postDataPro_GetSubjectList(comData, wd, function(data) {
		wd.close();
		console.log('发布作业界面获取的科目列表数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//给科目数组赋值
			callback(data.RspData.List);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 放置科目
 * @param {Object} subjectList
 */
var setSubjects = function(subjectList) {
		events.clearChild(subjectsContainer);
		subjectList.forEach(function(subject, i) {
			var op = document.createElement('option');
			op.value = subject.Value;
			op.innerText = subject.Text;
			subjectsContainer.appendChild(op);
		});
	}
	//	/**
	//	 * 选中科目的监听
	//	 */
	//var getSelectSubject = function() {
	//		selectSubjectID = subjectsContainer[subjectsContainer.selectedIndex].value;
	//	}
	/**
	 * 放置班级列表
	 * @param {Object} classes
	 */
var setClasses = function() {
		//班级数据列表控件
		var classesContainer = document.getElementById('classes');
		//清空班级数据
		events.clearChild(classesContainer)
		for(var i in selectClassArray) {
			if(selectClassArray[i].isSelected) {
				var p = document.createElement('p');
				p.className = 'gid' + selectClassArray[i].gid;
				//				p.innerText = classes[i].gname;
				p.innerHTML = selectClassArray[i].gname + '<sup class="mui-badge mui-badge-inverted mui-badge-danger class-del">x</sup>'
				classesContainer.appendChild(p);
				p.querySelector('.class-del').bindClass = selectClassArray[i];
			}

		}
	}
	/**
	 * 删除班级的监听
	 */
var setRemoveClassListener = function() {
		mui('.receive-classes').on('tap', '.class-del', function() {
			var classes = document.getElementById('classes');
			classes.removeChild(classes.querySelector('.gid' + this.bindClass.gid));
			console.log('删除的班级数据：' + JSON.stringify(this.bindClass));
			selectClassArray[selectClassArray.indexOf(this.bindClass)].isSelected = false;
			console.log('删除班级后所有班级数据：' + JSON.stringify(selectClassArray));
		})
	}
	/**
	 * 是否在线提交
	 */
var setIsOnline = function() {
		document.getElementById("onlineSwitch").addEventListener("toggle", function(event) {
			if(event.detail.isActive) {
				submitOnLine = true;
				console.log("你启动了开关");
			} else {
				submitOnLine = false;
				console.log("你关闭了开关");
			}
		})
	}
	/**
	 * 提交按钮的监听
	 */
var setSubmitEvent = function() {
	//提交按钮
	events.addTap('submitBtn', function() {
		selectSubjectID = parseInt(subjectsContainer[subjectsContainer.selectedIndex].value);
		//判断是否有科目
		if(selectSubjectID) {
			//判断是否选择了班级
			if(selectClassArray.length > 0) {
				var content = document.getElementById('publish-content').value;
				//判断是否有发送内容
				if(content) {
					//12.发布作业
					requestPublishHomework()
				} else {
					mui.toast('请输入作业内容')
				}
			} else {
				mui.toast('请选择作业发布班级班级')
			}
		} else {
			mui.toast('您未选科目')
		}

	});
}

//获取班级里面的人
function requestClassStudents() {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	requirePostGUInfo(wd);
}
/**
 * //13.通过群ID获取群的正常用户
 * @param {Object} i 班级索引
 * @param {Object} wd 等待框
 * @param {Object} callback 回调函数
 */
var requirePostGUInfo = function(wd, callback) {
	var tempFlag = 0;
	for(var a in selectClassArray) {
		var tempModel = selectClassArray[a];
		tempModel.isSelected = true;
		tempModel.studentArray = [];
		//所需参数
		var comData = {
			top: '-1', //选择条数
			vvl: tempModel.gid, //群ID，查询的值
			vvl1: '-1' //群员类型，0家长,1管理员,2老师,3学生,-1取全部
		};
		postDataPro_PostGusers(comData, wd, function(data) {
			tempFlag++;
			if(data.RspCode == 0) {
				console.log('13.postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
				//遍历班级列表，
				for(var n in selectClassArray) {
					var tempModel2 = selectClassArray[n];
					//通过id，将数据塞到不同的数组
					var tempArray = data.RspData;
					for(var m in tempArray) {
						var tempModel1 = tempArray[m];
						//判断群id
						if(tempModel2.gid == tempModel1.gid) {
							//判断是否为家长或学生
							if(tempModel1.mstype == 0 || tempModel1.mstype == 3) {
								tempModel2.studentArray.push(tempModel1);
							}
						}
					}
				}

			}
			//请求完成后，请求下一个班级
			if(tempFlag == selectClassArray.length) {
				console.log('学生资料群信息数据：' + JSON.stringify(selectClassArray))
				setClasses();
				wd.close();
			}
		});

	}

}

//12.发布作业
function requestPublishHomework() {
	//组装学生数组串，
	var tempStuArray = [];
	//循环选择的群
	console.log('发布作业前数据：' + JSON.stringify(selectClassArray));
	for(var i in selectClassArray) {
		var tempClassModel = selectClassArray[i];
		if(tempClassModel.isSelected) {
			//循环群里面的学生、家长
			for(var m in tempClassModel.studentArray) {
				var tempStuModel = tempClassModel.studentArray[m];
				tempStuArray.push(tempClassModel.gid + '|' + tempStuModel.utid);
			}
		}
	}
	if(tempStuArray.length == 0) {
		mui.toast('无发布作业的学生对象！');
		return;
	}
	//所需参数
	var comData = {
		teacherId: personalUTID, //教师Id
		subjectId: selectSubjectID, //科目Id， 见（一）.17. GetSubjectList()；
		studentIds: tempStuArray.toString(), //班级Id+学生Id串，班级Id和学生Id以“|“分割，如“班级Id|学生Id”，每对id之间逗号分隔，例如“1|1,1|2”；
		content: document.getElementById('publish-content').value, //作业内容
		submitOnLine: submitOnLine, //是否需要在线提交；
		fileIds: '' //上传文件的id串，例如“1,2”；
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//12.发布作业,逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
	postDataPro_PublishHomework(comData, wd, function(data) {
		wd.close();
		console.log('发布作业界面发布作业回调：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//提示成功，清空界面数据
			document.getElementById('publish-content').value = '';
			submitOnLine = true;
			events.clearChild(subjectsContainer);
			events.clearChild(document.getElementById('classes'));
			events.fireToPageNone('homework-tea-sub.html', 'homeworkPublished');
			mui.toast('发布作业成功！');
			mui.back();
		} else {
			mui.toast(data.RspTxt);
		}
	});
}