var workInfo;
var personalUTID;
mui.init()
mui.plusReady(function() {
	window.addEventListener('workInfo', function(e) {
		workInfo = e.detail.data;
		console.log('老师评价页面获取的作业信息：' + JSON.stringify(workInfo))
		personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		setStuInfo();
		setCondition();
		//{"IconUrl":null,"IsCommented":false,"StudentId":1,"StudentName":null,
		//"ClassId":78,"HomeworkId":165,
		//"gid":78,"gutid":160,"utid":1,"ugname":"遥不可及","ugnick":"遥不可及",
		//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge1.png?1480991289388","mstype":3} at js/homework/homework-comment.js:5
		if(workInfo.workType == 0) {
			requireAnswerResult();
		} else {
			requireHomeworkResult();
		}
	})
	setListener();
})

var setStuInfo = function() {
	var uimg = workInfo.uimg;
	var ugnick = workInfo.ugnick;
	document.getElementById('stu-head').src = uimg;
	document.getElementById('stu-name').innerText = ugnick;
}
var setCondition = function() {
	var btn_comment = document.getElementById('btn-comment');
	//是否已评论
	if(workInfo.IsCommented) {
		btn_comment.innerText = '更改评论';
	} else {
		btn_comment.innerText = '提交评论';
	}
}
var setListener = function() {
		events.addTap('btn-comment', function() {
			var commentValue = document.getElementById('comment-area').value;
			if(commentValue) {
				if(workInfo.workType == 0) {
					if(workInfo.IsCommented) {
						modifyAnswerComment(commentValue);
					} else {
						commentAnswer(commentValue);
					}
				} else {
					if(workInfo.IsCommented) {
						modifyHomeworkComment(commentValue);
					} else {
						commentHomework(commentValue);
					}

				}
			} else {
				mui.toast('请输入评论内容');
			}

		})
	}
	/**
	 * 获取普通作业老师评论
	 * @param {Object} workInfo
	 */
