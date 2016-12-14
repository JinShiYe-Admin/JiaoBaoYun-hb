mui.init();
mui.plusReady(function() {
	window.addEventListener('workDetail', function(e) {
		var honmeworkInfo= e.detail.data;
		console.log('学生作业详情获取的数据：' + JSON.stringify(honmeworkInfo));
	})
});
var requestTeaInfo=function(teaId){
	var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUuinf({vvl:teaId},wd,function(data){
		wd.close();
		console.log('学生作业详情界面获取老师资料信息：'+JSON.stringify(data));
		if(data.RspCode='0000'){
			
		}else{
			
		}
	})
}
var setContentView = function(honmeworkInfo) {
	
}

//2.	获取教师发布作业详情，不包括学生提交的答案；
function requestHomeworkDetail(honmeworkInfo) {
	var comData = {
		studentId: '', //学生Id
		classId: '', //班级群Id；
		homeworkId: '' //作业id；
	};
	var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetHomeworkStu(comData,wd,function(data){
		wd.close();
	})
}
var setHomworkDetail=function(workDetail){
	
}
