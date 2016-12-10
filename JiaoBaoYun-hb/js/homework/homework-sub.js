/**
 * @anthor an
 * 教师作业模块
 */
var personalUTID;
var role;
var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var teacherHash;
var studentHash;
var selectGId;
var list;
mui.init();
//mui的plusready监听
mui.plusReady(function() {
		events.preload('workdetail-tea.html', 200);
		events.preload('homework-publish.html', 500);
		personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		list = document.getElementById('list-container');
		/**监听父页面的图标事件*/
		window.addEventListener('togglePop', function(e) {
			mui("#popover").popover('toggle');
		});
		var publish = document.getElementById('iconPublish');
		window.addEventListener('workContent', function(e) {
			role = e.detail.data.role;
			if(role == 2) {
				publish.style.display = 'block';
			} else {
				publish.style.display = 'none';
			}
			teacherClasses = e.detail.data.teacherClasses;
			studentClasses = e.detail.data.studentClasses;
			teacherHash = newHashMap();
			studentHash = newHashMap();
			setClasses(role);
			if(role == 2) {
				selectGId = teacherClasses[0].gid;
				requireHomeWork(teacherClasses[0], setData);
			} else {
				selectGId = studentClasses[0].gid;
				requireHomeWork(studentClasses[0], setData);
			}
		});
		window.addEventListener('roleChanged', function(e) {
			role = e.detail.data;
			console.log('作业子页面获取的角色变换值roleChanged：' + role);
			setClasses(role);
			if(role == 2) {
				publish.style.display = 'block';
				selectGId = teacherClasses[0].gid;
				requireHomeWork(teacherClasses[0], setData);
			} else {
				publish.style.display = 'none';
				selectGId = studentClasses[0].gid;
				requireHomeWork(studentClasses[0], setData);
			}

		})
		window.addEventListener('homeworkPublished', function() {

		})
		setListener();
		//发布作业界面
		publish.addEventListener('tap', function() {
			events.fireToPageWithData('homework-publish.html', 'postClasses', teacherClasses);
		})

		events.addTap('tempDetail', function() {
			events.openNewWindow('workdetail-tea.html')
		});
	})
	/**
	 * 设置监听
	 */
var setListener = function() {
		mui('.tabs-classes').on('tap', '.mui-control-item', function() {
			selectGId = this.classInfo.gid;
			console.log('被点击的班级数据：' + JSON.stringify(this.classInfo));
			if(role == 2) {
				if(teacherHash.get(selectGId)) {
					setPublishedData();
				} else {
					requireHomeWork(this.classInfo, setData);
				}
			} else {
				if(studentHash.get(selectGId)) {
					setHomeworkData()
				} else {
					requireHomeWork(this.classInfo, setData);
				}
			}
		})
		mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
			events.fireToPageNone('workdetail-tea-sub.html', 'workDetail', this.homeworkInfo);
			plus.webview.getWebviewById("workdetail-tea.html").show();
		})
	}
	/**
	 * 放置班级列表数据
	 * @param {Object} role 角色
	 */
var setClasses = function(role) {
		var tabs = document.getElementById('scroll-class');
		events.clearChild(tabs);
		var classes;
		if(role == 2) {
			classes = teacherClasses;
		} else {
			classes = studentClasses;
		}
		classes.forEach(function(classModel, i, classArray) {
			initializeClassesIndex(i);
			var a = document.createElement('a');
			a.className = 'mui-control-item';
			a.innerText = classModel.gname;
			tabs.appendChild(a);
			a.classInfo = classModel;
		})
		tabs.firstElementChild.className = "mui-control-item mui-active";
	}
	/**
	 * 初始化每个班级请求页码为1
	 * @param {Object} i
	 */
var initializeClassesIndex = function(i) {
	if(role == 2) {
		teacherClasses[i].pageIndex = 1;
	} else {
		studentClasses[i].pageIndex = 1;
	}
}
var requireHomeWork = function(classModel, callback) {
	var comData = {};
	if(role == 2) {
		comData.teacherId = personalUTID;
	} else {
		comData.studentId = classModel.stuid;
	}
	comData.classId = classModel.gid;
	comData.pageIndex = classModel.pageIndex;
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	if(role == 2) {
		postDataPro_GetHomeworkList(comData, wd, function(data) {
			wd.close();
			console.log('作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				setHashData(comData, data);
			} else {
				mui.toast(data.RspTxt);
			}
			callback()
		})
	}else{
		postDataPro_GetHomeworkListStu(comData, wd, function(data) {
			wd.close();
			console.log('作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				setHashData(comData, data);
			} else {
				mui.toast(data.RspTxt);
			}
			callback()
		})
	}

}
var setData = function() {
		//老师角色
		if(role == 2) {
			setPublishedData();
			//家长和学生
		} else {
			setHomeworkData();
		}
	}
	/**
	 * 放置我发布的数据
	 */
