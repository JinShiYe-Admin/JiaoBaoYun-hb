mui.init()
mui.plusReady(function() {
	window.addEventListener('workInfo', function(e) {
		var workInfo = e.detail.data;
		console.log('老师评价页面获取的作业信息：' + JSON.stringify(workInfo))
			//{"IconUrl":null,"IsCommented":false,"StudentId":1,"StudentName":null,
			//"ClassId":78,"HomeworkId":165,
			//"gid":78,"gutid":160,"utid":1,"ugname":"遥不可及","ugnick":"遥不可及",
			//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge1.png?1480991289388","mstype":3} at js/homework/homework-comment.js:5
		if(workInfo.workType == 0) {
			requireTeachersAnswer(workInfo);
		} else {
			requireHomeworkResult(workInfo);
		}
	})
})
var requireHomeworkResult = function(workInfo) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetHomeworkResult({
		teacherId: workInfo.utid,
		studentId: workInfo.StudentId,
		classId: workInfo.ClassId,
		homeworkId: workInfo.HomeworkId
	}, wd, function(data) {
		wd.close();
		console.log('老师评价作业界面获取的作业信息：' + JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var requireAnswerResult = function(workInfo) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswerResult({
		teacherId: 教师Id,
		StudentId: 班级群Id,
		classId: 班级群Id,
		answerResultId: 答案结果id
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业评价：'+JSON.stringify(data))
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var requireTeachersAnswer = function(workInfo) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: 教师Id,
		answerResultId: 学生上传答案id
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业答案：'+JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var commentHomework=function(){
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_CommentHomeworkResult({
		teacherId:教师Id,
		studentId:学生Id,
		classId:班级群Id,
		homeworkId:作业id,
		comment:评价
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业答案：'+JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var commentAnswer=function(){
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: 教师Id,
		answerResultId: 学生上传答案id
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业答案：'+JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var modifyHomeworkComment=function(){
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: 教师Id,
		answerResultId: 学生上传答案id
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业答案：'+JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
var modifyAnswerComment=function(){
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: 教师Id,
		answerResultId: 学生上传答案id
	}, wd, function(data) {
		wd.close();
		console.log('老师评价页面获取的老师临时作业答案：'+JSON.stringify(data));
		if(data.RspCode == '0000') {

		} else {

		}
	})
}
