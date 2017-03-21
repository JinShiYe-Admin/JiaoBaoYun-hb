/**
 * @anthor an
 * 教师作业模块
 */
var personalUTID; //个人UTID
var role; //角色 2老師 30 學生/家長
var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var teacherHash; //老师作业键值对
var studentHash; //学生作业键值对
var selectGId; //选取班级数据
var selectGContainer; //选中的班级控件；
var list; //数据列表
var totalPageCount;
var clickItem; //点击的子控件
//var classInfo;
mui.init();
var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var role = 2; //老师角色 30为家长+学生角色
var publish;
//加载子页面
//events.initSubPage('homework-tea-sub.html');
//mui.plusReady(function() {
//
//})
//向子页面传递数据
//var sendMsgToSub = function() {
//	events.fireToPageNone("homework-tea-sub.html", 'workContent', {
//		role: role,
//		studentClasses: studentClasses,
//		teacherClasses: teacherClasses
//	});
//}
/**
 * 设置标题栏
 * @param {Object} title
 * @param {Object} roles
 * @param {Object} btn_m
 */
var setChoices = function(title, roles, btn_m) {
	if(teacherClasses.length > 0 && studentClasses.length > 0) {
		if(roles.classList.contains("mui-active")) {
			mui('#workPage-roles').switch().toggle();
		}
		title.style.display = 'none';
		roles.style.display = 'inline-block';
		//		btn_m.style.display = 'none';
		role = 2;

	} else if(teacherClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '我发布的';
		role = 2;
		//		btn_m.style.display = 'none';
	} else if(studentClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '学生作业'
		//		btn_m.style.display = 'block'
		role = 30;
	}
	//向子页面传递数据
	//	sendMsgToSub();
	getWorkDetail();
}
//mui的plusready监听
mui.plusReady(function() {
	publish = document.getElementById('iconPublish');
	events.fireToPageNone('../cloud_home.html', 'homeworkReady');
	//预加载
	events.preload('homework-publish.html', 500);
	events.preload('workdetailTea-temporary.html', 300);
	events.preload('workdetail-stu.html', 400);
	//	events.preload('homework-commented.html', 200);
	events.preload('doHomework-stu.html', 600);
	//赋值
	list = document.getElementById('list-container');
	//加载h5下拉刷新方式
	h5fresh.addRefresh(function() {
		selectGContainer.classInfo.pageIndex = 1;
		events.clearChild(list);
		requireHomeWork(selectGContainer.classInfo, setData);
	}, {
		style: 'circle',
		offset:"50px"
	});
	/**监听父页面的图标事件*/
	window.addEventListener('togglePop', function(e) {
		mui("#popover").popover('toggle');
	});
	//预加载发布作业界面
	events.preload('publish-answer.html');
	mui('.mui-scrollbar-horizontal').scroll();
	var title = document.getElementById('workPage-title');
	var roles = document.getElementById('workPage-roles');
	var btn_more = document.getElementById('more');
	btn_more.style.display = 'none';
	window.addEventListener('postClasses', function(e) {
		var data = e.detail.data;
		console.log('作业主界面获取信息：' + JSON.stringify(e.detail.data));
		studentClasses = data.studentClasses;
		teacherClasses = data.teacherClasses;
		setChoices(title, roles, btn_more);
	})
	//三道杠的点击事件
	//	events.addTap('more', function() {
	//			//通知子页面，显示、关闭菜单 
	//			events.fireToPageNone('homework-tea-sub.html', 'togglePop');
	//		})
	//相机点击事件
	events.addTap('icon-camero', function() {
		events.fireToPageWithData('publish-answer.html', 'roleInfo', {
			role: role,
			studentClasses: studentClasses,
			teacherClasses: teacherClasses
		})
	})

	//角色选择的监听
	roles.addEventListener("toggle", function(event) {
		if(event.detail.isActive) {
			role = 30;
			//			btn_more.style.display='block';
		} else {
			role = 2;
			//			btn_more.style.display='none';
		}
		roleChanged();
	})
	var _back = mui.back;
	mui.back = function() {
		if(plus.webview.currentWebview().opener().id = "homework-commented.html") {
			if(teacherClasses.length > 0 && studentClasses.length > 0) {
				if(roles.classList.contains("mui-active")) {
					mui('#workPage-roles').switch().toggle();
				}
			}
			plus.webview.getWebviewById('index.html').show();
		} else {
			_back();
		}
	}
	window.addEventListener('homeworkDone', function() {
		clickItem.homeworkInfo.IsSubmitted = true;
		clickItem.className = 'mui-table-view-cell stuHomework ' + getBackGround(clickItem.homeworkInfo);
		clickItem.innerHTML = createStuHomeworkInner(clickItem.homeworkInfo);
	})
	//错题本按钮监听事件
	events.addTap('err', function() {
		events.openNewWindow('workstu-err.html')
	})
	//作业记录按钮监听事件
	events.addTap('record', function() {
		events.openNewWindow('homework-record.html')
	})

	window.addEventListener('homeworkPublished', function() {
		teacherHash = newHashMap();
		selectGContainer.classInfo.pageIndex = 1;
		events.clearChild(list);
		requireHomeWork(selectGContainer.classInfo, setData);
	})
	//设置监听
	setListener();
	//下拉刷新
//	addPullFresh();
	pullUpRefresh();
})
/**
 * 更改角色
 */
