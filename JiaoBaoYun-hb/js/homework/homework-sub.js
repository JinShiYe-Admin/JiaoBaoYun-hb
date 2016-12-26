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
mui.init();
//mui的plusready监听
mui.plusReady(function() {
		//预加载
		events.preload('workdetail-tea.html', 200);
		events.preload('homework-publish.html', 500);
		events.preload('workdetailTea-temporary.html', 300);
		events.preload('workdetail-stu.html', 800);
		events.preload('homework-commented.html', 600);
		events.preload('doHomework-stu.html', 600);

		//赋值
		list = document.getElementById('list-container');
		/**监听父页面的图标事件*/
		window.addEventListener('togglePop', function(e) {
			mui("#popover").popover('toggle');
		});
		//错题本按钮监听事件
		events.addTap('err', function() {
				events.openNewWindow('workstu-err.html')
			})
			//作业记录按钮监听事件
		events.addTap('record', function() {
			events.openNewWindow('homework-record.html')
		})
		var publish = document.getElementById('iconPublish');
		//加载监听
		window.addEventListener('workContent', function(e) {
			//个人UTID
			personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
			//获取个人身份角色
			role = e.detail.data.role;
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
			teacherClasses = e.detail.data.teacherClasses;
			//学生家长的班级数据
			studentClasses = e.detail.data.studentClasses;
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
				selectGId = teacherClasses[0].gid;
				requireHomeWork(teacherClasses[0], setData);
				//家长、老师角色默认获取的数据
			} else {
				selectGId = studentClasses[0].gid;
				requireHomeWork(studentClasses[0], setData);
			}
		});
		window.addEventListener('roleChanged', function(e) {
			mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
			role = e.detail.data;
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

		})
		window.addEventListener('homeworkPublished', function() {

			})
			//设置监听
		setListener();
		//下拉刷新
		addPullFresh();
		pullUpRefresh();
	})
	/**
	 * 下拉刷新数据
	 */
function addPullFresh() {
	ws = plus.webview.currentWebview();
	ws.setPullToRefresh({
		support: true,
		height: "50px",
		range: "200px",
		contentdown: {
			caption: "下拉可以刷新"
		},
		contentover: {
			caption: "释放立即刷新"
		},
		contentrefresh: {
			caption: "正在刷新..."
		}
	}, function() {
		selectGContainer.classInfo.pageIndex = 1;
		events.clearChild(list);
		requireHomeWork(selectGContainer.classInfo, setData);
		setTimeout(function() {
			ws.endPullToRefresh();
		}, 2000)

	});
	//	plus.nativeUI.toast("下拉可以刷新");
}
var pullUpRefresh = function() {

	document.addEventListener("plusscrollbottom", function() {
		console.log('我在底部pageIndex:' + selectGContainer.classInfo.pageIndex + ',totalPageCount:' + totalPageCount);
		if(selectGContainer.classInfo.pageIndex < totalPageCount) {
			selectGContainer.classInfo.pageIndex++;
			requireHomeWork(selectGContainer.classInfo, setData);
		} else {
			mui.toast('注意，您已到达我的底线');
		}
	}, false);
}

/**
 * 设置监听
 */
var setListener = function() {
		mui('.tabs-classes').on('tap', '.mui-control-item', function() {
			selectGContainer = this;
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
					requireHomeWork(this.classInfo, setData);
				}
				//学生家长角色
			} else {
				if(studentHash.get(selectGId)) {
					setHomeworkData(studentHash.get(selectGId));
				} else {
					requireHomeWork(this.classInfo, setData);
				}
			}
		})
		var publish = document.getElementById('iconPublish');
		//常规作业点击事件
		mui('.mui-table-view').on('tap', '.publishedHomework', function() {
				events.fireToPageNone('workdetail-tea-sub.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
				plus.webview.getWebviewById("workdetail-tea.html").show();
			})
			//临时作业点击事件
		mui('.mui-table-view').on('tap', '.publishedAnswer', function() {
				events.fireToPageNone('workdetailTea-temSub.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
				plus.webview.getWebviewById("workdetailTea-temporary.html").show();
			})
			//学生作业在线提交点击事件
		mui('.mui-table-view').on('tap', '.submitOnline', function() {
				events.fireToPageWithData('workdetail-stu.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
			})
			//学生作业在线提交点击事件
		mui('.mui-table-view').on('tap', '.noSubmit', function() {
				events.fireToPageWithData('workdetail-stu.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
			})
			//学生作业已提交点击事件
		mui('.mui-table-view').on('tap', '.isSubmitted', function() {
				events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
			})
			//学生作业在已评论点击事件
		mui('.mui-table-view').on('tap', '.isCommentedBG', function() {
				events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
			})
			//学生作业在未评论临时作业点击事件
		mui('.mui-table-view').on('tap', '.noCommentedBG', function() {
				events.fireToPageWithData('homework-commented.html', 'workDetail', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
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
					var tempArray = data.RspData.Dates[1].AnswerResults;
					for(var m in tempArray) {
						var tempModel = tempArray[m];
						tempIDs.push(tempModel.TeacherId);
					}
					if(tempIDs.length > 0) {
						//给老师id数组去重
						tempIDs = arrayDupRemoval(tempIDs);
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
								for(var m in tempArray) {
									var tempModel = tempArray[m];
									for(var n in data1.RspData) {
										var tempModel1 = data1.RspData[n];
										//判断id是否一致，一致则合并
										if(tempModel1.utid == tempModel.TeacherId) {
											tempModel = $.extend(tempModel, tempModel1);
										}
									}
								}
								console.log('合并后的数据为：' + JSON.stringify(data));
								selectGContainer.classInfo.totalPageCount = totalPageCount;
								setHashData(comData, data);
								callback(data.RspData.Dates)
							}
						});
					}

				} else {
					mui.toast(data.RspTxt);
				}
				callback()
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
		if(publishedData) {
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
		homework.Subject + '作业</h6><p class="header-content single-line">' + homework.Contents + '</p></div></div>' +
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
			imgsInner += '<img class="answerResult-pic" src="' + storageKeyName.MAINHOMEWORKURL + thumbUrl + '"/>';
		}
	})
	imgsInner += '<span class="mui-icon mui-icon-arrowright temporary-more"></span>'
	return imgsInner;
}
var createStuHomeworkInner = function(homework) {
	return '<a><div class="stuHomework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words stuHead-words"><h6 class="header-title single-line">' +
		homework.Subject + '作业</h6><p class="header-content single-line">' + homework.Contents + '</p></div></div></a>';
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

	return '<img class="answerResult-pic" src="' + storageKeyName.MAINHOMEWORKURL + answerResult.ThumbUrl + '"/>';
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