/**
 * 问题界面逻辑
 */
mui.init();
mui.plusReady(function() {
	//---滑动start---
	mui(".mui-scroll-wrapper").scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		indicators: true, //是否显示滚动条
		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
		bounce: true, //是否启用回弹
	});
	//---滑动end---

	window.addEventListener('askId', function(e) {
		console.log('问题详情页面获取的问题id:' + e.detail.data);
	});

	//加载刷新
	events.initRefresh("refreshContainer",
		function() { //刷新方法

		},
		function() { //加载更多

		}
	);

});

/**
 * 请求问题
 */

/**
 * 请求答案列表
 */

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
	document.getElementById("question_content").innerText = title;
}

/**
 * 放置问题浏览数，关注数
 * @param {Object} liulanshu 问题浏览数
 * @param {Object} guanzhushu 问题关注数
 */
function questionInfo(liulanshu, guanzhushu) {
	document.getElementById("liulanshu").innerText = liulanshu;
	document.getElementById("guanzhushu").innerText = guanzhushu;
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
	//排序类型
	document.getElementById("ordertype").innerText = '按质量排序';
	document.getElementById("ordertype_2_icon").style.display = 'inline';
	document.getElementById("ordertype_1_icon").style.display = 'inline';
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

/**
 * 各种监听事件
 */
var setListener = function() {

}