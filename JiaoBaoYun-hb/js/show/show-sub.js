var personalUTID;
var showCity;
var pageIndex;
var id = 0; //cell的id
var pageFlag = 1;
mui.init();
var zonepArray;
var personalunick = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick; //用户昵称
mui.plusReady(function() {
	initNativeObjects();
	addReplyView();
	addReplyLisetner()
		// 获取当前窗口对象
	var self = plus.webview.currentWebview();
	h5fresh.addRefresh(function() {

	})
	window.addEventListener('cityInfo', function(e) {
			showCity = e.detail;
			console.log("展示子页面获取的城市信息：" + JSON.stringify(showCity));
			personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
			pageIndex = 1;
			requestData();
		})
		// 读取传递过来的参数
		//  var index = self.index;
		/**
		 * 获取父窗口对象
		 * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.parent
		 */
	var parent = self.parent();
	// 左滑事件
	document.addEventListener("swipeleft", function(event) {
		var angle = event.detail.angle;
		angle = Math.abs(angle);
		console.log('左滑事件：' + angle);
		/**
		 * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
		 */
		if(angle > 100 && angle < 185) {
			parentEvent(parent, "left");
		}
	});
	// 右滑事件
	document.addEventListener("swiperight", function(event) {

		var angle = event.detail.angle;
		angle = Math.abs(angle);
		console.log('右滑事件：' + angle);
		/**
		 * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
		 */
		if(angle < 15) {
			parentEvent(parent, "right");
		}
	});
	var click = []; //记录被点击的li的id和被点击元素
	mui('.mui-table-view').on('tap', '.dynamic-personal-image', function() {
		click.push('头像');
	});
	mui('.mui-table-view').on('tap', 'h4', function() {
		click.push('姓名');
	});
	//删除动态
	mui('.mui-table-view').on('tap', '.mui-icon-closeempty', function() {
		var btnArray = ['取消', '确定'];
		var closeId = this.id;
		mui.confirm('确定删除此条动态？', '提醒', btnArray, function(e) {
			if(e.index == 1) {
				var index = closeId.replace('delete', '');
				console.log(closeId);
				var comData = {
					userSpaceId: zonepArray[index].TabId, //用户空间ID
				};
				var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
				postDataPro_delUserSpaceById(comData, wd, function(data) {
					wd.close();
					if(data.RspCode == 0) {
						mui.toast('已删除');
						//						var wobj = plus.webview.currentWebview();
						//						wobj.reload(true);
						var deleteNode = document.getElementById(index);
						console.log(deleteNode.parentNode.innerHTML);
						deleteNode.parentNode.removeChild(deleteNode);
						console.log(deleteNode.parentNode);
						zonepArray.splice(index, 1)
					} else {
						mui.toast(data.RspTxt);
					}

				})
			} else {

			}
		})

		click.push('向下按钮');
	});
	mui('.mui-table-view').on('tap', '.dynamic-contenttext', function() {
		click.push('动态文字');
	});
	mui('.mui-table-view').on('tap', '.dynamic-image', function() {
		click.push('图片' + this.getAttribute('src'));
	});
	mui('.mui-table-view').on('tap', '.dynamic-image-more', function() {
		click.push('更多图片');
	});
	//点赞和取消点赞
	mui('.mui-table-view').on('tap', '.dynamic-icon-praise', function() {
		click.push('点赞');
		var index = this.id.replace('praise', '');
		var color = this.style.color;
		if(color == 'rgb(143, 143, 148)') {
			var comData = {
				userId: personalUTID, //用户ID
				userSpaceId: zonepArray[index].TabId, //用户空间ID
			};
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			postDataPro_setUserSpaceLikeByUser(comData, wd, function(data) {
				wd.close();
				if(data.RspCode == 0) {
					console.log('index=' + index)
					var a = document.getElementById("praise" + index);
					a.style.color = 'rgb(0, 165, 224)'
					mui.toast('点赞成功');
					var PraiseList = document.getElementById("PraiseList" + index);
					console.log(PraiseList.innerHTML);
					var praiseNameList = PraiseList.getElementsByTagName("font");
					console.log(praiseNameList.length)
					if(praiseNameList.length > 0) {
						var praiseName = praiseNameList[0];
						praiseName.innerHTML = praiseName.innerHTML + '、' + personalunick;
						console.log(praiseName.innerHTML);
					} else {

						PraiseList.innerHTML = '<img id= "praiseImg" src="../../image/dynamic/icon_praise_small.png" class="dynamic-icon-praise-small mui-pull-left" />' +
							'<font class="common-font-family-Regular dynamic-praise-name">' + personalunick + '</font>';
					}
				} else {
					mui.toast(data.RspTxt);
				}

			})

		} else {

			var comData = {
				userId: personalUTID, //用户ID
				userSpaceId: zonepArray[index].TabId, //用户空间ID
			};
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			postDataPro_delUserSpaceLikeByUser(comData, wd, function(data) {
				wd.close();
				if(data.RspCode == 0) {
					var a = document.getElementById("praise" + index);
					a.style.color = 'rgb(143, 143, 148)'
					mui.toast('取消点赞成功');
					var PraiseList = document.getElementById("PraiseList" + index);
					var praiseName = PraiseList.getElementsByTagName("font")[0];
					if(praiseName.innerHTML.indexOf('、') > -1) {
						console.log('多个人点赞')
						praiseName.innerHTML = praiseName.innerHTML.replace('、' + personalunick, '');
						praiseName.innerHTML = praiseName.innerHTML.replace(personalunick, '');
					} else {
						console.log('一个人点赞')

						console.log(PraiseList.outerHTML);
						PraiseList.removeChild(praiseName);
						var praiseImg = document.getElementById("praiseImg");
						PraiseList.removeChild(praiseImg);

					}
				} else {
					mui.toast(data.RspTxt);
				}

			})

		}

	});

	mui('.mui-table-view').on('tap', '.dynamic-icon-forward', function() {
		click.push('分享');
	});
	mui('.mui-table-view').on('tap', '.dynamic-praise-name', function() {
		click.push('点赞者：' + this.innerText);
	});
	mui('.mui-table-view').on('tap', '.dynamic-comment-name', function() {
		click.push('评论者：' + this.innerText);
	});
});