var roleChanged = function() {
	mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
	console.log('作业子页面获取的角色变换值roleChanged：' + role);
	setClasses(role);
	events.clearChild(list);
	if(role == 2) {
		mui("#popover").popover('hide');
		publish.style.display = 'block';
		selectGId = teacherClasses[0].gid;
		requireHomeWork(teacherClasses[0], setData);
	} else {
		publish.style.display = 'none';
		selectGId = studentClasses[0].gid;
		requireHomeWork(studentClasses[0], setData);
	}

}
/**
 * 获取作业详情
 */
var getWorkDetail = function() {
	mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
	//个人UTID
	personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	//获取个人身份角色
	//		role = e.detail.data.role;
	console.log("角色：" + role);
	//老师
	if(role == 2) {
		mui("#popover").popover('hide');
		//显示发布作业按钮
		publish.style.display = 'block';
	} else {
		//不显示发布作业按钮
		publish.style.display = 'none';
	}
	//老师角色的班级数据
	//		teacherClasses = e.detail.data.teacherClasses;
	//		//学生家长的班级数据
	//		studentClasses = e.detail.data.studentClasses;
	console.log('作业主界面获取的teacherClasses:' + JSON.stringify(teacherClasses))
	console.log('作业主界面获取的studentClasses:' + JSON.stringify(studentClasses))
	//老师角色的作业数据
	teacherHash = newHashMap();
	//学生、家长的作业数据
	studentHash = newHashMap();
	//根据角色不同，加载班级列表
	setClasses(role);
	//老师角色，默认获取的数据
	events.clearChild(list);

	if(role == 2) {
		//			classInfo = teacherClasses[0];
		selectGId = teacherClasses[0].gid;
		requireHomeWork(teacherClasses[0], setData);
		//家长、老师角色默认获取的数据
	} else {
		//			classInfo = studentClasses[0];
		selectGId = studentClasses[0].gid;
		requireHomeWork(studentClasses[0], setData);
	}
}
/**
 * 下拉刷新数据
 */
//function addPullFresh() {
//	ws = plus.webview.currentWebview();
//	ws.setPullToRefresh({
//		support: true,
//		height: "50px",
//		range: "200px",
//		contentdown: {
//			caption: "下拉可以刷新"
//		},
//		contentover: {
//			caption: "释放立即刷新"
//		},
//		contentrefresh: {
//			caption: "正在刷新..."
//		}
//	}, function() {
//		selectGContainer.classInfo.pageIndex = 1;
//		events.clearChild(list);
//		requireHomeWork(selectGContainer.classInfo, setData);
//		setTimeout(function() {
//			ws.endPullToRefresh();
//		}, 2000)
//
//	});
//	plus.nativeUI.toast("下拉可以刷新");
//}
var pullUpRefresh = function() {

	document.addEventListener("plusscrollbottom", function() {
		console.log('我在底部pageIndex:' + selectGContainer.classInfo.pageIndex + ',totalPageCount:' + totalPageCount);
		if(selectGContainer.classInfo.pageIndex < totalPageCount) {
			selectGContainer.classInfo.pageIndex++;
			requireHomeWork(selectGContainer.classInfo, setData);
		} else {
			mui.toast('到底啦，别拉了！');
		}
	}, false);
}

