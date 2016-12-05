var class_space = (function(mod) {

	/**
	 * 
	 * @param {Object} postData
	 * @param {Object} pageIndex
	 * @param {Object} pageSize
	 * @param {Object} callback
	 */
	mod.getList = function(postData, pageIndex, pageSize, callback) {
			postData.pageIndex = pageIndex;
			postData.pageSize = pageSize;
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
			postDataPro_getClassSpacesByUserForClass(postData, wd, function(pagedata) {
				wd.close();
				if(pagedata.RspCode == '0000') {
					console.log('获取的班级动态：' + JSON.stringify(pagedata));
					mod.totalPagNo = pagedata.RspData.TotalPage;
					callback(pagedata.RspData.Data);
				} else {
					mui.toast(pagedata.RspTxt);
				}

			})
		}
		/**
		 * 更换url 然后创建listView
		 * @param {Object} list
		 */
	var i = 0;
	mod.replaceUrl = function(list) {
			list = getUrlBrief(list);
			i = 0;
			createListView(list);
		}
		/**
		 * 获取Url信息
		 */
	var getUrlBrief = function(list) {
			if(i < list.length) {
				urlBrief.getUrlFromMessage(list[i].MsgContent, function(message) {
					list[i].MsgContent = message;
					i++;
					getUrlBrief();
				})
			}
			return list;
		}
		/**
		 * 
		 * @param {Object} list
		 */
	var createListView = function(list) {
			if(list.length > 0) {
				console.log('总页码：' + mod.totalPagNo);
				var container = document.getElementById('classSpace_list');
				list.forEach(function(cell, index, data) {
					var li = document.createElement('li');
					li.className = "mui-table-view-cell";
					getPersonalImg(cell, li, container);
				})
			} else {
				console.log('暂无数据');
			}
		}
		/**
		 * 
		 * @param {Object} item
		 */
	var createInnerHtml = function(item) {
		var inner = '<div><div class="mui-pull-left head-img" >' +
			'<img class="head-portrait" src="' + item.publisherImg + '"/>' +
			'<p>' + item.publisherName + '</p>' +
			'</div>' +
			'<div class="chat_content_left">' +
			'<div class="chat-body"><p class="chat-words">' +
			item.MsgContent + '</p>' +
			createImgsInner(item) +
			'</div>' +
			'<p class="chat-bottom">' + item.PublishDate +
			'<span tabId="'+item.TabId+'" class="mui-icon iconfont icon-support ' + setIsLike(item.IsLike) + '">(' + item.LikeCnt + ')</span><span class="mui-icon iconfont icon-xianshi">(' + item.ReadCnt + ')</span></p>' +
			'</div></div>';
		return inner;
	}
	var setIsLike = function(isLike) {
		return isLike ? 'isLike' : 'isNotLike';
	}

	/**
	 * 
	 * @param {Object} pDate
	 */
	var changeDate = function(pDate) {
			var noDate = pDate.split('-');
			console.log(noDate);
			if(parseInt(noDate[0]) == new Date().getFullYear()) {
				noDate.splice(0, 1);
			}
			noDate = noDate.join('-')
			noDate = noDate.split(':');
			noDate.splice(2, 1);
			return noDate.join(':')
		}
		/**
		 * 
		 * @param {Object} cell
		 * @param {Object} li
		 * @param {Object} container
		 */
	var getPersonalImg = function(cell, li, container) {
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
			postDataPro_PostUinf({
				vvl: cell.PublisherId,
				vtp: 'p'
			}, wd, function(pInfo) {
				console.log('获取的个人信息:' + JSON.stringify(pInfo))
				wd.close();
				if(pInfo.RspCode == '0000') {
					var personalInfo = pInfo.RspData[0];
					console.log('获取的个人信息：' + JSON.stringify(personalInfo));
					cell.publisherImg = personalInfo.uimg;
					cell.publisherName = personalInfo.unick;
					cell.PublishDate = changeDate(cell.PublishDate);
					li.innerHTML = createInnerHtml(cell);
					container.appendChild(li);
				} else {
					console.log(pInfo.RspTxt);
				}

			})
		}
		/**
		 * 
		 * @param {Object} cell
		 */
	var createImgsInner = function(cell) {
		var imgInner = '';
		var percent = 0.00;
		if(cell.EncImgAddr) {
			cell.EncImgAddr.split('|').forEach(function(img, ind, extras) {
				if(extras.length <= 3 && extras.length > 0) {
					percent = 100 / (extras.length)
					imgInner += '<img src="' + img + '" style="width:' + percent + '%;padding:2px"/>'
				} else {
					imgInner += '<img src="' + img + '" style="width:33.33333333%; padding:2px"/>'
				}
			});
		}

		//		console.log(imgInner) 
		return imgInner;
	}
	return mod;
})(class_space || {});
var pageIndex = 1;
var pageSize = 10;

mui.plusReady(function() {
	var postData = plus.webview.currentWebview().data;
	postData.userId = parseInt(postData.userId);

	setReaded(postData.userId, postData.classId);
	console.log('班级空间获取值：' + JSON.stringify(postData));
	class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	setListener(postData.userId);
	//更改个人信息，更新界面
	window.addEventListener('infoChanged', function() {
			pageIndex = 1;
			var container = document.getElementById('classSpace_list');
			events.clearChild(container);
			class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
		})
		/***
		 * 加载刷新
		 */
	events.initRefresh('classSpace_list',
		function() {
			setReaded(postData.userId, postData.classId);
			pageIndex = 1;
			class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
		},
		function() {
			console.log('请求页面：page' + pageIndex);
			mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex >= class_space.totalPagNo);
			if(pageIndex < class_space.totalPagNo) {
				pageIndex++;
				class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
			}
		});
});
var setReaded = function(userId, classId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_setClassSpaceReadByUser({
		userId: userId,
		classId: classId
	}, wd, function(data) {
		console.log('是否已读：' + JSON.stringify(data));
		wd.close();
	})
}
var setListener = function(userId) {
	mui('.mui-table-view').on('tap', '.isNotLike', function() {
		var span=this;
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_setClassSpaceLikeByUser({
			userId:userId,
			classSpaceId:parseInt(this.getAttribute('tabId'))
		},wd,function(data){
			wd.close();
			console.log("点赞后返回数据："+JSON.stringify(data));
			if(data.RspData.Result==1){
				span.className="mui-icon iconfont icon-support isLike";
				console.log('更改是否已点赞状态'+span.className)
				span.innerText='('+(parseInt(span.innerText.replace('(','').replace(')',''))+1)+')'
			}else{
				mui.toast('点赞失败！')
			}
//			if(data.Rs)
		})
	})
}