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
var AskEncAddr = []; //提问图片原图
var AskThumbnail = []; //提问图片缩略图
var mainData; //记录获取的数据
mui.plusReady(function() {
	mui.previewImage();
	var main = plus.webview.currentWebview(); //获取当前窗体对象
	mainData = main.data; //接收A页面传入参数值
	console.log('qiuzhi-questionSub.html:' + JSON.stringify(mainData));

	events.preload('qiuzhi-addAnswer.html');

	askID = mainData.askID;
	//5.获取某个问题的详情
	requestAskDetail();
	//13.获取是否已对某个问题关注
	getAskFocusByUser(askID);

	window.addEventListener('answerAdded', function() {
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
		if(askModel.IsAnswered == 1) {
			mui.toast('已经回答过此问题');
			return;
		}
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
		//console.log('tab_div-hold');
		tab_div.style.background = '#DDDDDD';
		tab_font.style.color = 'white';
	});
	tab_div.addEventListener('release', function() {
		//console.log('tab_div-release');
		tab_div.style.background = 'white';
		tab_font.style.color = 'gray';
	});
	//---点击效果---end---

	events.addTap('guanzhu', function() {
		console.log('点击关注');
		if(this.innerText == '关注') {
			setAskFocus(askID, 1);
		} else {
			setAskFocus(askID, 0);
		}
	});

	//点击回答
	mui('#answer_bottom').on('tap', '.ellipsis-3', function() {
		var element = this.parentNode;
		var info = JSON.parse(element.getAttribute('data-info'))
		console.log(JSON.stringify(info));
		//跳转页面
		events.fireToPageNone('qiuzhi-answerDetailSub.html', 'answerInfo', info);
		plus.webview.getWebviewById('qiuzhi-answerDetail.html').show("slide-in-right", 250);
	});

	//点击回答者头像
	mui('#answer_bottom').on('tap', '.mui-media-object', function() {
		var element = this.parentNode;
		var info = JSON.parse(element.getAttribute('data-info'));
		console.log(JSON.stringify(info));
		if(info.IsAnonym != 1) {
			info.UserId = info.utid;
			//跳转页面
			events.openNewWindowWithData('expert-detail.html', info);
		}
	});

	var showAll = document.getElementById("showAll");
	showAll.addEventListener('tap', function() {
		var str = this.innerText;
		//console.log('showAll' + str);
		if(str == '显示全部') {
			addImages(1);
			if(askModel.AskSFlag && askModel.AskSFlag == 1) { //旧数据
				document.getElementById("question_content").style.height = 'auto';
			} else {
				document.getElementById("question_content").style.webkitLineClamp = 'inherit';
			}
			this.style.display = 'none';
			showAll.innerText = '收起';
		} else if(str == '收起') {
			showAll.innerText = '显示全部';
			addImages(0);
			if(askModel.AskSFlag && askModel.AskSFlag == 1) { //旧数据
				document.getElementById("question_content").style.height = '60px';
			} else {
				document.getElementById("question_content").style.webkitLineClamp = '3';
			}
			//mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,0);//00毫秒滚动到顶
		}
	});
});

