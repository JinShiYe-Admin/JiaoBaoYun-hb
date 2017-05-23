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
		mod.wd = events.showWaiting();
		postDataPro_getClassSpacesByUserForClass(postData,mod.wd, function(pagedata) {
			//			wd.close();
			if(pagedata.RspCode == 0 && pagedata.RspData.Data.length > 0) {
				console.log('获取的班级动态：' + JSON.stringify(pagedata));
				mod.totalPagNo = pagedata.RspData.TotalPage;
				list = pagedata.RspData.Data;
				if(pageIndex == 1) {
					setReaded(postData.userId, postData.classId, mod.wd);
				}
				callback();
			} else {
				mod.wd.close();
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
	mod.replaceUrl = function() {
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
			'<img class="head-portrait" headId="' + item.utid + '" src="' + updateHeadImg(item.uimg, 2) + '"/>' +
			'<p class="single-line">' + events.shortForString(getName(item), 6) + '</p>' +
			'</div>' +
			'<div class="chat_content_left">' +
			'<div class="chat-body">' + '<p class="chat-words">' +
			item.MsgContent.replace(/ /g, "&nbsp").replace(/\n/g, "<br/>") + '</p><div class="class-imgs">' +
			createImgsInner(item, index) +
			'</div></div>' +
			'<p class="chat-bottom">' + events.shortForDate(item.PublishDate) +
			'<a href="#popover" tabId="' + item.TabId + '" class="bottom-zan mui-icon iconfont icon-support ' + setIsLike(item.IsLike) + '">(' + item.LikeCnt +
			')</a><span tabId="' + item.TabId + '" class="bottom-chakan mui-icon iconfont icon-chakan">(' + item.ReadCnt + ')</span></p>' +
			'</div></div>';
		console.log("加载的数据：" + inner);
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
		//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
		postDataPro_PostGusers(comData, mod.wd, function(pInfo) {
			console.log('获取的个人信息:' + JSON.stringify(pInfo))
			//			wd.close();
			if(pInfo.RspCode == '0000') {
				var personalData = pInfo.RspData;
				for(var i in list) {
					for(var j in personalData) {
						if(list[i].PublisherId == personalData[j].utid && (personalData[j].mstype == 1 || personalData[j].mstype == 2)) {
							jQuery.extend(list[i], personalData[j]);
							break;
						}
					}
				}
				postDataPro_PostUmk({
					vvl: ids.toString()
				}, mod.wd, function(remarkData) {
					console.log('获取的备注信息：' + JSON.stringify(remarkData));
					//					wd.close();
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
				})

			} else {
				mod.wd.close();
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
			//			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			postDataPro_PostUinf(tempData, mod.wd, function(data) {
				//				wd.close();
				console.log('获取的个人信息:' + JSON.stringify(data));
				if(data.RspCode == 0) {
					rechargeInfos(data.RspData);
				} else {
					setData();
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
		//		var fragment=document.createDocumentFragment();
		for(var i in list) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = createInnerHtml(list[i], pageIndex * 10 + i);
			container.appendChild(li);
			var classWords_container = li.querySelector(".chat-words");
			if(getLineNo(classWords_container) > 8) {
				classWords_container.className = "chat-words omit-line-8"
				//				classWords_container.style.webkitLineClamp="8";
				var more_span = document.createElement('span');
				more_span.className = "more-span";
				more_span.innerText = "展开全部";
				//				more_span.addEventListener("tap", function() {
				//
				//				})
				li.querySelector(".chat-body").insertBefore(more_span, li.querySelector(".class-imgs"));
			}
			if(li.querySelector(".video-container")) {
				li.querySelector(".video-container").info = list[i];
			}
			classWords_container.info = list[i];
		}
		mod.wd.close();
		//		container.appendChild(fragment);
	}
	var getLineNo = function(classWords_container) {
		var style = window.getComputedStyle(classWords_container, null);
		var h = parseInt(style.height);
		var lh = parseInt(style.lineHeight);
		var ln = parseInt(h / lh);
		console.log("当前行数：" + ln);
		return ln;
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
		console.log('图片宽度：' + img_width);
		if(cell.EncImgAddr) {
			var imgs = cell.EncImgAddr.split('|');
			var trueImgs = cell.EncAddr.split('|');
			console.log('要显示的图片地址：' + JSON.stringify(imgs));
			if(cell.EncType == 1) {
				for(var i in imgs) {
					if(imgs.length <= 3 && imgs.length > 0) {
						//					percent = 100 / (imgs.length);
						imgInner += '<img class="display-inlineBlock" src="' + imgs[i] + '" style="width:' + img_width + 'px; height:' + img_width + 'px;padding:0 2px;"' +
							' data-preview-src="' + trueImgs[i] + '" data-preview-group="' + cell.PublishDate + index + '"/>'
					} else {
						imgInner += '<img class="display-inlineBlock" src="' + imgs[i] + '" style="width:' + img_width + 'px; height:' + img_width + 'px;padding:0 2px;"' +
							' data-preview-src="' + trueImgs[i] + '" data-preview-group="' + cell.PublishDate + index + '"/>'
					}
				}
			} else if(cell.EncType == 2) {
				imgInner += '<div class="video-container"  style="width:' + img_width * 3 + 'px;height:' + img_width * 3 * 0.6 + 'px;margin-bottom:8px;background-image:url(' + imgs[0] + ');background-color:#101010; background-position:center;background-size:auto 120%;background-repeat:no-repeat;">' +
					'<img src="../../image/utils/playvideo.png" style="width:36px;height:36px;margin:' + (img_width * 3 * 0.6 - 36) / 2 + 'px ' + (img_width * 3 - 36) / 2 + 'px;"/>' + '</div>'
			}

		}
		console.log(imgInner);
		return imgInner;
	}

	return mod;
})(class_space || {});

function videoImgOnload(event) {
	var img = event.target;
	var imgWidth = img.naturalWidth;
	var imgHeight = img.naturalHeight;
	console.log("图片的宽度和高度：" + imgWidth + "高度：" + imgHeight);
	if(imgWidth >= imgHeight) {
		img.style.width = img.width + "px";
		img.style.height = img.height + "px";
	} else {
		img.style.width = img.width / 2 + "px";
		img.style.height = "initial";
		img.style.top = -(img.height - img.width) / 4 + "px";
		img.style.bottom = -(img.height - img.width) / 4 + "px";
		img.style.left = img.width / 4 + "px";
	}
}
mui.init();
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true //是否显示滚动条

});
var setFresh = function() {
	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				var self = this;
				//清除节点

				pageIndex = 1;
				var container = document.getElementById('classSpace_list');
				events.clearChild(container);
				class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);

				setTimeout(function() {
					//结束下拉刷新
					self.endPullDownToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "上拉显示更多";
				}, 1000);
			}
		},
		up: {
			callback: function() {
				var self = this;
				//5.获取某个问题的详情
				if(pageIndex < class_space.totalPagNo) {
					setTimeout(function() {
						self.endPullUpToRefresh();
					}, 1000);
					pageIndex++;
					class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
				} else {
					self.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}

			}
		}
	});
}
setFresh();
var pageIndex = 1;
var pageSize = 10;
var postData;
var wd;
var className;
mui.plusReady(function() {
	mui.previewImage();
	postData = plus.webview.currentWebview().data;
	postData.userId = parseInt(postData.userId);
	//班级名称
	className = plus.webview.currentWebview().className;
	document.getElementById('title').innerText = getHeadText(className);
	events.preload('class-group.html');
	events.preload('classSpace-persons.html', 200);
	var write = document.getElementById('write');
	console.log('班级空间：' + JSON.stringify(postData));
	getUserInGroup(-1, postData.classId, function(data) {
		groupRoles = data;
		write.style.display = 'none';
		console.log('获取本人在群的所有信息：' + JSON.stringify(data));
		for(var i in groupRoles) {
			if(groupRoles[i].mstype == 2 || groupRoles[i].mstype == 1) {
				write.style.display = 'inline-block';
				break;
			}
		}
	});
	console.log('班级空间获取值：' + JSON.stringify(postData));
	class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	setListener(postData.userId);
	//更改个人信息，更新界面
	window.addEventListener('infoChanged', function() {
		mui('#refreshContainer').pullRefresh().refresh(true);
		pageIndex = 1;
		//		setReaded(postData.userId, postData.classId);
		var container = document.getElementById('classSpace_list');
		container.innerHTML = "";
		class_space.getList(postData, pageIndex, pageSize, class_space.replaceUrl);
	})
	//	h5fresh.addRefresh(function() {
	//
	//	}, {
	//		offset: "45px",
	//		style: "circle"
	//	});
	//	h5fresh.addPullUpFresh("#refreshContainer", function() {
	//		mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex >= class_space.totalPagNo);
	//
	//	});
	var firstTime = null;
	mui('.mui-table-view').on('tap', '.head-portrait', function() {
		//		console.log(id);
		var secondTime = null;
		if(firstTime) {
			secondTime = "123456";
		} else {
			firstTime = "123";
		}
		setTimeout(function() {
			firstTime = null;
		}, 1000)
		console.log("firstTime:" + firstTime + "secondTime:" + secondTime);
		if(!secondTime) {
			var id = this.getAttribute('headId');
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
		}
	})
	/**
	 * 视频点击事件
	 */
	mui(".mui-table-view").on("tap", ".video-container", function() {
		var item = this;
		item.disabled = true;
		var videoInfo = this.info;
		video.playVideo(videoInfo.EncAddr, videoInfo.EncImgAddr, function() {
			item.disabled = false;
		})
	})
});
/**
 * 获取用户在群组中的信息
 * @param {Object} mstype
 * @param {Object} callback
 */
