var personalUTID;
var homeworkInfo;
mui.init();
mui.plusReady(function() {
	events.preload('doHomework-stu.html',200);
	window.addEventListener('workDetail', function(e) {
		homeworkInfo= e.detail.data;
		if(homeworkInfo.SubmitOnline){
			document.getElementById('btn-startWork').style.display='inline-block';
		}else{
			document.getElementById('btn-startWork').style.display='none'
		}
		console.log('学生作业详情获取的数据：' + JSON.stringify(homeworkInfo));
		requestTeaInfo(homeworkInfo.TeacherId,homeworkInfo);
	})
	//开始答题的监听
	events.addTap('btn-startWork',function(){
		events.fireToPageWithData('doHomework-stu.html','homeworkInfo',homeworkInfo);
	})
});
var requestTeaInfo=function(teaId){
	var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf ({vvl:teaId,vtp:'p'},wd,function(data){
		wd.close();
		console.log('学生作业详情界面获取老师信息：'+JSON.stringify(data));
		if(data.RspCode='0000'){
			jQuery.extend(homeworkInfo,data.RspData[0]);
			setContentView();
		}else{
			mui.toast(data.RspTxt);
		}
	})
}
var setContentView = function() {
	console.log('学生作业详情界面获取老师后的信息：'+JSON.stringify(homeworkInfo));
	document.querySelector('.subject-icon').className="subject-icon iconfont "+getHomeworkIcon(homeworkInfo.Subject);
	document.querySelector('.brief-title').innerText=homeworkInfo.HomeworkTitle;
	document.querySelector('.brief-content').innerText=homeworkInfo.Contents;
	document.querySelector('.publisher').innerText="发布人:"+homeworkInfo.unick;
	document.querySelector('.publish-date').innerText="发布时间:"+homeworkInfo.Date.split(' ')[0];
}

//2.	获取教师发布作业详情，不包括学生提交的答案；
function requestHomeworkDetail() {
	personalUTID=myStorage.getItems(storageKeyName.PERSONALINFO);
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkInfo.gid, //班级群Id；
		homeworkId: homeworkInfo.HomeworkId //作业id；
	};
	var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetHomeworkStu(comData,wd,function(data){
		console.log('学生作业详情获取的作业详情：'+JSON.stringify(data));
		wd.close();
		if(data.RspCode=='0000'){
			setHomworkDetail(data.RspData);
		}else{
			mui.toast(data.RspTxt);
		}
	})
}
var setHomworkDetail=function(workDetail){
	
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