/**
 * 作业记录界面逻辑
 */
var pageIndex = 1; //请求数据页面
var totalPageCount; //总页码
var personalUTID;
	events.initRefresh('list-container',function(){
		pageIndex=1;
		getHomeworkRecord();
	},function(){
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex >=totalPageCount);
		if(pageIndex<totalPageCount){
			pageIndex++;
			getHomeworkRecord();
		}
	})
mui.plusReady(function() {
	events.preload('homework-commented.html',300);
	getHomeworkRecord();
	window.addEventListener('changeInfo', function() {
		events.clearChild(document.getElementById('list-container'));
		pageIndex = 1;
		getHomeworkRecord();
	});
	mui('.mui-table-view').on('tap','.mui-table-view-cell',function(){
		events.fireToPage('homework-commented.html','commentedInfo',this.commentdInfo);
	})

})
var getHomeworkRecord = function() {
	personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetHomeworkRecord({
		studentId: personalUTID,
		pageIndex: pageIndex
	}, wd, function(data) {
		wd.close();
		console.log('作业记录界面获取的作业记录数据:' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			setHomeworkRecord(data.RspData.Dates);
		} else {
			console.log('没啦');
		}
	})
}
var setHomeworkRecord = function(list) {
	var listContainer = document.getElementById('list-container');
	for(var i in list) {
		createList(listContainer, list[i])
	}
}
var createList = function(listContainer, record) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-divider'
	li.innerText = record.Date;
	listContainer.appendChild(li);
	record.Homeworks.forEach(function(homework, i) {
		homework.personalUTID=personalUTID;
		var li0 = document.createElement('li');
		li0.commentedInfo=homework;
		li0.className = 'mui-table-view-cell '+getBackGround(homework);
		li0.innerHTML = createHomeworkInner(homework);
		listContainer.appendChild(li0);
	})
	record.AnswerResults.forEach(function(answerResult, i) {
		answerResult.personalUTID=personalUTID;
		var li0 = document.createElement('li');
		li0.className = 'mui-table-view-cell';
		li0.commentedInfo=answerResult;
		li0.innerHTML = createAnswerInner(answerResult);
		listContainer.appendChild(li0);
	})
}
var createHomeworkInner = function(homework) {
	return '<a><div class="stuHomework-header"><span class="mui-icon iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words"><h5 class="header-title">' +
		homework.HomeworkTitle + '</h5><p class="header-content">' + homework.Contents + '</p></div></div>' +
		'<div class="stuHomework-bottom"></div></a>';
}
//	“AnswerResultId”:1,       //答案id
//	“ThumbUrl”：”xxxx/xxxx.png”,       //缩略图url
//	“TeacherName”:”A”,       //提交给哪个老师
//	“UploadTime”：”2016-10-10 10:10:10”，       //提交时间
//	“IsCommented”：true       //是否已评论
var createAnswerInner = function(answer) {
	return '<a class="'+getBackGround(answer)+'"><span class="" src="'+answer.ThumberUrl+
	'"></span><div><h5>'+answer.TeacherName+'</h5><p>'+answer.UploadTime+'</p></div></a>';
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

			}
		}
	}
	return backClassName;
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