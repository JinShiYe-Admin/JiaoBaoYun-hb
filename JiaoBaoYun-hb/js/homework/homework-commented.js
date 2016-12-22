//学生查看老师作业评价
mui.init();
mui.plusReady(function() {
	events.addTap('modifyHomework', function() {
			if(homeworkModel.workType == 0) {
				var modifyAnswerData = mui.extend(homeworkResult, {
					role: 30
				}, homeworkModel)
				console.log(JSON.stringify(modifyAnswerData));
				events.fireToPageWithData('publish-answer.html', 'modifyAnswer', modifyAnswerData)

			} else {
				events.fireToPageNone('doHomework-stu.html', 'workDetail', homeworkResult);
				plus.webview.getWebviewById("doHomework-stu.html").show();
			}

		})
	window.addEventListener('workDetail', function(e) {
		homeworkModel = e.detail.data;
		resetData();
		console.log('学生查看作业结果界面：' + JSON.stringify(homeworkModel));
		if(homeworkModel.workType == 0) {
			document.getElementById("modifyHomework").hidden = 'hidden'
				//			document.getElementById("list").hidden = 'hidden';
			getAnswerResultStu();
		} else {
			document.getElementById("list").hidden = '';
			requestGetHomeworkResultStu();
		}
		getStuName();

	})
});

function resetData() {
		personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;

	var tempNodes = mui('.tempComment');
	homeworkResult = {};
	for(var i = 0; i < tempNodes.length; i++) {
		homeworkDetailNodes.list.removeChild(tempNodes[i]);
	}

	if(homeworkModel.workType==0){
		console.log('临时作业')
	      homeworkDetailNodes.stuHomework.hidden = 'hidden';
	      homeworkDetailNodes.stuCell.hidden = 'hidden';
	      homeworkDetailNodes.hr.hidden = 'hidden';
	}else{
		console.log('普通作业')
		homeworkDetailNodes.stuHomework.hidden = '';
		homeworkDetailNodes.stuCell.hidden = '';
		homeworkDetailNodes.hr.hidden = '';

	}

};
//作业model
var homeworkModel = {};
var homeworkDetailNodes = {
	img: document.getElementById("img"), //作业类型图像
	title: document.getElementById("homeworkTitle"), //作业类型标题
	publishDate: document.getElementById("publishDate"), //发布日期
	content: document.getElementById("homeWorkContent"), //作业内容
	commentContent: document.getElementById("commentContent"),
	list: document.getElementById("list"), //列表
	comment: document.getElementById("comment"), //评语
	tempComment: document.getElementsByClassName('tempComment'),
	stuHomework: document.getElementById('stuHomework'),//学生临时作业用到的节点元素
	stuResult: document.getElementById('stuResult'),
	stuCell:document.getElementById('stuCell'),
	hr:document.getElementById('hr'),
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

function getStuName() {
	var tempData = {
		top: '-1', //选择条数
		vvl: homeworkModel.gid, //群ID，查询的值
		vvl1: '-1' //群员类型，0家长,1管理员,2老师,3学生,-1取全部
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//13.通过群ID获取群的正常用户
	postDataPro_PostGusers(tempData, wd, function(data) {
		wd.close();
		console.log('13.postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//循环当前的个人信息返回值数组
			for(var i in data.RspData) {
				//当前model
				var tempModel = data.RspData[i];
				//更新头像
				tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
				if(personalUTID == tempModel.utid) {
					console.log()
					homeworkModel = mui.extend(homeworkModel, tempModel);
				}
			}
		}

	});
}
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
		console.log('4.postDataPro_GetAnswerResultStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
			requireTeachersAnswer();
			//			refreshUI();
		} else {

		}
	});
}
var requireTeachersAnswer = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: homeworkResult.teacherId,
		answerResultId: homeworkModel.AnswerResultId
	}, wd, function(data) {
		wd.close();
		console.log('学生作业页面获取的临时作业答案：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			mui.extend(homeworkResult, data.RspData);
			refreshUITemp();
		} else {

		}
	})
}

function refreshUITemp() {

	homeworkDetailNodes.title.innerText = homeworkModel.ugnick;
	homeworkDetailNodes.publishDate.innerText = '';
	homeworkDetailNodes.img.src = homeworkModel.uimg;
	var TeaAnsLi = document.createElement('li');
	TeaAnsLi.className = 'mui-table-view-divider tempComment';
	TeaAnsLi.innerHTML = '老师答案';
	var TeaAnsImgLi = document.createElement('li');
	//老师答案图片
	TeaAnsImgLi.className = 'mui-table-view-cell mui-media  tempComment';
	TeaAnsImgLi.innerHTML = ''
	for(var i = 0; i < homeworkResult.Files.length; i++) {
		var img = storageKeyName.MAINHOMEWORKURL + homeworkResult.Files[i].ThumbUrl;
		TeaAnsImgLi.innerHTML = TeaAnsImgLi.innerHTML + '<img class="mui-media-object mui-pull-left" src="' + img + '" />';

	}
	var stuAnsLi = document.createElement('li');
	stuAnsLi.className = 'mui-table-view-divider tempComment';
	stuAnsLi.innerHTML = '学生作业';
	//学生答案图片
	var stuAnsImgLi = document.createElement('li');
	stuAnsImgLi.className = 'mui-table-view-cell mui-media  tempComment';
	stuAnsImgLi.innerHTML = ''
	for(var i = 0; i < homeworkResult.File.length; i++) {
		var img = storageKeyName.MAINHOMEWORKURL + homeworkResult.File[i].ThumbUrl;
		stuAnsImgLi.innerHTML = stuAnsImgLi.innerHTML + '<img class="mui-media-object mui-pull-left" src="' + img + '" />';

	}
	var compareResLi = document.createElement('li');
	compareResLi.className = 'mui-table-view-divider tempComment';
	compareResLi.innerHTML = '对比结果';
	var ResLi = document.createElement('li');
	ResLi.className = 'mui-table-view-cell mui-media  tempComment';
	ResLi.innerHTML = '暂无对比结果'
	homeworkDetailNodes.list.insertBefore(TeaAnsLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(TeaAnsImgLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(stuAnsLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(stuAnsImgLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(compareResLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(ResLi, homeworkDetailNodes.stuHomework);

	var Comment = homeworkResult.Comment;
	if(!Comment) {
		Comment = '无评语';
		document.getElementById("modifyHomework").hidden = ''

	} else {
		document.getElementById("modifyHomework").hidden = 'hidden'
	}
	homeworkDetailNodes.commentContent.innerText = Comment;

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
	var HomeworkContents = homeworkResult.Homework.Contents;
	if(!HomeworkContents) {
		HomeworkContents = '作业内容';
	}
	homeworkDetailNodes.content.innerText = HomeworkContents;
	console.log(homeworkResult.HomeworkResult.Result)
	homeworkDetailNodes.stuResult.innerText = homeworkResult.HomeworkResult.Result;
	var Comment = homeworkResult.HomeworkResult.Comment;
	if(!Comment) {
		Comment = '无评语';
		document.getElementById("modifyHomework").hidden = ''

	} else {
		document.getElementById("modifyHomework").hidden = 'hidden'
	}
	homeworkDetailNodes.commentContent.innerText = Comment;

}