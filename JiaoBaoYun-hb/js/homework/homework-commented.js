//学生查看老师作业评价
mui.init();
mui.plusReady(function() {
	window.addEventListener('checkResult', function(e) {
		var answerResultId = e.detail.data;
	})
	window.addEventListener('workDetail', function(e) {
		homeworkModel = e.detail.data;
		console.log('学生查看作业结果界面：' + JSON.stringify(homeworkModel));
	})
});

//作业model
var homeworkModel = {};
//个人UTID
var personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
//作业结果model
var homeworkResult = {};

//3.获取作业结果和评价；学生
function requestGetHomeworkResultStu(comData) {
	//所需参数
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkModel.gid, //班级群Id；
		homeworkId: homeworkModel.HomeworkId //作业id；
	};
	//3.	获取作业结果和评价
	postDataPro_GetHomeworkResult(comData, wd, function(data) {
		wd.close();
		console.log('3.postDataPro_GetHomeworkResult:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
		} else {
			
		}
	});
}