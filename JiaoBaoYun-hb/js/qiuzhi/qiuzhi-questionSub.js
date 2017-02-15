/**
 * 问题界面逻辑
 */
mui.init({
	pullRefresh: {
		container: '#refreshContainer',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	},
	gestureConfig: {
		tap: true,
		hold: true,
		release: true
	}

});

//问题id
var askID = 0;
//取数据的默认排序
var askOrderType = 2;
//获取的第几页回复
var answerIndex = 1;
//答案回复的总页数
var answerPageCount = 0;
//回复数组,切换排序方式后，清空数组
var answerArray = [];
//刷新0，还是加载更多1
var answerFlag = 0;
//当前问题的详情model
var askModel;

mui.plusReady(function() {
	//---滑动start---
	//	mui(".mui-scroll-wrapper").scroll({
	//		scrollY: true, //是否竖向滚动
	//		scrollX: false, //是否横向滚动
	//		indicators: true, //是否显示滚动条
	//		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
	//		bounce: true, //是否启用回弹
	//	});
	//---滑动end---
events.preload('qiuzhi-addAnswer.html');
	window.addEventListener('askId', function(e) {
		console.log('问题详情子页面获取的问题id:' + e.detail.data);
		askID = e.detail.data;
		//5.获取某个问题的详情
		requestAskDetail();
	});

	mui('#popover').on('tap', '.mui-table-view-cell', function() {
		console.log('选择排序' + this.id + '|' + this.value + '|' + this.getAttribute('data-value'));

		if(askOrderType != this.value) {
			var ordertype = document.getElementById("ordertype").innerText = this.getAttribute('data-value');
			document.getElementById("ordertype_" + askOrderType + "_icon").style.display = 'none';
			document.getElementById("ordertype_" + this.value + "_icon").style.display = 'inline';
			askOrderType = this.value;
			//获取的第几页回复
			answerIndex = 1;
			//答案回复的总页数
			answerPageCount = 0;
			//回复数组,切换排序方式后，清空数组
			answerArray = [];
			//刷新0，还是加载更多1
			answerFlag = 0;
			//5.获取某个问题的详情
			requestAskDetail();
		}
		mui('#popover').popover('hide');
	});

	//---点击效果---start---
	var tab_div = document.getElementById("tab_div");
	var tab_font = document.getElementById("tab_font");
	tab_div.addEventListener('tap', function() {
		console.log('tab_div-tap');
		tab_div.style.background = '#DDDDDD';
		tab_font.style.color = 'white';
		setTimeout(function() {
			tab_div.style.background = 'white';
			tab_font.style.color = 'gray';
		}, 80);
		//点击跳转到回答界面
		
		events.fireToPage('qiuzhi-addAnswer.html', 'qiuzhi-addAnswer', function() {
			return askModel;
		});

	});
	tab_div.addEventListener('hold', function() {
		console.log('tab_div-hold');
		tab_div.style.background = '#DDDDDD';
		tab_font.style.color = 'white';
	});
	tab_div.addEventListener('release', function() {
		console.log('tab_div-release');
		tab_div.style.background = 'white';
		tab_font.style.color = 'gray';
	});
	//---点击效果---end---

});

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		//获取的第几页回复
		answerIndex = 1;
		//答案回复的总页数
		answerPageCount = 0;
		//回复数组,切换排序方式后，清空数组
		answerArray = [];
		//刷新0，还是加载更多1
		answerFlag = 0;
		//5.获取某个问题的详情
		requestAskDetail();
	}, 1500);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		answerFlag = 1;
		//判断是否还有更多
		if(answerIndex <= answerPageCount) {
			//5.获取某个问题的详情
			requestAskDetail();
		} else {
			mui('#refreshContainer').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
		}
	}, 1500);
}

/**
 * 请求问题
 */
