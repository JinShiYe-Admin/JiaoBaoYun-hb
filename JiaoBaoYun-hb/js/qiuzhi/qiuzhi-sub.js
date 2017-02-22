/**
 * 求知子页面界面逻辑
 */
var pageIndex = 1; //当前页数
var totalPage; //总页数
var channelInfo; //选择的话题
var allChannels; //所有的话题
mui.init();
mui.plusReady(function() {
	events.preload("qiuzhi-question.html", 200);
	events.preload("qiuzhi-answerDetail.html", 300);
	window.addEventListener('channelInfo', function(e) {
		console.log('求知子页面获取的 :' + JSON.stringify(e.detail.data))
		pageIndex = 1; //当前页数
		totalPage = 0; //总页数
		channelInfo = e.detail.data.curChannel; //选择的话题
		allChannels = e.detail.data.allChannels; //所有的话题
		//话题--求知
		//		mod.model_Channel = {
		//			TabId: '', //话题ID
		//			ChannelCode: '', //话题编号
		//			ChannelName: '' //话题名称
		//		}
		//获取所有符合条件问题
		requestChannelList(channelInfo);
		//清理问题列表
		events.clearChild(document.getElementById('list-container'));
		//清理专家列表
		resetExpertsList();
		//2.获取符合条件的专家信息
		getExpertsArray(channelInfo.TabId);

	});

	//加载h5下拉刷新方式
	h5fresh.addRefresh(function() {
		pageIndex = 1;
		//清理问题列表
		events.clearChild(document.getElementById('list-container'));
		//清理专家列表
		resetExpertsList();
		//2.获取符合条件的专家信息
		getExpertsArray(channelInfo.TabId);
		//刷新的界面实现逻辑
		requestChannelList(channelInfo);
	}, {
//		height: '5%',
//		style: 'circle',
//		range:'5%'
	});
	setListener();
	pullUpFresh();
});

/**
 * 请求专家数据
 * //2.获取符合条件的专家信息
 */