//13.获取是否已对某个问题关注
function getAskFocusByUser(askId) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//需要加密的数据
	var comData = {
		userId: personalUTID, //用户ID
		askId: askId //问题ID
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//13.获取是否已对某个问题关注
	postDataQZPro_getAskFocusByUser(comData, wd, function(data) {
		wd.close();
		console.log('13.获取是否已对某个问题关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//刷新界面
			if(data.RspData.Result == 0) {
				document.getElementById("guanzhu").innerText = '关注';
				document.getElementById("guanzhu").style.background = '#1db8F1';
				document.getElementById("guanzhu").style.border = '#1db8F1';
			} else {
				document.getElementById("guanzhu").innerText = '已关注';
				document.getElementById("guanzhu").style.background = '#b7b7b7';
				document.getElementById("guanzhu").style.border = '#b7b7b7';
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

//14.设置某个问题的关注，0 不关注,1 关注
function setAskFocus(askId, status) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//需要加密的数据
	var comData = {
		userId: personalUTID, //用户ID
		askId: askId, //问题ID
		status: status //关注状态,0 不关注,1 关注
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//14.设置某个问题的关注
	postDataQZPro_setAskFocus(comData, wd, function(data) {
		wd.close();
		console.log('14.设置某个问题的关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//刷新界面显示
			if(document.getElementById("guanzhu").innerText == '关注') {
				document.getElementById("guanzhu").innerText = '已关注';
				document.getElementById("guanzhu").style.background = '#e4e4e4';
				document.getElementById("guanzhu").style.border = '#e4e4e4';
			} else {
				document.getElementById("guanzhu").innerText = '关注';
				document.getElementById("guanzhu").style.background = '#1db8F1';
				document.getElementById("guanzhu").style.border = '#1db8F1';
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

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
		//重置显示全部
		document.getElementById("showAll").innerText = '显示全部';
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
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//所需参数
	var comData = {
		userId: personalUTID, //用户ID
		askId: askID, //问题ID
		orderType: askOrderType, //回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
		pageIndex: answerIndex, //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//5.获取某个问题的详情
	postDataQZPro_getAskById(comData, wd, function(data) {

		console.log('5.获取某个问题的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			askModel = data.RspData;
			answerPageCount = data.RspData.TotalPage; //回答总页数
			answerIndex++;

			//回调中的临时数据
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.AnswerMan);
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			console.log('tempData:' + JSON.stringify(tempData));
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd, function(data1) {
				//				wd.close();
				console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
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
							//判断是否为匿名
							if(tempModel0.IsAnonym == 1) {
								tempModel.uimg = updateHeadImg('', 2);
								tempModel.unick = '匿名用户';
							}
							//对比id是否一致
							if(tempModel0.AnswerMan == tempModel.utid) {
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
						}
					}
				}
				console.log('循环遍历后的值：' + JSON.stringify(tempRspData));
				//刷新0，还是加载更多1
				if(answerFlag == 0) {
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //下拉刷新结束
					answerArray = tempRspData;
					//清理原界面
					cleanQuestion();
					cleanAnswer();
					//生成新界面
					addQuestion(data.RspData);
					if(tempRspData.length == 0) { //没有人回答
						mui.toast('没有人回答该提问');
						mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
					} else {
						mui('#refreshContainer').pullRefresh().enablePullupToRefresh(false); //启用上拉加载更多
					}
				} else {
					answerArray = answerArray.concat(tempRspData);

					mui('#refreshContainer').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
				}
				//刷新界面
				addAnswer(tempRspData);
				wd.close();
			});
		} else {
			wd.close();
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

	if(data.AskSFlag != 1 && data.AskEncAddr != '') {
		AskEncAddr = data.AskEncAddr.split('|'); //图片原图
		AskThumbnail = data.AskThumbnail.split('|'); //图片缩略图
		addImages(0);
	}
	if(data.AskSFlag && data.AskSFlag == 1) { //问题来源,1 为外部导入数据
		console.log('AskSFlag111111111');
		questionContent(data.AskNote, 1);
	} else {
		console.log('AskSFlag00000000000');
		questionContent(data.AskNote, 0);
	}
	questionInfo(data.ReadNum, data.FocusNum);
	answerShu(data.AnswerNum);
}

/**
 * 放置问题的图片
 * @param {Object} num 0三张，1全部
 * @param {Object} data
 */
function addImages(num) {
	if(AskEncAddr.length != 0) {
		questionImages(num, AskEncAddr, AskThumbnail);
		if(AskEncAddr.length > 3) {
			//内容高度大于三行
			var show = document.getElementById("showAll");
			if(show.style.display != 'inline') {
				document.getElementById("showAll").style.display = 'inline';
			}
		}
	}
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
 * @param {Object} type 0显示三张，1显示全部
 * @param {Object} AskEncAddr 问题图片数组
 * @param {Object} AskThumbnail 缩略图数组
 */
function questionImages(type, AskEncAddr, AskThumbnail) {
	var footer = document.getElementById("question_images");
	var imageArray = AskEncAddr;
	var thumbArray = AskThumbnail;
	var num = imageArray.length;

	var mediaStr = '';
	var width = (footer.offsetWidth) * 0.32;
	var height = width * 3 / 4;
	var marginBottom = (footer.offsetWidth) * 0.02;
	var marginRight;

	var html_0 = '<div class="record-imge">';
	var html_1 = '';
	var html_2 = ''; //是否显示三张之后的图片
	for(var i = 0; i < imageArray.length; i++) {
		if(i == 2 || i == 5 || i == 8) {
			marginRight = 0;
		} else {
			marginRight = marginBottom;
		}
		if(type == 0 && i > 2) {
			html_2 = 'display:none;';
		}
		html_1 = html_1 + '<div class="record-picture" style="width: ' + width + 'px; height: ' + height + 'px; margin-right: ' + marginRight + 'px; margin-bottom: ' + marginBottom + 'px;' + html_2 + '">\
								<img src="' + thumbArray[i] + '" data-preview-src="' + imageArray[i] + '" data-preview-group="questionImages" style="width:100%;visibility:hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + height + 'px\';this.style.width=\'initial\';this.style.marginLeft=-(this.offsetWidth-' + width + ')/2+\'px\';}else{this.style.marginTop=-(this.offsetHeight-' + height + ')/2+\'px\';}this.style.visibility=\'visible\';" onerror="this.style.visibility=\'visible\';">\
							</div>';
	}
	mediaStr = html_0 + html_1 + '</div>';
	footer.innerHTML = mediaStr;
	if(num == 0) { //0张
		footer.style.height = '0px';
	} else if((num > 0 && num <= 3) || type == 0) { //1-3张,一行
		footer.style.height = height + marginBottom + 'px';
	} else if(num > 3 && num <= 6) { //4-6张，二行
		footer.style.height = height * 2 + marginBottom * 2 + 'px';
	} else if(num > 6 && num <= 9) { //7-9张，三行
		footer.style.height = height * 3 + marginBottom * 3 + 'px';
	} else {
		console.log('### ERROR ### 图片数量超过 9 张，放置图片的区域未设置相应的高度');
	}

}

/**
 * 放置问题内容
 * @param {Object} content 问题内容
 */
function questionContent(content, flag) {
	var height_0;
	var height_1;
	if(flag == 1) { //求知旧数据
		document.getElementById("question_content").style.lineHeight = '20px';
		document.getElementById("question_content").innerHTML = content;
		height_0 = document.getElementById("question_content").offsetHeight;
		if(height_0 > 60) {
			document.getElementById("question_content").style.lineHeight = '20px';
			document.getElementById("question_content").style.height = '60px';
			document.getElementById("showAll").style.display = 'inline';
		}
	} else {
		document.getElementById("question_content").innerText = content;
		document.getElementById("question_content").style.webkitLineClamp = '4';
		height_0 = document.getElementById("question_content").offsetHeight;
		document.getElementById("question_content").style.webkitLineClamp = '3';
		height_1 = document.getElementById("question_content").offsetHeight;
		//console.log(height_0 + '|' + height_1);
		if(height_0 > height_1) {
			//内容高度大于三行
			document.getElementById("showAll").style.display = 'inline';
		}
	}
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
	for(var i = 0; i < data.length; i++) {
		answerList(data[i]);
	}
}

/**
 * 放置回答列表的一项
 * @param {Object} answershu 一个回答的数据
 */
function answerList(data) {

	var li = document.createElement('li');
	li.className = 'mui-table-view-cell mui-media';
	li.id = 'answer_' + data.AnswerId;
	li.setAttribute('data-info', JSON.stringify(data));
	li.innerHTML = '' +
		'<img class="mui-media-object mui-pull-left" src="' + updateHeadImg(data.uimg, 2) + '">' +
		'<div class="mui-ellipsis">' + data.unick + '</div>' +
		'<div id="answer_content_' + data.AnswerId + '" class="ellipsis-3"></div>' +
		'<div class="answer-info">' + data.IsLikeNum + '赞同·' + data.CommentNum + '评论·' + modifyTimeFormat(data.AnswerTime) + '</div>';
	document.getElementById("answer_bottom").appendChild(li);
	if(data.AnswerSFlag != 1) { //不是旧数据
		document.getElementById("answer_content_" + data.AnswerId).innerText = data.AnswerContent;
	} else {
		var content_0 = events.htmlGetText(data.AnswerContent);
		var content_1 = content_0.replace(/\s+/g, ""); //替换所有空格
		document.getElementById("answer_content_" + data.AnswerId).innerText = content_1;
	}

}