//5.获取某个问题的详情
function requestAskDetail() {
	//所需参数
	var comData = {
		askId: askID, //问题ID
		orderType: askOrderType, //回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
		pageIndex: answerIndex, //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//5.获取某个问题的详情
	postDataQZPro_getAskById(comData, wd, function(data) {
		wd.close();
		console.log('5.获取某个问题的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			askModel = data.RspData;
			answerPageCount = data.RspData.TotalPage; //回答总页数
			answerIndex++;
			//刷新0，还是加载更多1
			if(answerFlag == 0) {
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //下拉刷新结束
				mui('#refreshContainer').pullRefresh().enablePullupToRefresh(); //启用上拉刷新
				answerArray = data.RspData.Data;
				//清理原界面
				cleanQuestion();
				cleanAnswer();
				//生成新界面
				addQuestion(data.RspData);
				if(data.RspData.Data.length == 0) { //没有人回答
					mui.toast('没有人回答该提问');
					mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
				}
			} else {
				answerArray = answerArray.concat(data.RspData.Data);
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
			}
			//刷新界面
			addAnswer(data.RspData.Data);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

/**
 *清空问题的所有信息，和回答数
 */
function cleanQuestion() {
	document.getElementById("question_title").innerHTML = '';
	document.getElementById("question_images").innerHTML = '';
	document.getElementById("question_content").innerHTML = '';
	document.getElementById("liulanshu").innerHTML = '';
	document.getElementById("guanzhushu").innerHTML = '';
	//回答数
	document.getElementById("answershu").innerText = '';
}

/**
 * 放置问题，和回答数
 */
function addQuestion(data) {
	console.log('addQuestion:' + JSON.stringify(data));
	questionTitle(data.AskTitle);
	//questionImages(data.imageArray);
	questionContent(data.AskNote);
	questionInfo(data.ReadNum, data.FocusNum);
	answerShu(data.AnswerNum);
}

/**
 * 放置问题标题
 * @param {Object} title 问题标题
 */
function questionTitle(title) {
	document.getElementById("question_title").innerText = title;
}

/**
 * 放置问题图片
 * @param {Object} imageArray 问题图片数组
 */
function questionImages(imageArray) {
	mui.each(imageArray, function(index, element) {
		var div = document.createElement('div');
		div.className = 'mui-col-xs-4 mui-col-sm-4';
		div.innerHTML = '<img class="mui-pull-right" style="width: 30%;" src="' + element + '"';
		document.getElementById("question_images").appendChild(div);
	});
}

/**
 * 放置问题内容
 * @param {Object} content 问题内容
 */
function questionContent(content) {
	document.getElementById("question_content").innerText = content;
}

/**
 * 放置问题浏览数，关注数
 * @param {Object} liulanshu 问题浏览数
 * @param {Object} guanzhushu 问题关注数
 */
function questionInfo(liulanshu, guanzhushu) {
	document.getElementById("liulanshu").innerHTML = '&nbsp;' + liulanshu;
	document.getElementById("guanzhushu").innerHTML = '&nbsp;' + guanzhushu;
}

/**
 * 放置回答数
 * @param {Object} answershu 回答数
 */
function answerShu(answershu) {
	document.getElementById("answershu").innerText = answershu + '个回答';
}

/**
 * 清空回答列表,重置排序
 */
function cleanAnswer() {
	//回答列表
	document.getElementById("answer_bottom").innerHTML = '';
	//	//排序类型
	//	document.getElementById("ordertype").innerText = '按质量排序';
	//	document.getElementById("ordertype_2_icon").style.display = 'inline';
	//	document.getElementById("ordertype_1_icon").style.display = 'none';
}

/**
 * 放置问题列表
 * @param {Object} data 回答数组
 */
function addAnswer(data) {
	mui.each(data, function(index, element) {
		answerList(element);
	});
}

/**
 * 放置回答列表的一项
 * @param {Object} answershu 一个回答的数据
 */
function answerList(data) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell mui-media';
	li.id = 'answer_' + data.AnswerId;
	li.innerHTML = '' +
		'<img class="mui-media-object mui-pull-left" src="' + updateHeadImg('', 2) + '">' +
		'<div class="mui-ellipsis">' + data.AnswerMan + '</div>' +
		'<div id="answer_content_' + data.AnswerId + '" class="ellipsis-3"></div>' +
		'<div class="answer-info">' + data.IsLikeNum + '赞同·' + data.CommentNum + '评论·' + data.AnswerTime + '</div>';
	document.getElementById("answer_bottom").appendChild(li);
	document.getElementById("answer_content_" + data.AnswerId).innerText = data.AnswerContent;
}