/**
 * 触发父窗口自定义事件
 * @param {Object} wvobj 目标窗口对象
 * @param {Number} index 索引值
 * @param {String} direction 方向
 */
function parentEvent(wvobj, direction) {
	/**
	 * 触发自定义事件
	 * http://dev.dcloud.net.cn/mui/event/#customevent
	 */
	mui.fire(wvobj, "swipe_event", {
		direction: direction
	});
}
/**
 * 请求数据
 */
var requestData = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		/**
		 * 请求区域内的动态
		 */
		postDataPro_getUserSpacesByArea({
			userId: personalUTID, //用户ID
			area: showCity.acode, //区域
			pageIndex: pageIndex, //当前页数
			pageSize: 10 //每页记录数
		}, wd, function(data) {
			wd.close();
			console.log('展示获取的数据：' + JSON.stringify(data));
			if(data.RspCode == 0 && data.RspData.Data.length > 0) {
				getPersonIds(data.RspData.Data);
			} else {

			}
		})
	}
	/**
	 * 获取所有人的id
	 * @param {Object} data
	 */
var getPersonIds = function(data) {
		var personIds = [];
		for(var i in data) {
			personIds.push(data[i].PublisherId);
			if(data.Comments) {
				for(var j in data[i].Comments) {
					if(data[i].Comments[j].UserId) {
						personIds.push(data[i].Comments[j].UserId);
					}
					if(data.Comments[j].ReplyId) {
						personIds.push(data[i].Comments[j].ReplyId);
					}
				}
			}
		}
		personIds = events.arraySingleItem(personIds);
		//如果只有一个id,通过串请求数据会有问题
		//所以另加一个id,以防不测
		if(personIds.length == 1) {
			var extraId = personIds[0] == 1 ? 2 : personIds[0] - 1;
			personIds.push();
		}
		getPersonalInfo(data, personIds);
	}
	/**
	 * 
	 * @param {Object} data
	 * @param {Object} ids
	 */
var getPersonalInfo = function(data, ids) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostUinf({
			vvl: ids.toString(), //用户id，查询的值,p传个人ID,g传ID串
			vtp: 'g' //查询类型,p(个人)g(id串)
		}, wd, function(personsData) {
			wd.close();
			console.log('展示子页面获取的个人信息：' + JSON.stringify(personsData));
			if(personsData.RspCode == 0) {
				data = rechargeData(data, personsData.RspData)
				zonepArray = data;
				console.log("重组后的数据：" + JSON.stringify(data));
				setData(data);
			} else {

			}
		})
	}
	/**
	 * 重组数据
	 * @param {Object} data 要重组的数据
	 * @param {Object} personsData 添加的个人信息
	 */
