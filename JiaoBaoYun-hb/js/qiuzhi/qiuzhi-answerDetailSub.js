<<<<<<< HEAD
var type = 2;
var answerId;
events.initRefresh('list-container', function() {
	requestAnswerDetail(answerId);
}, function() {
	mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
=======
mui.init()
mui.plusReady(function(){
	window.addEventListener('answerId',function(e){
		console.log('回答详情获取的答案id:'+e.detail.data);
		//8.获取某个回答的详情
				requestAnswerDetail(e.detail.data);
	})
>>>>>>> origin/master
})
mui.plusReady(function() {
		window.addEventListener('answerId', function(e) {
			console.log('回答详情获取的答案id:' + e.detail.data);
			answerId = e.detail.data;
			events.clearChild(document.getElementById('list-container'));
			requestAnswerDetail(answerId);
		})

		setListeners();
	})
	//8.获取某个回答的详情
function requestAnswerDetail(answerId) {
	//所需参数
	var comData = {
		answerId: answerId, //回答ID
<<<<<<< HEAD
		orderType: type, //评论排序方式,1 时间正序排序,2 时间倒序排序
=======
		orderType: '2', //评论排序方式,1 时间正序排序,2 时间倒序排序
>>>>>>> origin/master
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//8.获取某个回答的详情
	postDataQZPro_getAnswerById(comData, wd, function(data) {
		wd.close();
		console.log('8.获取某个回答的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var datasource = data.RspData;
			getInfos(datasource);

		} else {
			mui.toast(data.RspTxt);
		}
	});
}
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
				datasource.Data[i].UserImg = info.uimg == null ? storageKeyName.DEFAULTPERSONALHEADIMAGE : info.uimg;
			}
			if(datasource.Data[i].ReplyId == info.utid) {
				datasource.Data[i].ReplyName = info.unick;
				datasource.Data[i].ReplyImg = info.uimg == null ? storageKeyName.DEFAULTPERSONALHEADIMAGE : info.uimg;
			}
		}
	}
	return datasource;
}

function refreshUI(datasource) {
	console.log('重组后的答案详情信息：' + JSON.stringify(datasource));
	var ul = document.getElementById('list-container');
	var li_title = document.createElement("li");
	li_title.className = 'mui-table-view-cell mui-media';
	li_title.innerHTML = datasource.AskTitle;
	var li_person = document.createElement("li");
	li_person.className = 'mui-table-view-cell mui-media';
	li_person.innerHTML = '<img class="mui-media-object mui-pull-left" src="' + updateHeadImg(datasource.uimg, 2) + '">' +
		'<div class="mui-media-body">' +
		datasource.unick +
		'<p class="mui-ellipsis">' + '专栏:教育、美食' + '</p>' +
		'<button class="mui-btn-green mui-pull-right" style="margin-top: -40px;">' + '关注' + '</button>' +
		'</div>';
	var li_content = document.createElement("li");
	li_content.className = 'mui-table-view-cell mui-media';
	li_content.innerHTML = datasource.AnswerContent;
	ul.appendChild(li_title);
	ul.appendChild(li_person);
	ul.appendChild(li_content);
	for(var i in datasource.Data) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = createCommentsInner(datasource.Data[i]);
		ul.appendChild(li);
	}
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
	var inner = '<a><div class="img-container"><img class="head-img" src="' + headImg + '"/></div>' +
		'<div class="comment-container">' +
		'<h4 class="comment-personName">' + personName + '</h4>' +
		'<p class="comment-words">' + cell.CommentContent + '</p>' +
		'<p class="comment-date">' + events.shortForDate(cell.CommentDate) + '</p>' +
		'</div></a>'
	return inner;
}
var addComment = function(commentValue) {
	var pId = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataQZPro_addAnswerComment({
		answerId: answerId, //回答ID
		upperId: 0, //上级评论ID,第一个评论传0，其他的传最上层的ID
		userId: pId, //评论用户ID,
		commentContent: commentValue, //评论内容
		replyId: 0 //回复用户ID,新增评论的话传0，回复评论传用户Id
	}, wd, function(data) {
		wd.close();
		console.log('评论结果:' + JSON.stringify(data))
		if(data.RspCode == 0) {
			if(data.RspData.Result) {
				mui.toast('评论成功！')
			}
		} else {
			mui.toast('评论失败，请重新提交评论！');
		}
	})
}
var setListeners = function() {
	events.addTap('send-comment', function() {
		var value = document.querySelector('.input-text').value;
		if(value) {
			addComment(value);
		} else {
			mui.toast("请输入评论内容");
		}
	})
}