var requireHomeworkResult = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_GetHomeworkResult({
			teacherId: personalUTID,
			studentId: workInfo.StudentId,
			classId: workInfo.ClassId,
			homeworkId: workInfo.HomeworkId
		}, wd, function(data) {
			wd.close();
			console.log('老师评价作业界面获取的作业信息：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				HomeworkResultId = data.RspData.HomeworkResultId;
				setHomeWorkInfo(jQuery.extend(workInfo, data.RspData))
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 
	 * @param {Object} workInfo
	 * "Comment":null,"Files":[],"HomeworkResultId":654,"IconUrl":null,
	 * "Result":"哦哦哦哦哦哦","StudentId":1,"StudentName":null,"UploadTime":"2016-12-17 11:08:43"
	 */
var setHomeWorkInfo = function() {
		document.getElementById('submit-time').innerText = workInfo.UploadTime;
		document.getElementById('result-text').innerText = workInfo.Result;
		var homeworkInfo = document.getElementById('homework-info');
		events.clearChild(homeworkInfo);
		var p = document.createElement('p')
		p.innerText = workInfo.Contents;
		homeworkInfo.appendChild(p);
		if(workInfo.IsCommented) {
			document.getElementById('comment-area').value = workInfo.Comment;
		} else {
			document.getElementById('comment-area').value = null;
		}
	}
	/**
	 * 获取临时作业老师评论
	 * @param {Object} workInfo
	 */
var requireAnswerResult = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_GetAnswerResult({
			teacherId: personalUTID,
			StudentId: workInfo.utid,
			classId: workInfo.gid,
			answerResultId: workInfo.AnswerResultId
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取的老师临时作业评价：' + JSON.stringify(data))
			if(data.RspCode == '0000') {
				data.RspData.stuFiles = data.RspData.Files;
				data.RspData.stuUploadTime = data.RspData.UploadTime;
				data.RspData.Files = null;
				data.RspData.UploadTime = null;
				jQuery.extend(workInfo, data.RspData);
			} else {
				console.log('未获取临时作业评价')
			}
			requireTeachersAnswer();
		})
	}
	/**
	 * "AnswerResultId":13,"IsCommented":"未评","QuestionResults":[],
	 * "StudentId":0,"ThumbUrl":"Upload/201612/thumb_2_20161216030533.png",
	 * "QuestionResultStr":"","gid":1,"gutid":133,"utid":4,"ugname":"rockan007",
	 * "ugnick":"rockan007","uimg":"http://o9u2jsxjm.bkt.clouddn.com/headimge4.png",
	 * "mstype":0,"workType":0,"Comment":null,"Files":null,"UploadTime":null,
	 * "stuFiles":["DisplayOrder":1,"ThumbUrl":"Upload/201612/thumb_2_20161216030533.png","Url":"Upload/201612/2_20161216030533.png"}],
	 * "stuUploadTime":"2016/12/16 15:10:54","TeacherId":1,"teaUploadTime":"2016/12/15 17:20:53",
	 * "teaFiles":["DisplayOrder":1,"ThumbUrl":"Upload/201612/thumb_1_20161215052053.png","Url":"Upload/201612/1_20161215052053.png"}]}
	 *	
	 */
var setAnswerInfo = function() {
	console.log('要放置的临时作业数据：' + JSON.stringify(workInfo));
	document.getElementById('submit-time').innerText = workInfo.stuUploadTime;
	var homeworkInfo = document.getElementById('homework-info');
	events.clearChild(homeworkInfo);
	ceateAnswerPinfo(homeworkInfo, 30);
	createAnswerImgs(homeworkInfo, workInfo.stuFiles);
	ceateAnswerPinfo(homeworkInfo, 2);
	createAnswerImgs(homeworkInfo, workInfo.teaFiles);
	if(workInfo.IsCommented) {
		document.getElementById('comment-area').value = workInfo.Comment;
	} else {
		document.getElementById('comment-area').value = null;
	}
	if(workInfo.QuestionResultStr) {
		document.getElementById('result-text').innerText = workInfo.QuestionResultStr;
	}
}
var ceateAnswerPinfo = function(homeworkInfo, type) {
	var p = document.createElement('p');
	if(type == 30) {
		p.innerText = '学生作业:';
	} else {
		p.innerText = '老师答案:';
	}
	homeworkInfo.appendChild(p);
}
var createAnswerImgs = function(homeworkInfo, imgs) {
		var div = document.createElement('div');
		var imgsInner = '';
		for(var i in imgs) {
			imgsInner += '<img class="answer-img" src="' + storageKeyName.MAINHOMEWORKURL + imgs[i].ThumbUrl + '"/>';
		}
		div.innerHTML = imgsInner;
		homeworkInfo.appendChild(div);
	}
	/**
	 * 获取老师的临时作业答案
	 * @param {Object} workInfo
	 * "AnswerResultId":21,"IsCommented":"未评","QuestionResults":[],"StudentId":4,
	 * "ThumbUrl":"Upload/201612/thumb_2_20161216041211.png","QuestionResultStr":"",
	 * "gid":1,"gutid":133,"utid":4,"ugname":"rockan007","ugnick":"rockan007",
	 * "uimg":"http://o9u2jsxjm.bkt.clouddn.com/headimge4.png","mstype":0,"workType":0}
	 */
var requireTeachersAnswer = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_GetAnswer({
			teacherId: personalUTID,
			answerResultId: workInfo.AnswerResultId
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取的老师临时作业答案：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				data.RspData.teaUploadTime = data.RspData.UploadTime;
				data.RspData.teaFiles = data.RspData.Files;
				data.RspData.UploadTime = null;
				data.RspData.Files = null;
				jQuery.extend(workInfo, data.RspData);
			} else {

			}
			setAnswerInfo(workInfo);
		})
	}
	/**
	 * 评论普通作业
	 */
var commentHomework = function(commentValue) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_CommentHomeworkResult({
			teacherId: personalUTID,
			studentId: workInfo.utid,
			classId: workInfo.gid,
			homeworkId: workInfo.HomeworkId,
			comment: commentValue
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取老师评价普通作业的结果:' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				mui.toast('评论成功！');
				events.fireToPageNone(plus.webview.currentWebview().opener().id,'workCommented')
				mui.back();
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 评论临时作业
	 */
var commentAnswer = function(commentValue) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_CommentAnswerResult({
			teacherId: personalUTID,
			studentId: workInfo.utid,
			classId: workInfo.gid,
			comment: commentValue,
			answerResultId: workInfo.AnswerResultId
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取的老师评论临时作业的结果：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				events.fireToPageNone(plus.webview.currentWebview().opener(),'workCommented')
				mui.toast('评论成功！');
				mui.back();
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 更改普通作业评论
	 */
var modifyHomeworkComment = function(commentValue) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_ModifyHomeworkResultComment({
			teacherId: personalUTID,
			homeworkResultId: workInfo.HomeworkResultId,
			studentId: workInfo.utid,
			classId: workInfo.gid,
			homeworkId: workInfo.HomeworkId,
			comment: commentValue
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取老师更改普通作业评论的结果：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				mui.toast('修改评论成功！')
				mui.back();
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 更改临时作业评论
	 */
var modifyAnswerComment = function(commentValue) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_ModifyAnswerResultComment({
		teacherId: personalUTID,
		answerResultId: workInfo.AnswerResultId,
		studentId: workInfo.utid,
		classId: workInfo.gid,
		comment: commentValue
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取老师更改的评论结果：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			mui.toast('修改评论成功！');
			mui.back();
		} else {
			mui.toast(data.RspTxt);
		}
	})
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