/**
 * 设置监听
 */
var setListener = function() {
	mui('.tabs-classes').on('tap', '.mui-control-item', function() {
		selectGContainer = this;
		//		classInfo = this.classInfo;
		selectGId = this.classInfo.gid;
		events.clearChild(list);
		console.log('被点击的班级数据：' + JSON.stringify(this.classInfo));
		totalPageCount = this.classInfo.totalPageCount;
		//老师角色
		if(role == 2) {
			//如果数据已存在
			if(teacherHash.get(selectGId)) {
				setPublishedData(teacherHash.get(selectGId));
				//如果数据不存在
			} else {
				this.classInfo.pageIndex = 1;
				requireHomeWork(this.classInfo, setData);
			}
			//学生家长角色
		} else {
			if(studentHash.get(selectGId)) {
				setHomeworkData(studentHash.get(selectGId));
			} else {
				this.classInfo.pageIndex = 1;
				requireHomeWork(this.classInfo, setData);
			}
		}
	})
	var publish = document.getElementById('iconPublish');
	//常规作业点击事件
	mui('.mui-table-view').on('tap', '.publishedHomework', function() {
		events.openNewWindowWithData('workdetail-tea.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
		//		plus.webview.getWebviewById("workdetail-tea.html").show();
	})
	//临时作业点击事件
	mui('.mui-table-view').on('tap', '.publishedAnswer', function() {
		events.fireToPageNone('workdetailTea-temSub.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
		plus.webview.getWebviewById("workdetailTea-temporary.html").show();
	})
	//学生作业在线提交点击事件
	mui('.mui-table-view').on('tap', '.submitOnline', function() {
		clickItem = this;
		events.fireToPageWithData('workdetail-stu.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//学生作业不需要提交点击事件
	mui('.mui-table-view').on('tap', '.noSubmit', function() {
		events.fireToPageWithData('workdetail-stu.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//学生作业已提交点击事件
	mui('.mui-table-view').on('tap', '.isSubmitted', function() {
		events.openNewWindowWithData('homework-commented.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo))
		//		events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//学生作业在已评论点击事件
	mui('.mui-table-view').on('tap', '.isCommentedBG', function() {
		events.openNewWindowWithData('homework-commented.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo))
		//		events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//学生作业在未评论临时作业点击事件
	mui('.mui-table-view').on('tap', '.noCommentedBG', function() {
		events.openNewWindowWithData('homework-commented.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo))
		//		events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//发布作业界面
	publish.addEventListener('tap', function() {
		events.fireToPageWithData('homework-publish.html', 'postClasses', teacherClasses);
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
	selectGContainer = tabs.firstElementChild;
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
/**
 * 请求作业列表
 * @param {Object} classModel
 * @param {Object} callback
 */
var requireHomeWork = function(classModel, callback) {
	console.log("请求作业数据：" + 123);
	var comData = {};
	if(role == 2) {
		comData.teacherId = personalUTID;
	} else {
		comData.studentId = personalUTID;
	}
	comData.classId = classModel.gid;
	comData.pageIndex = classModel.pageIndex;
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	if(role == 2) {
		postDataPro_GetHomeworkList(comData, wd, function(data) {
			wd.close();
			console.log('老师、作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				totalPageCount = data.RspData.PageCount;
				selectGContainer.classInfo.totalPageCount = totalPageCount;
				setHashData(comData, data);
				callback(data.RspData.Dates)
			} else {
				mui.toast(data.RspTxt);
			}

		})
	} else {
		postDataPro_GetHomeworkListStu(comData, wd, function(data) {
			wd.close();
			console.log('学生、作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				totalPageCount = data.RspData.PageCount;
				//向作业数组中合并人员信息
				//获取临时作业，老师id
				var tempIDs = [];
				var tempArray = [];
				for(var i in data.RspData.Dates) {
					//						if(data.RspData.Dates[i].AnswerResults.length > 0) {
					tempArray = tempArray.concat(data.RspData.Dates[i].AnswerResults);
					tempArray = tempArray.concat(data.RspData.Dates[i].Homeworks);
					//						}
				}
				console.log('重组后的学生作业：' + JSON.stringify(tempArray));
				for(var m in tempArray) {
					var tempModel = tempArray[m];
					tempIDs.push(tempModel.TeacherId);
				}
				//有临时作业
				if(tempIDs.length > 0) {
					//给老师id数组去重
					tempIDs = events.arraySingleItem(tempIDs)
					//21.通过用户ID或ID串获取用户资料
					//所需参数
					var comData1 = {
						vvl: tempIDs.toString(), //用户id，查询的值,p传个人ID,g传ID串
						vtp: 'g' //查询类型,p(个人)g(id串)
					};
					//21.通过用户ID或ID串获取用户资料
					postDataPro_PostUinf(comData1, wd, function(data1) {
						wd.close();
						console.log('通过用户ID或ID串获取用户资料：' + JSON.stringify(data1));
						if(data1.RspCode == 0) {
							//循环遍历
							for(var m in data.RspData.Dates) {
								for(var j in data.RspData.Dates[m].AnswerResults) {
									for(var n in data1.RspData) {
										var tempModel1 = data1.RspData[n];
										//判断id是否一致，一致则合并
										if(tempModel1.utid == data.RspData.Dates[m].AnswerResults[j].TeacherId) {
											jQuery.extend(data.RspData.Dates[m].AnswerResults[j], tempModel1);
											break;
										}
									}
								}
								for(var k in data.RspData.Dates[m].Homeworks) {
									for(var n in data1.RspData) {
										var tempModel1 = data1.RspData[n];
										//判断id是否一致，一致则合并
										if(tempModel1.utid == data.RspData.Dates[m].Homeworks[k].TeacherId) {
											jQuery.extend(data.RspData.Dates[m].Homeworks[k], tempModel1);
											break;
										}
									}
								}
							}
							console.log('合并后的数据为：' + JSON.stringify(data));
							selectGContainer.classInfo.totalPageCount = totalPageCount;
							setHashData(comData, data);
							callback(data.RspData.Dates)
						}
					});
				} else { //没有临时作业
					selectGContainer.classInfo.totalPageCount = totalPageCount;
					setHashData(comData, data);
					callback(data.RspData.Dates)
				}
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}

}
/**
 * 
 */
var setData = function(data) {
	//老师角色
	if(role == 2) {
		setPublishedData(data);
		//家长和学生
	} else {
		setHomeworkData(data);
	}
}
/**
 * 放置我发布的数据
 */
var setPublishedData = function(publishedData) {
	//		events.clearChild(list);
	//		var publishedData = teacherHash.get(selectGId);
	if(publishedData&&publishedData.length>0) {
		console.log('发布作业的Id：' + selectGId + ';老师作业的数据：' + JSON.stringify(publishedData));
		publishedData.forEach(function(DateHM, i) {
			var divider = document.createElement('li');
			divider.className = 'mui-table-view-divider';
			divider.innerText = DateHM.Date.split(' ')[0];
			list.appendChild(divider);
			if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
				DateHM.Homeworks.forEach(function(homework, i) {
					homework.classId = selectGId;
					homework.Date = DateHM.Date;
					var li = document.createElement('li');
					li.homeworkInfo = homework;
					li.className = 'mui-table-view-cell publishedHomework';
					li.innerHTML = createHomeworkInner(homework);
					list.appendChild(li);
				})
			}
			if(DateHM.AnswerResultIds && DateHM.AnswerResultIds.ThumbUrls.length > 0) {
				var li = document.createElement('li');
				DateHM.AnswerResultIds.Date = DateHM.Date;
				li.homeworkInfo = DateHM.AnswerResultIds;
				li.className = 'mui-table-view-cell publishedAnswer';
				li.innerHTML = createAnswerResultInner(DateHM.AnswerResultIds);
				list.appendChild(li);
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
 */
var createHomeworkInner = function(homework) {
	var inner = '<a><div class="homework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words"><h6 class="header-title single-line">' +
		homework.HomeworkTitle + '</h6><p class="header-content single-line">' + homework.Contents + '</p></div></div>' +
		submitOnlineCondition(homework) + '</a>';
	return inner;
}
var submitOnlineCondition = function(homework) {
	if(homework.SubmitOnline) {
		return '<div class="homework-bottom"><p>未提交数(' + homework.Remain +
			')</p><p>已提交数(' + homework.Upload + ')</p></div>';
	} else {
		return '';
	}

}
var createAnswerResultInner = function(answerResult) {
	return '<a><div class="answerResult-header">' + getAnswerImgs(answerResult.ThumbUrls) +
		'</div><p class="answerResult-bottom">已提交数(' + answerResult.Upload + ')</p></a>'
}
var getAnswerImgs = function(thumbUrls) {
	var imgsInner = '';
	thumbUrls.forEach(function(thumbUrl) {
		if(thumbUrl != null) {
			imgsInner += '<img class="answerResult-pic" src="' + thumbUrl + '"/>';
		}
	})
	imgsInner += '<span class="mui-icon mui-icon-arrowright temporary-more"></span>'
	return imgsInner;
}
var createStuHomeworkInner = function(homework) {
	return '<a><div class="stuHomework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words stuHead-words"><h6 class="header-title single-line">' +
		homework.HomeworkTitle + '</h6><p class="header-content single-line">' + homework.Contents + '</p><p class="publisher-container single-line">发布人 : ' + homework.unick + '</p></div></div></a>';
}
var getResultBackground = function(answerResult) {
	var backClassName;
	if(answerResult.IsCommented) {
		backClassName = 'isCommentedBG'
	} else {
		backClassName = 'noCommentedBG'
	}
	return backClassName;
}
var getBackGround = function(homework) {
	var backClassName = ''
	//已评论
	if(homework.IsCommented) {
		backClassName = 'isCommentedBG'
	} else {
		//已提交
		if(homework.IsSubmitted) {
			backClassName = 'isSubmitted';
			//未提交
		} else {
			//需在线提交
			if(homework.SubmitOnline) {
				backClassName = 'submitOnline';
			} else {
				backClassName = 'noSubmit';
			}
		}
	}
	return backClassName;
}
var createStuAnswerResultInner = function(answerResult) {
	return '<a><div class="answerResult-header">' + getStuAnswerImges(answerResult) +
		'</div><p class="answerResult-bottom"><span>' + answerResult.unick + '</span><span>' + answerResult.UploadTime + '</span></p></a>';
}
var getStuAnswerImges = function(answerResult) {

	return '<img class="answerResult-pic" src="' + answerResult.ThumbUrl + '"/>';
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
var setHomeworkData = function(homeworkData) {
	//		var homeworkData = studentHash.get(selectGId);
	if(homeworkData) {
		homeworkData.forEach(function(DateHM, i) {
			var divider = document.createElement('li');
			divider.className = 'mui-table-view-divider';
			divider.innerText = DateHM.Date.split(' ')[0];
			list.appendChild(divider);
			if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
				DateHM.Homeworks.forEach(function(homework, i) {
					var li = document.createElement('li');
					homework.Date = DateHM.Date;
					li.homeworkInfo = homework;
					li.className = 'mui-table-view-cell stuHomework ' + getBackGround(homework);
					li.innerHTML = createStuHomeworkInner(homework);
					list.appendChild(li);
				})
			}
			if(DateHM.AnswerResults && DateHM.AnswerResults.length > 0) {
				DateHM.AnswerResults.forEach(function(answerResult) {
					if(answerResult.ThumbUrl != null) {
						answerResult.Date = DateHM.Date;
						answerResult.workType = 0;
						var li = document.createElement('li');
						li.homeworkInfo = answerResult;
						li.className = 'mui-table-view-cell stuAnswer ' + getResultBackground(answerResult);
						li.innerHTML = createStuAnswerResultInner(answerResult);
						list.appendChild(li);
					}

				})

			}
		})
	}

}
/**
 * 
 * @param {Object} comData
 * @param {Object} data
 */
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