var setPublishedData = function() {
		events.clearChild(list);
		var publishedData = teacherHash.get(selectGId);
		console.log('发布作业的Id：' + selectGId + ';老师作业的数据：' + JSON.stringify(publishedData));
		if(publishedData) {
			publishedData.forEach(function(DateHM, i) {
				var divider = document.createElement('li');
				divider.className = 'mui-table-view-divider';
				divider.innerText = DateHM.Date;
				list.appendChild(divider);
				if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
					DateHM.Homeworks.forEach(function(homework, i) {
						homework.classId = selectGId;
						homework.Date=DateHM.Date;
						var li = document.createElement('li');
						li.homeworkInfo = homework;
						li.className = 'mui-table-view-cell';
						li.innerHTML = createHomeworkInner(homework);
						list.appendChild(li);
					})
				}
				if(DateHM.AnswerResultIds && DateHM.AnswerResultIds.length > 0) {
					DateHM.AnswerResultIds.forEach(function(answerResult, i) {
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell';
						li.innerHTML = createAnswerResultInner(answerResult);
						list.appendChild(li);
					})
				}
			})
		}

	}
	/**
	 * 
	 * @param {Object} homework 
	 * "Contents":"1+1=？","HomeworkId":109,
	 * "HomeworkTitle":"2016年12月8日星期四语文作业",
	 * "Remain":11,"Subject":"语文","Upload":0
	 * 
	 */
var createHomeworkInner = function(homework) {
	return '<a><div class="homework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words"><h5 class="header-title">' +
		homework.HomeworkTitle + '</h5><p class="header-content">' + homework.Contents + '</p></div></div>' +
		'<div class="homework-bottom"><p>未提交数(' + homework.Remain +
		')</p><p>已提交数(' + homework.Upload + ')</p></div></a>';
}
var createAnswerResultInner = function(answerResult) {
	return '<a><div class="answerResult-header">' + getAnswerImgs(answerResult.ThumbUrls) +
		'</div><p class="answerResult-bottom">已提交数(' + answerResult.Upload + ')</p></a>'
}
var getAnswerImgs = function(thumbUrls) {
	var imgsInner = '';
	thumbUrls.forEach(function(thumbUrl) {
		imgsInner += '<img class="answerResult-pic" src="' + thumbUrl + '"/>';
	})
	return imgsInner;
}
var createStuHomeworkInner = function(homework) {
	return '<a><div class="stuHomework-header"><span class="mui-icon iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words"><h5 class="header-title">' +
		homework.HomeworkTitle + '</h5><p class="header-content">' + homework.Contents + '</p></div></div>' +
		'<div class="stuHomework-bottom"></div></a>';
}
var createStuAnswerResultInner = function(answerResult) {

}
var getHomeworkIcon = function(subject) {
		var subjectIcon = '';
		switch(subject) {
			case '语文':
				subjectIcon = 'icon-yuwen';
				break;
			case '数学':
				subjectIcon = 'icon-shuxue';
				break;
			case '英语':
				subjectIcon = 'icon-yingyu';
				break;
			case '政治':
				subjectIcon = 'icon-zhengzhi';
				break;
			case '历史':
				subjectIcon = 'icon-lishi';
				break;
			case '地理':
				subjectIcon = 'icon-dili';
				break;
			case '物理':
				subjectIcon = 'icon-wuli';
				break;
			case '化学':
				subjectIcon = 'icon-huaxue';
				break;
			case '生物':
				subjectIcon = 'icon-shengwu';
				break;
			default:
				subjectIcon = 'icon-qita';
				break;
		}
		return subjectIcon;
	}
	/**
	 * 要区分家长和学生作业界面
	 */
var setHomeworkData = function() {
	var homeworkData = studentHash.get(selectGId);
	events.clearChild(list);
	if(homeworkData) {
		homeworkData.forEach(function(DateHM, i) {
			var divider = document.createElement('li');
			divider.className = 'mui-table-view-divider';
			divider.innerText = DateHM.Date;
			list.appendChild(divider);
			if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
				DateHM.Homeworks.forEach(function(homework, i) {
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = createStuHomeworkInner(homework);
					list.appendChild(li);
				})
			}
			if(DateHM.AnswerResultIds && DateHM.AnswerResultIds.length > 0) {
				DateHM.AnswerResultIds.forEach(function(answerResult, i) {
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = createStuAnswerResultInner(answerResult);
					list.appendChild(li);
				})
			}
		})
	}

}
var setHashData = function(comData, data) {
	if(comData.pageIndex == 1) {
		if(role == 2) {
			teacherHash.put(comData.classId, data.RspData.Dates);
		} else {
			studentHash.put(comData.classId, data.RspData.Dates);
		}
	} else {
		if(role == 2) {
			teacherHash.put(comData.classId, teacherHash.get(comData.classId).concat(data.RspData.Dates));
		} else {
			studentHash.put(comData.classId, teacherHash.get(comData.classId).concat(data.RspData.Dates));
		}
	}
}

//获取老师、家长作业列表
function requestData(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.根据教师Id和班级Id获取作业列表；逻辑：获取有效的、未毕业的、教师Id在群中的角色是老师的群列表；
	postDataPro_GetHomeworkList(comData, wd, function(data) {
		wd.close();
		console.log('作业主界面作业列表：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			changeSavedData(comData, data.RspData.Dates);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 仿HashMap
 */
var newHashMap = function() {
	var HashMap = {
		put: function(key, value) {
			this[key] = value
		},
		get: function(key) {
			return this[key]
		},
		contains: function(key) {
			return this.Get(key) == null ? false : true
		},
		remove: function(key) {
			delete this[key]
		},
		length: function() {
			return Object.getOwnPropertyNames(this).length - 5;
		}
	}
	return HashMap;
}