function getExpertsArray(channelId) {
	//需要加密的数据
	var comData = {
		userIds: '[0]', //用户编号列表,Array,传入0，获取所有专家
		channelId: channelId.toString(), //话题ID,传入0，获取所有话题数据
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//2.获取符合条件的专家信息
	postDataQZPro_getExpertsByCondition(comData, wd, function(data) {
		console.log('2.获取符合条件的专家信息:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//添加人员信息
			//回调中的临时数据
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.UserId);
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			console.log('tempData:' + JSON.stringify(tempData));
			// 等待的对话框
			var wd2 = events.showWaiting();
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd2, function(data1) {
				console.log('21.获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
				if(data1.RspCode == 0) {
					//循环当前的个人信息返回值数组
					for(var i in data1.RspData) {
						//当前model
						var tempModel = data1.RspData[i];
						//更新头像
						tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
						//循环回调数组
						for(var item in tempRspData) {
							//当前循环的model
							var tempModel0 = tempRspData[item];
							//对比id是否一致
							if(tempModel0.UserId == tempModel.utid) {
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
						}
					}
				}
				console.log('专家循环遍历后的值：' + JSON.stringify(tempRspData));
				//刷新界面
				for(var i = 0; i < tempRspData.length; i++) {
					expertsItem(tempRspData[i]);
				}
				wd2.close();
			});
		} else {
			mui.toast(data.RspTxt);
		}
		wd.close();
	});
};

/**
 * 放置专家数据
 */
function expertsItem(data) {
	var element = document.createElement('a');
	element.id = 'experts_' + data.TabId;
	element.className = 'mui-control-item';
	element.setAttribute('data-info', JSON.stringify(data));
	element.innerHTML = '<img src="' + updateHeadImg(data.uimg, 2) + '" />' +
		'<p id="experts_name_' + data.TabId + '" class="mui-ellipsis"></p>';
	var table = document.getElementById("experts_sc");
	var allExpert = document.getElementById("allExpert");
	table.insertBefore(element, allExpert);
	document.getElementById("experts_name_" + data.TabId).innerText = data.unick;
}

/**
 * 重置专家列表
 */
function resetExpertsList() {
	var table = document.getElementById("experts_sc");
	table.innerHTML = '<a id="allExpert" class="mui-control-item" style="width: 8rem;padding: 1rem 0px;">' +
		'<span class="mui-icon iconfont icon-gengduo" style="color: #12B7F5;font-size: 28px;margin: 0px;"></span>' +
		'<p style="color: #12B7F5;">查看全部</p>' +
		'</a>';
	var scroll = mui('#experts_sw').scroll();
	scroll.scrollTo(0, 0, 100); //100毫秒滚动到顶
}

/**
 * 请求求知数据
 */
//4.获取所有符合条件问题
function requestChannelList(channelInfo) {
	//所需参数
	var comData = {
		askTitle: '', //问题标题,用于查找，可输入部分标题
		channelId: channelInfo.TabId, //话题ID,传入0，获取所有话题数据
		pageIndex: pageIndex, //当前页数
		pageSize: 10 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//4.获取所有符合条件问题
	postDataQZPro_getAsksByCondition(comData, wd, function(data) {
		wd.close();
		console.log('获取所有符合条件问题:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			totalPage = data.RspData.totalPage;
			setChannelList(data.RspData.Data);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

/**
 * 放置求知数据
 */
var setChannelList = function(data) {
	console.log('求知主界面加载的数据信息：' + JSON.stringify(data));
	var list = document.getElementById('list-container');
	for(var i in data) {
		var li = document.createElement('li');
		li.className = "mui-table-view-cell";
		li.innerHTML = getInnerHTML(data[i]);
		list.appendChild(li);
		li.querySelector('.answer-content').answerInfo = data[i];
	}
}
var getInnerHTML = function(cell) {
	var inner = '<a>' +
		'<div class="channel-info">' +
		'<p><img src="' + getChannelIcon(cell) + '" class="channel-icon"/>来自话题:' + cell.AskChannel + '</p>' +
		'</div>' +
		'<div class="ask-container">' +
		'<h5 class="single-line ask-title" askId="' + cell.TabId + '">[' + cell.AskChannel + ']' + cell.AskTitle + '</h5>' +
		'<p class="triple-line answer-content" answerInfo="' + cell.AnswerId + '">' + cell.AnswerContent + '</p>' +
		'<div class="imgs-container">' + getImgs(cell.AnswerEncAddr) + '</div>' +
		'</div>' +
		'<div class="extra-info"></div>' +
		'<p>' + cell.IsLikeNum + '赞·' + cell.CommentNum + '评论·关注</p>' +
		'</a>'
	return inner;
}
var getImgs = function(imgs) {
	if(imgs && imgs != "") {
		var imgArray = imgs.split('|');
		var imgInner = ''
		for(var i = 0; i < 3 && i < imgArray.length; i++) {
			imgInner += '<img src="' + imgArray[i] + '" class="answer-img"/>'
		}
		return imgInner;
	}
	return '';
}
/**
 *
 * @param {Object} cell
 */
var getChannelIcon = function(cell) {
	var iconSourse = "../../image/qiuzhi/";
	switch(cell.AskChannel) {
		case "教学":
			iconSourse += "channel-edu.png";
			break;
		case "美食":
			iconSourse += "channel-food.png";
			break;
		case "健康":
			iconSourse += "channel-health.png";
			break;
		case "其他":
			iconSourse += "channel-others.png";
			break;
		default:
			iconSourse = "";
			break;
	}
	return iconSourse;
}
/**
 * 上拉加载的实现方法
 */
var pullUpFresh = function() {
	document.addEventListener("plusscrollbottom", function() {
		console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPage);
		if(pageIndex < totalPage) {
			pageIndex++;
			requestChannelList(channelInfo);
		} else {
			mui.toast('到底啦，别拉了！');
		}
	}, false);
}
/**
 * 各种监听事件
 */
var setListener = function() {
	events.addTap('submit-question', function() {
		console.log(JSON.stringify(allChannels))
		events.openNewWindowWithData('qiuzhi-newQ.html', { curChannel: channelInfo, allChannels: allChannels });
	});

	//标题点击事件
	mui('.mui-table-view').on('tap', '.ask-title', function() {
		events.fireToPageNone('qiuzhi-question.html', 'askId', this.getAttribute('askId'));
		events.fireToPageNone('qiuzhi-questionSub.html', 'askId', this.getAttribute('askId'));
		plus.webview.getWebviewById('qiuzhi-question.html').show();
	});

	//点击回答
	mui('.mui-table-view').on('tap', '.answer-content', function() {
		events.fireToPageNone('qiuzhi-answerDetailSub.html', 'answerInfo', this.answerInfo);
		console.log('传递的answerInfo:' + JSON.stringify(this.answerInfo));
		plus.webview.getWebviewById('qiuzhi-answerDetail.html').show();
	});

	//点击专家列表
	mui('#experts_sc').on('tap', '.mui-control-item', function() {
		//console.log('点击专家列表 ' + this.id);
		//console.log('当前话题的信息 ' + JSON.stringify(channelInfo));
		if(this.id == 'allExpert') { //查看某个话题的全部专家
			events.openNewWindowWithData('experts_main.html', {
				channelInfo: channelInfo, //当前话题
				allChannels: allChannels //所有话题
			});
		} else { //查看某个话题的某个专家
			//console.log('当前专家的信息 ' + JSON.stringify(JSON.parse(this.getAttribute('data-info'))));
			events.openNewWindowWithData('expert-detail.html', JSON.parse(this.getAttribute('data-info')));
		}
	});
}