var rechargeData = function(data, personsData) {
		console.log('要重组的数据:' + JSON.stringify(data));
		//	console.log('加入的数据：'+JSON.stringfy(personsData));
		for(var i in data) {
			for(var j in personsData) {
				if(data[i].PublisherId == personsData[j].utid) {
					data[i].PublisherName = personsData[j].unick;
					data[i].PublisherImg = personsData[j].uimg;
				}
				if(data[i].Comments.length > 0) {
					for(var m in data[i].Comments) {
						if(data[i].Comments[m].UserId == personsData[j].utid) {
							data[i].Comments[m].UserName = personsData[j].unick;
						}
						if(data[i].Comments[m].ReplyId == personsData[j].utid) {
							data[i].Comments[m].ReplyName = personsData[j].unick;
						}
					}
				}

			}
		}

		return data; //返回重组后数据
	}
	/**
	 * 放置数据
	 * @param {Object} data
	 */
var setData = function(data) {
		var table = document.body.querySelector('.mui-table-view');
		table.innerHTML = ''

		for(var i = 0; i < data.length; i++) {
			id = i;
			var data1 = addData(i);
			dynamiclistitem.addItem(table, data1, id);
		}

		//		var list = document.getElementById('list-container');
		//		var li = document.createElement('li');
		//		li.innerHTML = '<a><div></div></a>'
	}
	//加载数据
function addData(index) {
	//[[InfoList],[ImageList],[InteractionList]]动态的信息
	var datasource = [];
	var InfoList = []; //头部和内容
	var ImageList = []; //内容的图片
	var InteractionList = []; //底部内容

	//个人信息和内容
	//[personalImage,personalName,time,contentText]个人头像，姓名，发布时间，动态内容的文字
	//判断img是否为null，或者空
	var tempModel = zonepArray[index];
	console.log('tempModel=' + JSON.stringify(tempModel));
	tempModel.PublisherImg = updateHeadImg(tempModel.PublisherImg, 2)
		//			if(tempModel.uimg == '' || tempModel.uimg == null) { //赋值
		//				tempModel.uimg = '../../image/utils/default_personalimage.png';
		//			} else { //修改值
		//				var myDate = new Date();
		//				tempModel.uimg = tempModel.uimg + '?' + myDate.getTime();
		//			}
	var personalImage = tempModel.PublisherImg;
	var personalName = tempModel.PublisherName;
	var time = tempModel.PublishDate;
	var contentText = tempModel.MsgContent;
	InfoList.push(personalImage);
	InfoList.push(personalName);
	InfoList.push(time);
	InfoList.push(contentText);

	//内容的图片
	//[[ImageUrlList],ImageNum],动态内容的图片路径数组,图片总数量
	var ImageUrlList = [];
	//					if(id == 0) {
	//						ImageUrlList = ['../../image/dynamic/u101.png', '../../image/dynamic/u101.png', '../../image/dynamic/u101.png',
	//							'../../image/dynamic/u101.png', '../../image/dynamic/u101.png', '../../image/dynamic/u101.png',
	//							'../../image/dynamic/u101.png', '../../image/dynamic/u101.png', '../../image/dynamic/u101.png', '../../image/dynamic/u101.png'
	//						];
	//					} 
	var ImageNum = ImageUrlList.length;
	ImageList.push(ImageUrlList);
	ImageList.push(ImageNum);

	//底部
	//[introduce，viewCount，[praiseList],[commentList]]信息说明，浏览次数，点赞列表数组，评论列表数组
	var introduce = '上传了' + ImageNum + '张图片到相册《手机相册》';
	var viewCount = tempModel.ReadCnt;
	var praiseList = [];
	if(tempModel.LikeUsers.length != 0) {
		for(var i = 0; i < tempModel.LikeUsers.length; i++)
			praiseList.push(tempModel.LikeUsers[i].unick);
	}

	//[commentList]:评论列表
	//1.评论[commenter,content]，评论者，评论内容
	//2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容
	var commentList = [];

	for(var i = 0; i < tempModel.Comments.length; i++) {

		var tempComment = tempModel.Comments[i];
		commentList.push(tempComment);
		//				if(tempComment.Replys.length != 0) {
		//					var replys = tempComment.Replys
		//					for(var j = 0; j < replys.length; j++) {
		//						var replyModel = replys[j];
		//						commentList.push(replyModel);
		//					}
		//
		//				}

	}

	InteractionList.push(introduce);
	InteractionList.push(viewCount);
	InteractionList.push(praiseList);
	InteractionList.push(commentList);

	datasource = [InfoList, ImageList, InteractionList]
	return datasource;
}

