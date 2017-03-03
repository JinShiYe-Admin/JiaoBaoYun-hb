var type = 2; //排列顺序类型
var pageIndex = 1; //当前页码
var totalPageCount = 1; //总页数
var answerInfo; //回答详情
var answerData; //答案数据
var selfId;
/**
 * 加载刷新
 */
events.initRefresh('list-container', function() {
	pageIndex=1;
	requestAnswerDetail(answerInfo.AnswerId);
}, function() {
	mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex >= totalPageCount);
	if(pageIndex < totalPageCount) {
		pageIndex++;
		requestAnswerDetail(answerInfo.AnswerId);
	}
})

/**
 * 
 */
mui.plusReady(function() {
	mui.previewImage();
	events.preload('qiuzhi-addAnswer.html');
	//加载监听
	window.addEventListener('answerInfo', function(e) {
		selfId=parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid);
		mui('#refreshContainer').pullRefresh().refresh(true);
		answerData = {};
		pageIndex = 1;
		totalPageCount = 1;
		answerInfo = e.detail.data;
		document.getElementById('reverse-order').selected = true;
		type = 2;
		console.log('回答详情获取的答案信息:' + JSON.stringify(answerInfo));
		var answerId = answerInfo.AnswerId;
		events.clearChild(document.getElementById('list-container'));
		requestAnswerDetail(answerId);
	});
	window.addEventListener('commentAdded', function() {
		selfId=parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid);
		mui('#refreshContainer').pullRefresh().refresh(true);
		answerData = {};
		pageIndex = 1;
		totalPageCount = 0
		document.getElementById('reverse-order').selected = true;
		type = 2;
		console.log('回答详情获取的答案信息:' + JSON.stringify(answerInfo));
		var answerId = answerInfo.AnswerId;
		events.clearChild(document.getElementById('list-container'));
		requestAnswerDetail(answerId);
	})
	setListeners();

	//点击关注按钮
	//	mui('.mui-table-view').on('tap', '#focusBtn', function() {
	//		if(this.innerText == '关注') {
	//			setUserFocus(answerInfo.AnswerMan, 1, this);
	//		} else {
	//			setUserFocus(answerInfo.AnswerMan, 0, this);
	//		}
	//	})
	//	events.addTap('focusBtn', function() {
	//		console.log('点击关注');
	//		if(this.innerText == '关注') {
	//			setUserFocus(answerInfo.AnswerMan, 1);
	//		} else {
	//			setUserFocus(answerInfo.AnswerMan, 0);
	//		}
	//	});
})
//8.获取某个回答的详情
function requestAnswerDetail(answerId) {
	//所需参数
	var comData = {
		userId:selfId,
		answerId: answerId, //回答ID
		orderType: type, //评论排序方式,1 时间正序排序,2 时间倒序排序
		pageIndex: pageIndex, //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//8.获取某个回答的详情
	postDataQZPro_getAnswerById(comData, wd, function(data) {
		wd.close();
		console.log('8.获取某个回答的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var datasource = data.RspData;
			totalPageCount = datasource.TotalPage;
			getInfos(datasource);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 获取个人信息
 * @param {Object} datasource
 */
var getInfos = function(datasource) {
	var pInfos = [];
	pInfos.push(datasource.AnswerMan);
	for(var i in datasource.Data) {
		var theComment = datasource.Data[i];
		if(theComment.UserId) {
			pInfos.push(theComment.UserId);
		}
		if(theComment.ReplyId) {
			pInfos.push(theComment.ReplyId);
		}
	}
	pInfos = events.arraySingleItem(pInfos);
	requireInfos(datasource, pInfos);
}
/**
 * 
 * @param {Object} datasource
 * @param {Object} pInfos
 */
var requireInfos = function(datasource, pInfos) {

	//发送获取用户资料申请
	var tempData = {
		vvl: pInfos.toString(), //用户id，查询的值,p传个人ID,g传ID串
		vtp: 'g' //查询类型,p(个人)g(id串)
	}
	//21.通过用户ID获取用户资料
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf(tempData, wd, function(data) {
		wd.close();
		console.log('获取的个人信息:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			refreshUI(rechargeInfos(datasource, data.RspData));
		} else {

		}
	})

}
/**
 * 重组数据
 * @param {Object} datasource
 * @param {Object} infos
 */
var rechargeInfos = function(datasource, infos) {
	for(var j in infos) {
		var info = infos[j];
		if(datasource.AnswerMan == info.utid) {
			jQuery.extend(datasource, info);
			break;
		}
	}
	for(var i in datasource.Data) {
		//		var theComment=datasource.Data[i];
		for(var j in infos) {
			var info = infos[j];
			if(datasource.Data[i].UserId == info.utid) {
				datasource.Data[i].UserName = info.unick;
				datasource.Data[i].UserImg = updateHeadImg(info.uimg,2);
			}
			if(datasource.Data[i].ReplyId == info.utid) {
				datasource.Data[i].ReplyName = info.unick;
				datasource.Data[i].ReplyImg = updateHeadImg(info.uimg,2);
			}
		}
	}
	if(pageIndex == 1) {
		answerData = datasource;
	} else {
		answerData.Data = answerData.Data.concat(datasource.Data);
	}
	return datasource;
}

//22.获取是否已对某个用户关注
function getUserFocus(userId) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//需要加密的数据
	var comData = {
		userId: personalUTID, //用户ID
		focusUserId: userId //关注用户ID
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//22.获取是否已对某个用户关注
	postDataQZPro_getUserFocusByUser(comData, wd, function(data) {
		wd.close();
		console.log('22.获取是否已对某个用户关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var btn_focus = document.getElementById('btn-focus')
			//修改界面显示
			if(data.RspData.Result) {
				btn_focus.innerText = '已关注';
				btn_focus.isLike = 1;
			} else {
				btn_focus.innerText = '关注';
				btn_focus.isLike = 0;
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

//23.设置对某个用户的关注
function setUserFocus(userId, item) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//需要加密的数据
	var comData = {
		userId: selfId, //用户ID
		focusUserId: userId, //关注用户ID
		status: item.isLike ? 0 : 1 //关注状态,0 不关注,1 关注
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//23.设置对某个用户的关注
	postDataQZPro_setUserFocus(comData, wd, function(data) {
		wd.close();
		console.log('23.设置对某个用户的关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//刷新界面显示
			if(item.isLike) {
				item.innerText = '关注';
				mui.toast('取消关注成功！');
				item.isLike = 0;
			} else {
				item.innerText = '已关注';
				mui.toast('关注成功！')
				item.isLike = 1;
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
};
/**
 * 刷新界面
 * @param {Object} datasource
 */
function refreshUI(datasource) {
	console.log('重组后的答案详情信息：' + JSON.stringify(datasource));
	if(pageIndex == 1) {
		setQuestion(datasource);
		setAnswerManInfo(datasource);
	}
	var ul = document.getElementById('list-container');
	for(var i in datasource.Data) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = createCommentsInner(datasource.Data[i]);
		ul.appendChild(li);
		var comments_zan=li.querySelector('.icon-support');
		comments_zan.isLike=datasource.Data[i].IsLiked;
		comments_zan.commentId=datasource.Data[i].TabId;
		if(datasource.Data[i].IsLiked){
			comments_zan.className="mui-icon iconfont icon-support mui-pull-right isLike"
		}else{
			comments_zan.className="mui-icon iconfont icon-support mui-pull-right isNotLike"
		}
		comments_zan.order=i;
	}
}
/**
 * 设置问题内容
 * @param {Object} datasource
 */
var setQuestion = function(datasource) {
	document.querySelector('.question-title').innerText = datasource.AskTitle;
	var questionContainer = document.getElementById('question-content');
	events.clearChild(questionContainer);
	var p = document.createElement('p');
	p.innerHTML = datasource.AnswerContent;
	questionContainer.appendChild(p);
	events.clearChild(document.getElementById('answer-imgs'));
	if(datasource.AnswerEncAddr) {
		document.getElementById('answer-imgs').innerHTML = getPicInner(datasource.AnswerEncAddr);
	}
	document.getElementById('comments-no').innerText = "评论(" + datasource.CommentNum + ")";
	var zan_icon=document.getElementById('answer-zan');
	zan_icon.isLike=datasource.IsLiked;
	if(datasource.IsLiked){
		zan_icon.className="mui-icon iconfont icon-support isLike";
	}else{
		zan_icon.className="mui-icon iconfont icon-support isNotLike";
	}	
}
/**
 * 设置回答人信息
 * @param {Object} datasource
 */
var setAnswerManInfo = function(datasource) {
	document.getElementById('anthor-container').style.top = document.getElementById('question-container').offsetHeight - 30 + 'px';
	if(datasource.IsAnonym) {
		document.getElementById('anthor-portrait').src = "../../image/utils/default_personalimage.png";
		document.getElementById("anthor-name").innerText = "匿名用户";
		document.getElementById("anthor-info").innerText = "隐藏简介";
		document.getElementById('btn-focus').style.display = 'none';
	} else {
		document.getElementById('anthor-portrait').src = updateHeadImg(datasource.uimg, 2);
		document.getElementById("anthor-name").innerText = datasource.unick;
		document.getElementById("anthor-info").innerText = datasource.AnswerManNote ? datasource.AnswerManNote : "暂无简介";
		if(datasource.AnswerMan==selfId){//如果专家是自己，隐藏关注按钮
			document.getElementById('btn-focus').style.display = "none";
		}else{//不是自己，显示关注按钮
			document.getElementById('btn-focus').style.display = "inline-block";
			getUserFocus(datasource.AnswerMan);
		}
	}
	document.getElementById('answer-time').innerText = events.shortForDate(datasource.AnswerTime);
}
/**
 * 根据图片数量，设置不同宽高的图片尺寸
 * @param {Object} picAddr
 */
var getPicInner = function(picAddr) {
	var picPaths = picAddr.split('|');
	var picInner = '';
	var win_width=document.getElementById('answer-imgs').offsetWidth;
	var pic_width =win_width/3;
	for(var i in picPaths) {
		if(picPaths.length < 3) {
			pic_width = win_width / picPaths.length;
		}
		picInner += '<img src=' + picPaths[i] + 'style="width:' + pic_width + 'px;height:"'+pic_width+'px" '+
		'" data-preview-src="' + picPaths[i] + '" data-preview-group="1"/>';
	}
	return picInner;
}
/**
 * 
 * @param {Object} cell
 * TabId	评论ID	int		否	从属Comments
 * UserId	评论用户ID	int		否	从属Comments
 * ReplyId	回复用户ID	int		否	从属Comments
 * CommentContent	评论或回复内容	String		否	从属Comments
 * CommentDate	评论或回复时间	String		否	从属Comments
 * UpperId	上级ID	int		否	从属Comments
 * Replys	下级回复列表	Array		否	从属Comments
 */
var createCommentsInner = function(cell) {
	var headImg = cell.UserImg ? cell.UserImg : cell.ReplyImg;
	var personName = cell.UserName ? cell.UserName : cell.ReplyName;
	var inner = '<div><div class="support-container"> <a class="mui-icon iconfont icon-support mui-pull-right"></a><div>' +
		'<div class="img-container"><img class="head-img" src="' + headImg + '"/></div>' +
		'<div class="comment-container">' +
		'<h5 class="comment-personName single-line">' + personName + '</h5>' +
		'<p class="comment-words">' + cell.CommentContent + '</p>' +
		'<p class="comment-date">' + events.shortForDate(cell.CommentDate) + '</p>' +
		'</div></div>'
	return inner;
}

/**
 * 设置监听
 */
var setListeners = function() {
	//评论的点赞按钮点击事件
	mui(".mui-table-view").on('tap', '.support-container', function() {
		setIsLikeComment(this.querySelector('.icon-support'));
	})
	//回答的点赞按钮的点赞事件
	events.addTap('support-answer', function() {
		setIsLikeAnswer(this.querySelector('.icon-support'));
	})
	//按钮点击事件关注事件
	events.addTap('btn-focus', function() {
		setUserFocus(answerData.AnswerMan, this)
	})
	events.addTap('answer-comment', function() {
		events.fireToPageWithData('qiuzhi-addAnswer.html', 'add-comment', answerData);
	})
	//设置选择监听
	document.getElementById('order-selector').onchange = function() {
		type = parseInt(this.options[this.options.selectedIndex].value);
		console.log('获取的类型：' + type);
		answerData.Data.reverse();
		events.clearChild(document.getElementById('list-container'));
		refreshUI(answerData);
	}
}
/**
 * 设置是否点赞
 * @param {Object} 点赞的item
 */
var setIsLikeAnswer = function(item) {
	var wd = events.showWaiting();
	postDataQZPro_setAnswerLike({
		answerId: answerData.AnswerId, //回答ID
		userId: selfId, //点赞用户ID
		status: item.isLike ? 0 : 1 //点赞状态,0 取消点赞,1 点赞
	}, wd, function(data) {
		wd.close();
		console.log('答案点赞取消点赞结果：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			setZanIconCondition(item);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 对评论设置点赞状态
 * @param {Object} 点赞的item
 */
var setIsLikeComment = function(item) {
	var wd=events.showWaiting();
	postDataQZPro_setCommentLike({
		commentId: item.commentId, //评论ID
		userId: selfId, //点赞用户ID
		answerId: answerData.AnswerId, //回答ID
		status: item.isLike ? 0 : 1 //点赞状态，0 取消点赞，1 点赞
	}, wd, function(data) {
		wd.close();
		console.log("评论点赞取消点赞结果：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			setZanIconCondition(item);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 设置点赞的图标样式
 * @param {Object} item
 */
var setZanIconCondition = function(item) {
	if(item.isLike) {
		item.className = "mui-pull-right mui-icon iconfont icon-support isNotLike ";
		item.isLike = 0;
		mui.toast('已取消点赞');
		if(item.order||item.order==0){
			answerData.Data[item.order].IsLiked=0;
		}else{
			answerData.IsLiked=0;
		}
		
	} else {
		item.className = "mui-pull-right mui-icon iconfont icon-support isLike";
		item.isLike = 1;
		mui.toast('点赞成功');
		if(item.order||item.order==0){
			answerData.Data[item.order].IsLiked=1;
		}else{
			answerData.IsLiked=1;
		}
	}
}