var getUserInGroup = function(mstype, groupId, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGuI({
		vvl: groupId,
		vtp: mstype
	}, wd, function(data) {
		wd.close()
		console.log('用户在群的身份 ' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			callback(data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
//获取标题栏名称
var getHeadText = function(className) {
	if(className.length > 8) {
		className = className.substring(0, 10) + '...'
	}
	return className;
}
var setReaded = function(userId, classId, wd) {
	//	var wd1 = events.showWaiting();
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

/**
 * 增回单条数据
 */
var addSingleDynamic = function() {
	if(pageIndex < class_space.totalPagNo) {
		class_space.getList(postData, pageIndex * 10, 1, class_space.replaceUrl);
	}
}
var setListener = function(userId) {
	events.addTap('write', function() {
		events.openNewWindowWithData('class-dynamic.html', postData)
	})
	//群组按钮点击事件
	events.addTap('group', function() {
		events.showWaiting();
		setTimeout(function() {
			events.fireToPageWithData('class-group.html', 'postGroupInfo', {
				classId: postData.classId,
				className: className
			});
			events.closeWaiting();
		}, 1000);
	})
	var zan = document.getElementById('zan');
	/**
	 * 未点赞按钮点击事件
	 */
	mui('.mui-table-view').on('tap', '.icon-support', function() {
		zanSpan = this;
		//未点赞
		if(jQuery(this).hasClass('isNotLike')) {
			zan.isLike = false;
			console.log("赞的innerHTML" + zan.innerHTML);
			zan.querySelector(".pop-p").innerHTML = '<span id="pop-zan" class="mui-icon iconfont icon-dianzan1 isNotLike"></span>点赞';
		} else { //已点赞
			zan.isLike = true;
			zan.querySelector(".pop-p").innerHTML = '<span id="pop-zan" class="mui-icon iconfont icon-dianzan1 isLike"></span>取消点赞';
		}

	})
	mui('.mui-table-view').on('tap', ".more-span", function() {
		this.previousSibling.className = "chat-words";
		this.className = "less-span";
		//		this.style.display="none";
		this.innerText = "收回";
	})
	mui('.mui-table-view').on('tap', ".less-span", function() {
		console.log("当前父页面的className:" + this.parentElement.parentElement.parentElement.parentElement.className)
		var parent_cell = this.parentElement.parentElement.parentElement.parentElement;
		var offTopHeight = parent_cell.offsetTop;
		this.previousSibling.className = "chat-words omit-line-8";
		this.className = "more-span";
		this.innerText = "展开全部";
		window.scrollTo(0, offTopHeight, 200);
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
					//					mui.toast('您已取消点赞');
					zanSpan.className = "bottom-zan mui-icon iconfont icon-support isNotLike";
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
					//					mui.toast('点赞成功！')
					zanSpan.className = "bottom-zan mui-icon iconfont icon-support isLike";
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
			classSpaceId: parseInt(zanSpan.getAttribute('tabId')),
			classId: postData.classId //id
		})
		mui('.mui-popover').popover('toggle');
	})
	var firstTime = null;

	mui('.mui-table-view').on('tap', '.icon-chakan', function() {
		var secondTime = null;
		if(firstTime) {
			secondTime = '123456';
		} else {
			firstTime = '123';
		}
		setTimeout(function() {
			firstTime = null;
		}, 1000);
		console.log("第一次：" + firstTime + "第二次：" + secondTime);
		if(!secondTime) {
			events.fireToPageWithData('classSpace-persons.html', 'personsList', {
				type: 0,
				classSpaceId: parseInt(this.getAttribute('tabId')),
				classId: postData.classId //id
			});
		}

	})
}