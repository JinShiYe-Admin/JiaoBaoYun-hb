var class_space = (function(mod) {
	var list;
	var zanSpan;
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
					list = pagedata.RspData.Data;
					callback();
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
	mod.replaceUrl = function() {
			getUrlBrief();
			i = 0;
			createListView();
		}
		/**
		 * 获取Url信息
		 */
	var getUrlBrief = function() {
			if(i < list.length) {
				urlBrief.getUrlFromMessage(list[i].MsgContent, function(message) {
					list[i].MsgContent = message;
					i++;
					getUrlBrief();
				})
			}

		}
		/**
		 * 
		 * @param {Object} list
		 */
	var createListView = function() {
			if(list.length > 0) {
				console.log('总页码：' + mod.totalPagNo);
				imgsize = 0;
				var utids = [];
				for(var i in list) {
					utids.push(list[i].PublisherId);
				}
				console.log('')
				getPersonalImg(utids.toString());
				//				
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
			'<img class="head-portrait" src="' + getUImg(item.uimg) + '"/>' +
			'<p class="single-line">' + events.shortForString(item.bunick?item.bunick:item.ugname, 6) + '</p>' +
			'</div>' +
			'<div class="chat_content_left">' +
			'<div class="chat-body"><p class="chat-words">' +
			item.MsgContent + '</p>' +
			createImgsInner(item) +
			'</div>' +
			'<p class="chat-bottom">' + events.shortForDate(item.PublishDate) +
			'<a href="#popover" tabId="' + item.TabId + '" class="mui-icon iconfont icon-support ' + setIsLike(item.IsLike) + '">(' + item.LikeCnt + 
			')</a><span tabId="' + item.TabId +'" class="mui-icon iconfont icon-xianshi">(' + item.ReadCnt + ')</span></p>' +
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
	var imgsize = 0;
	var getPersonalImg = function(ids) {
		var comData = {
			top: -1,//选择条数
			vvl: postData.classId.toString(),//群ID或IDS,查询的值,多个用逗号隔开
			vvl1:-1//群员类型，0家长,1管理员,2老师,3学生,-1取全部
		};
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
		postDataPro_PostGusers(comData, wd, function(pInfo) {
			console.log('获取的个人信息:' + JSON.stringify(pInfo))
//			wd.close();
			if(pInfo.RspCode == '0000') {
				var personalData = pInfo.RspData;
				for(var i in list) {
					for(var j in personalData) {
						if(list[i].PublisherId == personalData[j].utid) {
							jQuery.extend(list[i], personalData[j]);
							break;
						}
					}
				}
				postDataPro_PostUmk({vvl:ids.toString()},wd,function(remarkData){
					console.log('获取的备注信息：'+JSON.stringify(remarkData));
					wd.close();
					if(remarkData.RspCode==0){
						var buData=remarkData.RspData;
						for(var i in list){
							for(var j in buData){
								if(list[i].utid==buData[i].butid){
									jQuery.extend(list[i],buData[i]);
									break;
								}
							}
						}
					}else{
						console.log('没啥备注信息。')
					}
					setData();
				})
				
			} else {
				wd.close();
				console.log(pInfo.RspTxt);
			}

		})
	}
	var setData = function() {
		var container = document.getElementById('classSpace_list');
		for(var i in list) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = createInnerHtml(list[i]);
			container.appendChild(li);
		}
	}
	var getUImg = function(uimg) {
			if(!uimg || uimg == null) {
				uimg = storageKeyName.DEFAULTPERSONALHEADIMAGE;
			}
			return uimg;
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
var postData
mui.plusReady(function() {
	postData = plus.webview.currentWebview().data;
	postData.userId = parseInt(postData.userId);
	events.preload('classSpace-persons.html',200);
	setReaded(postData.userId, postData.classId);
	console.log('班级空间获取值：' + JSON.stringify(postData));
	class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	setListener(postData.userId);
	//更改个人信息，更新界面
	window.addEventListener('infoChanged', function() {
			pageIndex = 1;
			setReaded(postData.userId, postData.classId);
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
		if(data.RspCode == 0) {
			var main = plus.webview.getWebviewById('../quan/tab-zone.html');
			//触发tab-zone页面的setRead事件
			mui.fire(main, 'setRead', {
				flag: 2
			});
		}
	})
}
var setListener = function(userId) {
	var zan = document.getElementById('zan');
	/**
	 * 未点赞按钮点击事件
	 */
	mui('.mui-table-view').on('tap', '.icon-support', function() {
		zanSpan = this;
		//未点赞
		if(jQuery(this).hasClass('isNotLike')) {
			zan.isLike = false;
			zan.innerText = '点赞';
			zan.className="mui-icon iconfont icon-dianzan";
		} else { //已点赞
			zan.isLike = true;
			zan.innerText = '取消点赞';
			zan.className="mui-icon iconfont icon-quxiaozan";
		}
	
	})

	//点赞
	document.getElementById('zan').addEventListener('tap', function() {
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			if(this.isLike) {
				postDataPro_delClassSpaceLikeByUser({
					userId: userId,
					classSpaceId: parseInt(zanSpan.getAttribute('tabId'))
				}, wd, function(data) {
					wd.close();
					console.log('取消点赞获取的数据:'+JSON.stringify(data))
					if(data.RspData.Result == 1) {
						mui.toast('您已取消点赞');
						zanSpan.className = "mui-icon iconfont icon-support isNotLike";
						console.log('更改是否已点赞状态' + zanSpan.className)
						zanSpan.innerText = '(' + (parseInt(zanSpan.innerText.replace('(', '').replace(')', '')) - 1) + ')'
					} else {
						mui.toast('取消点赞失败！')
					}
					mui('.mui-popover').popover('toggle');
				})
			} else {
				postDataPro_setClassSpaceLikeByUser({
					userId: userId,
					classSpaceId: parseInt(zanSpan.getAttribute('tabId'))
				}, wd, function(data) {
					wd.close();
					console.log("点赞后返回数据：" + JSON.stringify(data));
					if(data.RspData.Result == 1) {
						mui.toast('点赞成功！')
						zanSpan.className = "mui-icon iconfont icon-support isLike";
						console.log('更改是否已点赞状态' + zanSpan.className)
						zanSpan.innerText = '(' + (parseInt(zanSpan.innerText.replace('(', '').replace(')', '')) + 1) + ')'
					} else {
						mui.toast('点赞失败！')
					}
						mui('.mui-popover').popover('toggle');
				})
			}

		})
		//查看
	document.getElementById('check').addEventListener('tap', function() {
		events.fireToPageWithData('classSpace-persons.html', 'personsList', {
			type: 1,
			classSpaceId: parseInt(zanSpan.getAttribute('tabId'))
		})
		mui('.mui-popover').popover('toggle');
	})
	mui('.mui-table-view').on('tap','.icon-xianshi',function(){
		events.fireToPageWithData('classSpace-persons.html', 'personsList', {
			type: 0,
			classSpaceId: parseInt(this.getAttribute('tabId'))//id
		})
	})
}