var addReplyView = function() {
	//			评论
	mui('.mui-table-view').on('tap', '.dynamic-icon-comment', function() {
		//				click.push('评论');
		tempIndex = this.id.replace('comment', '');
		console.log('tempIndex====' + tempIndex)
		var replyContainer = document.getElementById('footer');
		document.getElementById('footer').className = 'mui-bar-tab';
		replyContainer.style.display = 'block';
		showSoftInput('#msg-content');
		window.event.stopPropagation()

	});
	//底部评论按钮
	mui('.mui-table-view').on('tap', '.dynamic-comment-btn', function() {
		tempIndex = this.id.replace('bottomComment', '');
		console.log('tap====' + tempIndex)
		var replyContainer = document.getElementById('footer');
		document.getElementById('footer').className = 'mui-bar-tab';
		replyContainer.style.display = 'block';
		showSoftInput('#msg-content');
		window.event.stopPropagation()
	});

	//			回复评论
	mui('.mui-table-view').on('tap', '.replyComment', function() {

		tempIndex = this.id.replace('replyComment', '');
		console.log('tempIndex====' + tempIndex)
		var replyContainer = document.getElementById('footer');
		document.getElementById('footer').className = 'mui-bar-tab';
		replyContainer.style.display = 'block';
		showSoftInput('#msg-content');
		window.event.stopPropagation()

	});

}

function addReplyLisetner() {
	events.addTap('btn-reply', function() {

		var replyName = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick
		var inputComment = document.getElementById("msg-content");
		var name = inputComment.value; //评论内容
		if(name == '') {
			mui.toast('不允许为空');
		} else {
			if(tempIndex.indexOf('-') >= 0) {
				var indexArr = tempIndex.split('-');
				var id = indexArr[0];
				var commentId = indexArr[1];
				var replyId = indexArr[2];

				var tempModel = zonepArray[id].Comments[commentId];
				var upperId = tempModel.TabId;
				var replyUserId;
				var ReplyIdName;
				if(replyId == '评论') {
					replyUserId = tempModel.UserId
					ReplyIdName = tempModel.UserIdName
				} else {
					replyUserId = tempModel.Replys[replyId].UserId;
					ReplyIdName = tempModel.Replys[replyId].UserIdName;
				}

				var comData = {
					userId: personalUTID, //用户ID
					upperId: upperId, //上级评论ID
					replyUserId: replyUserId, //回复ID
					userSpaceId: zonepArray[id].TabId, //用户空间ID
					commentContent: inputComment.value //回复内容
				};
				console.log('comData=====' + JSON.stringify(comData))
				var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
				postDataPro_addUserSpaceCommentReply(comData, wd, function(data) {
					wd.close();

					console.log('添加空间评论回复_addUserSpaceCommentReply' + JSON.stringify(data));

					var replyComment = document.getElementById('replyComment' + id + '-' + commentId + '-' + '评论');
					var nextReplyComment = document.createElement('div');
					var html2 = '<font class="common-font-family-Regular dynamic-comment-name">' + personalunick + '</font>';
					var html3 = '<font class="common-font-family-Regular">回复</font>';
					var html4 = '<font class="common-font-family-Regular dynamic-comment-name">' + ReplyIdName + '</font>';
					var html5 = '<font class="common-font-family-Regular">:' + inputComment.value + '</font>'
					nextReplyComment.innerHTML = html2 + html3 + html4 + html5;
					replyComment.appendChild(nextReplyComment);
					document.getElementById('footer').className = '';
					document.getElementById('footer').style.display = 'none';
					jQuery('#msg-content').blur();
					inputComment.value = '';

				})
			} else {
				var comData = {
					userId: personalUTID, //用户ID
					userSpaceId: zonepArray[tempIndex].TabId, //用户空间ID
					commentContent: inputComment.value //回复内容
				};
				var tempValue = inputComment.value;
				var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
				postDataPro_addUserSpaceComment(comData, wd, function(data) {
					wd.close();
					console.log('添加空间评论_addUserSpaceComment' + JSON.stringify(data));
					var commentArr = zonepArray[tempIndex].Comments;
					console.log("commentList" + tempIndex);
					var commentList = document.getElementById("commentList" + tempIndex);
					var html1 = '<div id="replyComment' + tempIndex + '-' + commentArr.length + '-' + '评论' + '" class="mui-media-body replyComment">';
					var html2 = '<font class="common-font-family-Regular dynamic-comment-name ">' + personalunick + '</font>';
					var html3 = '<font class="common-font-family-Regular">：' + tempValue + '</font></div>';
					var htmlComment = html1 + html2 + html3;
					commentList.innerHTML = commentList.innerHTML + htmlComment
					document.getElementById('footer').className = '';
					document.getElementById('footer').style.display = 'none';
					jQuery('#msg-content').blur();
					inputComment.value = '';

				})
			}

		}

	})
}
//失去焦点事件
function inputOnblur(input) {
	var inputComment = document.getElementById("msg-content");
	inputComment.value = '';
	document.getElementById('footer').className = '';
	document.getElementById('footer').style.display = 'none';
}