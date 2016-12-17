var workInfo;
var personalUTID;
mui.init()
mui.plusReady(function() {
	window.addEventListener('workInfo', function(e) {
	 	workInfo = e.detail.data;
		console.log('老师评价页面获取的作业信息：' + JSON.stringify(workInfo))
		personalUTID=myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		setStuInfo(workInfo);
		//{"IconUrl":null,"IsCommented":false,"StudentId":1,"StudentName":null,
		//"ClassId":78,"HomeworkId":165,
		//"gid":78,"gutid":160,"utid":1,"ugname":"遥不可及","ugnick":"遥不可及",
		//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge1.png?1480991289388","mstype":3} at js/homework/homework-comment.js:5
		if(workInfo.workType && workInfo.workType == 0) {
			requireAnswerResult(workInfo);
		} else {
			requireHomeworkResult(workInfo);
		}
	})
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
				HomeworkResultId=data.RspData.HomeworkResultId;
				setHomeWorkInfo(jQuery.extend(workInfo,data.RspData))
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
		document.getElementById('submit-time').innerText=workInfo.UploadTime;
		document.getElementById('result-text').innerText=workInfo.Result;
		var homeworkInfo=document.getElementById('homework-info');
		events.clearChild(homeworkInfo);
		var p=document.createElement('p')
		p.innerText=workInfo.Contents;
		if(workInfo.IsCommented){
			document.getElementById('comment-area').value=workInfo.Comment;
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
			classId:  workInfo.gid,
			answerResultId: workInfo.AnswerResultId
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取的老师临时作业评价：' + JSON.stringify(data))
			if(data.RspCode == '0000') {
				data.RspData.stuFiles=data.RspData.Files;
				data.RspData.stuUploadTime=data.RspData.UploadTime;
				data.RspData.Files=null;
				data.RspData.UploadTime=null;
				jQuery.extend(workInfo,data.RspData);
				requireTeachersAnswer(workInfo)
			} else {
				
			}
		})
	}
var setAnswerInfo=function(){
	console.log('要放置的临时作业数据：'+JSON.stringify(workInfo));
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
				data.RspData.teaUploadTime=data.RspData.UploadTime;
				data.RspData.teaFiles=data.RspData.Files;
				data.RspData.UploadTime=null;
				data.RspData.Files=null;
				jQuery.extend(workInfo,data.RspData);
			} else {

			}
			setAnswerInfo(workInfo);
		})
	}
	/**
	 * 评论普通作业
	 */
var commentHomework = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_CommentHomeworkResult({
			teacherId: 教师Id,
			studentId: 学生Id,
			classId: 班级群Id,
			homeworkId: 作业id,
			comment: 评价
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取老师评价普通作业的结果:' + JSON.stringify(data));
			if(data.RspCode == '0000') {

			} else {

			}
		})
	}
	/**
	 * 评论临时作业
	 */
var commentAnswer = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_CommentAnswerResult({
			teacherId: 教师Id,
			studentId: 学生Id,
			classId: 班级群Id,
			comment: 评价,
			answerResultId: 答案结果Id
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取的老师评论临时作业的结果：' + JSON.stringify(data));
			if(data.RspCode == '0000') {

			} else {

			}
		})
	}
	/**
	 * 更改普通作业评论
	 */
var modifyHomeworkComment = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_ModifyHomeworkResultComment({
			teacherId: 教师Id,
			homeworkResultId: 要修改的作业评价id,
			studentId: 学生Id,
			classId: 班级群Id,
			homeworkId: 作业id,
			comment: 评价
		}, wd, function(data) {
			wd.close();
			console.log('老师评价页面获取老师更改普通作业评论的结果：' + JSON.stringify(data));
			if(data.RspCode == '0000') {

			} else {

			}
		})
	}
	/**
	 * 更改临时作业评论
	 */
var modifyAnswerComment = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_ModifyAnswerResultComment({
		teacherId: 教师Id,
		answerResultId: 要修改的答案评价的id,
		studentId: 学生Id,
		classId: 班级群Id,
		comment: 评价
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取老师更改的评论结果：' + JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

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