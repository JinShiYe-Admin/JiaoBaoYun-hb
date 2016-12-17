//学生查看老师作业评价
mui.init();
mui.plusReady(function() {
	events.addTap('modifyHomework',function(){
		events.fireToPageNone('doHomework-stu.html', 'workDetail', homeworkResult);
				plus.webview.getWebviewById("doHomework-stu.html").show();
	})
//	window.addEventListener('            ', function(e) {
//		var answerResultId = e.detail.data;
//	})
	window.addEventListener('workDetail', function(e) {
		resetData();

		homeworkModel = e.detail.data;
		console.log('学生查看作业结果界面：' + JSON.stringify(homeworkModel));
		if(homeworkModel.workType==0){
			document.getElementById("modifyHomework").hidden = 'hidden'
			document.getElementById("list").hidden = 'hidden';
//			getAnswerResultStu();
		}else{
			document.getElementById("list").hidden = '';
			requestGetHomeworkResultStu();
		}
		
		
	})
});

function resetData() {
	personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
};
//作业model
var homeworkModel = {};
var homeworkDetailNodes = {
	img: document.getElementById("img"), //作业类型图像
	title: document.getElementById("homeworkTitle"), //作业类型标题
	publishDate: document.getElementById("publishDate"), //发布日期
	content: document.getElementById("homeWorkContent"), //作业内容
	commentContent: document.getElementById("commentContent")
}
var imgType = {
		chineseImg: '../../image/homework/chinese.png',
		mathImg: '../../image/homework/math.png',
		biologyImg: '../../image/homework/biology.png',
		chemistryImg: '../../image/homework/chemistry.png',
		englishImg: '../../image/homework/english.png',
		otherImg: '../../image/homework/other.png',
		physicsImg: '../../image/homework/physics.png',
		politicalImg: '../../image/homework/political.png',
		historyImg: '../../image/homework/history.png',
		yuwenImg: '../../image/homework/yuwen.png',
		geographyImg: '../../image/homework/geography.png'
	}
	//个人UTID
	//作业结果model
var homeworkResult = {};
var personalUTID;

//3.获取作业结果和评价；学生
function requestGetHomeworkResultStu() {
	//所需参数
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkModel.gid, //班级群Id；
		homeworkId: homeworkModel.HomeworkId //作业id；
	};

	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//3.	获取作业结果和评价
	postDataPro_GetHomeworkResultStu(comData, wd, function(data) {
		
		wd.close();
		console.log('3.postDataPro_GetHomeworkResultStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
			refreshUI();
		} else {

		}
	});
	}
	//4.获取临时作业结果和评价；学生
function getAnswerResultStu() {
	//所需参数
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkModel.gid, //班级群Id；
		answerResultId: homeworkModel.AnswerResultId //作业id；
	};

	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//4.	获取临时作业结果和评价：学生
	postDataPro_GetAnswerResultStu(comData, wd, function(data) {
		
		wd.close();
		console.log('3.postDataPro_GetAnswerResultStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
			refreshUI();
		} else {

		}
	});
	}

	function refreshUI() {
		console.log(JSON.stringify(homeworkDetailNodes))
		switch(homeworkModel.Subject) {
			case '语文':
				homeworkDetailNodes.img.src = imgType.yuwenImg;
				break;
			case '数学':
				homeworkDetailNodes.img.src = imgType.mathImg;
				break;
			case '英语':
				homeworkDetailNodes.img.src = imgType.englishImg;
				break;
			case '历史':
				homeworkDetailNodes.img.src = imgType.historyImg;
				break;
			case '政治':
				homeworkDetailNodes.img.src = imgType.politicalImg;
				break;
			case '地理':
				homeworkDetailNodes.img.src = imgType.geographyImg;
				break;
			case '物理':
				homeworkDetailNodes.img.src = imgType.physicsImg;
				break;
			case '化学':
				homeworkDetailNodes.img.src = imgType.chemistryImg;
				break;
			case '生物':
				homeworkDetailNodes.img.src = imgType.biologyImg;
				break;
			default:
				break;
		}
		homeworkDetailNodes.title.innerText = homeworkModel.Subject;
		homeworkDetailNodes.publishDate.innerText = homeworkModel.HomeworkTitle;
		var HomeworkResult = homeworkResult.HomeworkResult.Result;
		if(!HomeworkResult){
			HomeworkResult = '作业内容';
		}
		homeworkDetailNodes.content.innerText = HomeworkResult;
		var Comment = homeworkResult.HomeworkResult.Comment;
		if(!Comment){
			Comment = '无评语';
			document.getElementById("modifyHomework").hidden = ''
			
		}else{
			document.getElementById("modifyHomework").hidden = 'hidden'
		}
		homeworkDetailNodes.commentContent.innerText = Comment;

	}
