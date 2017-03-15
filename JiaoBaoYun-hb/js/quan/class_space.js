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
		var wd = events.showWaiting();
		postDataPro_getClassSpacesByUserForClass(postData, wd, function(pagedata) {
			wd.close();
			if(pagedata.RspCode == 0 && pagedata.RspData.Data.length > 0) {
				console.log('获取的班级动态：' + JSON.stringify(pagedata));
				mod.totalPagNo = pagedata.RspData.TotalPage;
				list = pagedata.RspData.Data;
				callback();
			} else {
				if(pageIndex == 1) {
					mui.toast("暂无班级动态！");
				}

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
	var createInnerHtml = function(item, index) {
		console.log("加载的数据：" + JSON.stringify(item));
		var inner = '<div><div class="mui-pull-left head-img" >' +
			'<img class="head-portrait" headId="' + item.utid + '" src="' + getUImg(item.uimg) + '"/>' +
			'<p class="single-line">' + events.shortForString(getName(item), 6) + '</p>' +
			'</div>' +
			'<div class="chat_content_left">' +
			'<div class="chat-body"><p class="chat-words">' +
			item.MsgContent + '</p>' +
			createImgsInner(item, index) +
			'</div>' +
			'<p class="chat-bottom">' + events.shortForDate(item.PublishDate) +
			'<a href="#popover" tabId="' + item.TabId + '" class="mui-icon iconfont icon-support ' + setIsLike(item.IsLike) + '">(' + item.LikeCnt +
			')</a><span tabId="' + item.TabId + '" class="mui-icon iconfont icon-xianshi">(' + item.ReadCnt + ')</span></p>' +
			'</div></div>';
		return inner;
	}
	var getName = function(item) {
		if(item.bunick) {
			return item.bunick;
		}
		if(item.ugname) {
			return item.ugname;
		}
		if(item.unick) {
			return item.unick;
		}
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
			top: -1, //选择条数
			vvl: postData.classId.toString(), //群ID或IDS,查询的值,多个用逗号隔开
			vvl1: -1 //群员类型，0家长,1管理员,2老师,3学生,-1取全部
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
				postDataPro_PostUmk({ vvl: ids.toString() }, wd, function(remarkData) {
					console.log('获取的备注信息：' + JSON.stringify(remarkData));
					wd.close();
					if(remarkData.RspCode == 0) {
						var buData = remarkData.RspData;
						for(var i in list) {
							for(var j in buData) {
								if(list[i].utid == buData[j].butid) {
									jQuery.extend(list[i], buData[j]);
									break;
								}
							}
						}
					} else {
						console.log('没啥备注信息。')
					}
					var personIds = [];
					for(var i in list) {
						if(!list[i].ugname) {
							personIds.push(list[i].PublisherId);
						}
					}
					var realIds = events.arraySingleItem(personIds);
					requireInfos(realIds);
					//					setData();
				})

			} else {
				wd.close();
				console.log(pInfo.RspTxt);
			}

		})
	}
	/**
	 * 
	 * @param {Object} datasource
	 * @param {Object} pInfos
	 */
	var requireInfos = function(pInfos) {
		if(pInfos.length > 0) {
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
					rechargeInfos(data.RspData);
				} else {
					//				setChannelList(datas);
				}
			})
		} else {
			setData();
		}

	}
	var rechargeInfos = function(infos) {
		for(var i in list) {
			for(var j in infos) {
				if(list[i].PublisherId == infos[j].utid) {
					jQuery.extend(list[i], infos[j]);
				}
			}
		}
		setData();
	}
	var setData = function() {
		var container = document.getElementById('classSpace_list');
		for(var i in list) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = createInnerHtml(list[i], pageIndex * 10 + i);
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
	var createImgsInner = function(cell, index) {
		var imgInner = '';
		//		var percent = 0.00;
		var win_width = document.querySelector(".mui-table-view").offsetWidth;
		var img_width = (win_width - 20) * 0.7 / 3;
		if(cell.EncImgAddr) {
			var imgs = cell.EncImgAddr.split('|');
			var trueImgs = cell.EncAddr.split('|');
			console.log('要显示的图片地址：' + JSON.stringify(imgs));
			for(var i in imgs) {
				if(imgs.length <= 3 && imgs.length > 0) {
					//					percent = 100 / (imgs.length);
					imgInner += '<img src="' + imgs[i] + '" style="width:' + img_width + 'px; height:' + img_width + 'px;padding:2px;"' +
						'" data-preview-src="' + trueImgs[i] + '" data-preview-group="' + cell.PublishDate + index + '"/>'
				} else {
					imgInner += '<img src="' + imgs[i] + '" style="width:' + img_width + 'px; height:' + img_width + 'px;padding:2px;"' +
						'" data-preview-src="' + trueImgs[i] + '" data-preview-group="' + cell.PublishDate + index + '"/>'
				}
			}
		}
		console.log(imgInner);
		return imgInner;
	}
	return mod;
})(class_space || {});
var pageIndex = 1;
var pageSize = 10;
var postData;
//h5fresh.addPullUpFresh("#refreshContainer", function() {
//	mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex >= class_space.totalPagNo);
//	if(pageIndex < class_space.totalPagNo) {
//		pageIndex++;
//		class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
//	}
//})
mui.plusReady(function() {
	mui.previewImage();
	//	h5fresh.addRefresh(function() {
	//		events.clearChild(document.getElementById('classSpace_list'));
	//		pageIndex = 1;
	//		class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	//	}, { style: "circle" })
	postData = plus.webview.currentWebview().data;
	postData.userId = parseInt(postData.userId);
	events.preload('classSpace-persons.html', 200);
	setReaded(postData.userId, postData.classId);
	console.log('班级空间获取值：' + JSON.stringify(postData));
	class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	setListener(postData.userId);
	//更改个人信息，更新界面
	window.addEventListener('infoChanged', function() {
		mui('#refreshContainer').pullRefresh().refresh(true);
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
			var container = document.getElementById('classSpace_list');
			events.clearChild(container);
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
	mui('.mui-table-view').on('tap', '.head-portrait', function() {
		var id = this.getAttribute('headId');
		console.log(id);
		mui.openWindow({
			url: 'zone_main.html',
			id: 'zone_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: id,
				NoReadCnt: 0,
				flag: 0
			}

		});
	})
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
			zan.className = "mui-icon iconfont icon-dianzan";
		} else { //已点赞
			zan.isLike = true;
			zan.innerText = '取消点赞';
			zan.className = "mui-icon iconfont icon-quxiaozan";
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
				console.log('取消点赞获取的数据:' + JSON.stringify(data))
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
	var firstTime = null;

	mui('.mui-table-view').on('tap', '.icon-xianshi', function() {
		var secondTime = null;
		if(firstTime) {
			secondTime = '123456';
		} else {
			firstTime = '123';
		}
		setTimeout(function() {
			firstTime = null;
		}, 1000)
		console.log("第一次："+firstTime+"第二次："+secondTime);
		if(!secondTime) {
			events.fireToPageWithData('classSpace-persons.html', 'personsList', {
				type: 0,
				classSpaceId: parseInt(this.getAttribute('tabId')) //id
			});
		}

	})
}