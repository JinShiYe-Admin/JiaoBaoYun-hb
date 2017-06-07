var show_listnew = (function(mod) {
	mod.getShowList = function(showCity, listContainer, callback) {
		if(showCity.pageIndex == 1) {
			listContainer.innerHTML = "";
		}
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
//		var wd = events.showWaiting();
		if(showCity.pageFlag == 0) { //关注
			console.log('关注界面拉');
			//81.（用户空间）获取用户所有关注的用户
			if(personal.utid == 0) {
				var showfocusperson = window.myStorage.getItem(window.storageKeyName.SHOWFOCUSEPERSEN);
				//74.(用户空间）获取多用户空间所有用户动态列表
				getAllUserSpacesByUser(showCity, showfocusperson, listContainer, callback);
			} else {
				getFocusByUser(showCity, listContainer, callback);
			}
		} else { //全部
			var wd = events.showWaiting();
			/**
			 * 78.（用户空间）获取区域用户空间列表
			 */
			postDataPro_getUserSpacesByArea({
				userId: personal.utid, //用户ID
				area: '0', //区域
				pageIndex: showCity.pageIndex, //当前页数
				pageSize: 6 //每页记录数
			}, wd, function(data) {
				events.closeWaiting();
				console.log('78.（用户空间）获取区域用户空间列表：' + JSON.stringify(data));
				if(data.RspCode == 0) {
					//总页数
					totalPage = data.RspData.TotalPage;
					showCity.pageIndex++;
					mod.getUserInfo(data.RspData.Data, function(tempData) {
						callback(showCity, listContainer, tempData);
					});
				} else {
					mui.toast(data.RspTxt);
				}
			})
		}
	}
	mod.getUserInfo = function(tempRspData, callback) {
		//获取当前回调留言的个人信息，主要是头像、昵称
		var tempArray = [];
		//先遍历回调数组，获取
		for(var item in tempRspData) {
			//当前循环的model
			var tempModel0 = tempRspData[item];
			if(tempModel0.EncImgAddr.length == 0 || tempModel0.EncImgAddr == null) {
				if(item == 0) { //第一张默认给大图片
					tempModel0.EncImgAddr = '../../image/show/show-default-large.png';
				} else {
					tempModel0.EncImgAddr = '../../image/show/show-default-small.png';
				}
			}
			tempModel0.PublishDate = modifyTimeFormat(tempModel0.PublishDate);
			//将当前model中id塞到数组
			tempArray.push(tempModel0.PublisherId);
		}
		//给数组去重
		tempArray = arrayDupRemoval(tempArray);
		//发送获取用户资料申请
		var tempData = {
			vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
			vtp: 'g' //查询类型,p(个人)g(id串)
		}
		var wd = events.showWaiting();
		//21.通过用户ID获取用户资料
		postDataPro_PostUinf(tempData, wd, function(data1) {
			wd.close();
			console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
			if(data1.RspCode == 0) {
				for(var item in tempRspData) {
					//当前循环的model
					var tempModel0 = tempRspData[item];
					//循环当前的个人信息返回值数组
					for(var i in data1.RspData) {
						//当前model
						var tempModel = data1.RspData[i];
						//对比id是否一致
						if(tempModel0.PublisherId == tempModel.utid) {
							//合并
							tempModel0 = $.extend(tempModel0, tempModel);
						}
					}
				}
			}
			console.log('循环遍历后的值：' + JSON.stringify(tempRspData));
			callback(tempRspData);
		});
	}
	//81.（用户空间）获取用户所有关注的用户
	function getFocusByUser(showCity, listContainer, callback) {
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid //用户ID
		};
		var wd = events.showWaiting();
		//81.（用户空间）获取用户所有关注的用户
		postDataPro_getFocusByUser(comData, wd, function(data) {
			console.log('81.（用户空间）获取用户所有关注的用户：' + JSON.stringify(data));
			wd.close();
			if(data.RspCode == 0) {
				var tempID = [];
				for(var i in data.RspData.Users) {
					var tempModel = data.RspData.Users[i];
					tempID.push(tempModel.UserId);
				}
				console.log('tempID=', tempID);
				//74.(用户空间）获取多用户空间所有用户动态列表
				if(tempID.length > 0) {
					getAllUserSpacesByUser(showCity, tempID, listContainer, callback);
				}
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}
	//74.(用户空间）获取多用户空间所有用户动态列表
	function getAllUserSpacesByUser(showCity, paraModel, listContainer, callback) {
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid, //用户ID,登录用户
			publisherIds: arrayToStr(paraModel), //发布者ID,例如[1,2,3]
			pageIndex: showCity.pageIndex, //当前页数
			pageSize: 6 //每页记录数
		};
		// 等待的对话框
		var wd1 = events.showWaiting();
		postDataPro_getUserSpacesForAreaByIds(comData, wd1, function(data) {
			wd1.close();
			console.log('74.(用户空间）获取多用户空间所有用户动态列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				showCity.pageIndex++;
				totalPage = data.RspData.totalPage;
				mod.getUserInfo(data.RspData.Data, function(tempData) {
					showArray = tempData;
					callback(showCity, listContainer, tempData);
				});
			} else {
				mui.toast(data.RspTxt);
			}

		});
	}
	mod.setShowList = function(showCity, listContainer, showData) {
		var div = document.createElement("div");
		div.className = "cityNews-container mui-card";
		var listDiv = document.createElement("div");
		listDiv.className = "mui-table-view";
		for(var i in showData) {
			var subDiv = document.createElement("li");
			subDiv.className = "mui-table-view-cell news-container";
			subDiv.innerHTML = mod.getShowInner(showData[i]);
			listDiv.appendChild(subDiv);
			div.appendChild(listDiv);
			subDiv.info = showData[i];
		}
		listContainer.appendChild(div);
		console.log("listContainer.innerHTML:" + listContainer.innerHTML);
		//		mod.endFresh();
	}
	mod.getShowInner = function(data) {
		return '<img class="news-img" src="' + data.EncImgAddr + '"/><div class="news-words"><p class="news-title single-line">' + data.MsgTitle + '</p>' +
			'<div class="anthor-date"><p class="news-anthor single-line">' + data.unick + '</p><p class="news-date">' + data.PublishDate + '</p></div></div>'
	}
	mod.initFresh = function() {
		mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
			down: {
				callback: function() {
					freshContainer = this;
					oldPageIndex = showCity.pageIndex;
					freshFlag = 1;
					showCity.pageIndex = 1;
					wd = events.showWaiting(); //2.获取符合条件的专家信息
					mod.getShowList(showCity, document.getElementById("list-container"), mod.setShowList);
				}
			},
			up: {
				callback: function() {
					freshContainer = this;
					if(showCity.pageIndex < totalPage) {
						freshFlag = 2;
						wd = events.showWaiting();
						mod.getShowList(showCity, document.getElementById("list-container"), mod.setShowList);
					} else {
						freshContainer.endPullUpToRefresh();
						mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
					}
				}
			}
		});
	}
	//	mod.endFresh = function() {
	//		events.closeWaiting();
	//		console.log("freshFlag:" + freshFlag);
	//		if(freshContainer) {
	//			console.log("freshContainer className" + freshContainer.className)
	//			if(freshFlag == 1) {
	//				console.log("走这吗？？？？？");
	//				freshContainer.endPullDownToRefresh();
	//				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
	//			} else if(freshFlag == 2) {
	//				freshContainer.endPullUpToRefresh();
	//			} else {
	//				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
	//			}
	//		}
	//		freshFlag = 0;
	//	}
	mod.setListListener = function() {
		mui(".mui-slider-group").on("tap", ".news-container", function(e) {
			this.disabled = true;
			events.singleWebviewInPeriod(this, "../quan/space-detail.html", this.info);
		})
	}
	return mod;
})(show_listnew || {})