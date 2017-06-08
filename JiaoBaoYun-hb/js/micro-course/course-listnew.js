/**
 * 微课获取课程列表功能模块
 */
var course_listnew = (function(mod) {
	/**
	 * 获取数据
	 * @param {Int} pageIndex 页码
	 * @param {View} listContainer 放置数据的容器
	 * @param {Function} callback 回调
	 */
	mod.getData = function(flag, model, listContainer, callback) {
		//		console.log('pageFlag =' + pageFlag);
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid, //用户ID,登录用户
			pageIndex: model.pageIndex, //当前页数
			pageSize: 10 //每页记录数,传入0，获取总记录数
		};
		// 等待的对话框
		var wd = events.showWaiting();
		if(flag) { //关注0，全部1
			if(model.freshFlag == 0) { //刷新
				comData.pageIndex = '1';
			}
			//1.获取所有课程
			postDataMCPro_getAllCourses(comData, wd, function(data) {
				wd.close();
				console.log('1.获取所有课程:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
				if(data.RspCode == 0) {
					//总页数
					model.totalPage = data.RspData.totalPage;
					model.pageIndex++;
					if(model.freshFlag == 0) { //刷新
						model.courseArray = data.RspData.Data;
					} else { //加载更多
						//合并数组
						model.courseArray = model.courseArray.concat(data.RspData.Data);
					}

					callback(model.pageIndex, data.RspData.Data, listContainer);
				} else {
//					mui.toast(data.RspTxt);
					//					mod.endFresh();
				}
			});
		} else { //关注0，全部1
			//游客
			if(!events.getUtid()) {
				//游客关注的课程
				var focuseTemp = window.myStorage.getItem(window.storageKeyName.FOCUSECOURSES);
				if(focuseTemp == null || focuseTemp.length == 0) {
					if(plus.webview.currentWebview().isVisible()) {
						mui.toast('暂时还没有关注的课程');
					}
					return;
				}
				//所需参数
				var comData = {
					userId: personal.utid, //用户ID，登录用户
					courseIds: arrayToStr(focuseTemp), //课程ID，例如[1,2,3]
					pageIndex: model.pageIndex, //当前页数
					pageSize: '0' //每页记录数，传入0，获取总记录数
				};
				if(model.freshFlag == 0) { //刷新
					comData.pageIndex = '1';
				}
				//13.根据课程列表获取所有关注的课程
				postDataMCPro_getAllFocusCoursesByIds(comData, wd, function(data) {
					wd.close();
					console.log('13.根据课程列表获取所有关注的课程:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
					if(data.RspCode == 0) {
						//总页数
						model.totalPage = data.RspData.totalPage;
						model.pageIndex++;
						if(model.freshFlag == 0) { //刷新
							model.courseArray = data.RspData.Data;
						} else { //加载更多
							//合并数组
							model.courseArray = model.courseArray.concat(data.RspData.Data);
						}
						if(data.RspData.Data.length == 0) {
							mui.toast('没有数据');
						}
						callback(model.pageIndex, data.RspData.Data, listContainer);
					} else {
//						mui.toast(data.RspTxt);
					}
				});
				return;
			}
			var comData1 = {
				userId: personal.utid, //用户ID,登录用户
				pageIndex: model.pageIndex, //当前页数
				pageSize: '10' //每页记录数,传入0，获取总记录数
			};
			if(model.freshFlag == 0) { //刷新
				comData.pageIndex = '1';
			}
			//2.获取所有关注的课程
			postDataMCPro_getAllFocusCourses(comData1, wd, function(data) {
				wd.close();
				console.log('2.获取所有关注的课程:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
				if(data.RspCode == 0) {
					//总页数
					model.totalPage = data.RspData.totalPage;
					model.pageIndex++;
					if(model.freshFlag == 0) { //刷新
						model.courseArray = data.RspData.Data;
						if(data.RspData.Data.length == 0) {
							mui.toast('没有数据');
						}
					} else { //加载更多
						//合并数组
						model.courseArray = model.courseArray.concat(data.RspData.Data);
					}
					if(mui(".mui-table-view-cell").length < 10) {
						mui(".mui-pull-loading")[0].innerHTML = "";
					}
					callback(model.pageIndex, data.RspData.Data, listContainer);
				} else {
//					mui.toast(data.RspTxt);
					//					mod.endFresh();
				}
			});
		}

	};
	/**
	 * 放置数据
	 * @param {Int} pageIndex 页码
	 * @param {Object} data 要放置的数据
	 * @param {View} listContainer 放置数据的container
	 */
	mod.setData = function(pageIndex, data, listContainer) {
		if(pageIndex == 1) {
			listContainer.innerHTML = "";
		}
		var fragment = document.createDocumentFragment();
		for(i in data) {
			var cell = data[i];
			if(!events.getUtid()) { //游客获取本地登录
				if(parseInt(events.isExistInStorageArray(storageKeyName.FOCUSECOURSES, cell.TabId)[1]) >= 0) {
					cell.IsFocus = 1;
				}
			}
			mod.createCell(cell, fragment);
		}
		listContainer.appendChild(fragment);
		//		mod.endFresh();
	}
	/**
	 * 
	 * @param {Object} cell
	 * @param {Object} fragment
	 */
	mod.createCell = function(cell, fragment) {

		var li = document.createElement("li");
		li.className = "mui-table-view-cell";
		li.innerHTML = mod.getCellInner(cell);
		fragment.appendChild(li);
		li.info = cell;
		li.querySelector(".course-img").info = cell;
		li.querySelector(".coursre-name").info = cell;
		li.querySelector(".course-info").info = cell;
		li.querySelector(".input-btn").info = cell;
		if(!cell.IsUpdate) {
			li.querySelector(".red-circle").classList.add("display-none");
		}

	}
	/**
	 * 
	 * @param {Object} cell
	 */
	mod.getCellInner = function(cell) {

		return '<div class="course-container">' +
			'<div class="img-container"><img class="course-img" src="' + cell.CoursePic + '"/>' +
			'<span class="red-circle"></span></div>' +
			'<div class="course-detail">' +
			'<div class="courseName-button">' +
			'<p class="coursre-name single-line">' + cell.CourseName + '</p>' +
			mod.getBtn(cell) +
			'</div>' +
			'<p class="course-info double-line">' + cell.SecName + '</p>' +
			'</div>' +
			'</div>';

	}
	/**
	 * 获取按钮
	 * @param {Object} cell
	 */
	mod.getBtn = function(cell) {
		if(cell.IsFocus) {
			return '<button id="btn-focused" type="button" class="input-btn btn-focused">已关注</button>'
		}
		return '<button id="btn-focused" type="button" class="input-btn btn-unfocus">关注</button>'
	}
	/**
	 * 点击关注按钮
	 * @param {Object} model
	 */
	mod.clickFocuseBtn = function(item) {
		var model = item.info;
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		var statusTemp = 0;
		if(!model.IsFocus) {
			statusTemp = 1;
		}
		if(!events.getUtid()) {
			mod.changeBtnStatus(item, 1);
			return;
		}
		//所需参数
		var comData = {
			userId: personal.utid, //用户ID,登录用户
			courseId: model.TabId, //课程ID
			status: statusTemp //关注状态，0 不关注，1 关注
		};
		// 等待的对话框
		var wd = events.showWaiting();
		//6.设置对某个课程关注
		postDataMCPro_setCourseFocus(comData, wd, function(data) {
			wd.close();
			console.log('6.设置对某个课程关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) { //成功
				mod.changeBtnStatus(item);
				if (data.RspData.FocusCnt>0) {
					toggleAttendedPart(1);//0 删除关注 1 加载关注
				}else{
					toggleAttendedPart(0);//0 删除关注 1 加载关注
				}
			} else {
				mui.toast(data.RspTxt);
				//				mod.endFresh();
			}
		});
	}
	/**
	 * 改变按钮状态
	 * @param {Object} item
	 * @param {Object} type
	 */
	mod.changeBtnStatus = function(item, type) {
		if(item.info.IsFocus) {
			item.className = "input-btn btn-unfocus";
			item.innerText = "关注";
			if(type) {
				events.toggleStorageArray(storageKeyName.FOCUSECOURSES, item.info.TabId, 1);
				//游客关注的课程
				var focuseTemp = window.myStorage.getItem(window.storageKeyName.FOCUSECOURSES);
				if (focuseTemp.length==0||focuseTemp.length==null) {
					toggleAttendedPart(0);//0 删除关注 1 加载关注
				}
			}
		} else {
			item.className = "input-btn btn-focused";
			item.innerText = "已关注";
			if(type) {
				events.toggleStorageArray(storageKeyName.FOCUSECOURSES, item.info.TabId, 0);
				console.log("关注的课程：" + myStorage.getItem(storageKeyName.FOCUSECOURSES));
			}
			toggleAttendedPart(1);
		}
		item.info.IsFocus = !item.info.IsFocus;
	}
	/**
	 * 
	 */
	//	mod.initFresh = function() {
	//		//上拉下拉注册
	//		mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
	//			down: {
	//				callback: function() {
	//					freshContainer = this;
	//					oldPageIndex = pageIndex;
	//					freshFlag = 1;
	//					pageIndex = 1;
	//					wd = events.showWaiting(); //2.获取符合条件的专家信息
	//					mod.getData(pageIndex, document.getElementById("list-container"), mod.setData);
	//				}
	//			},
	//			up: {
	//				callback: function() {
	//					freshContainer = this;
	//					console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPage);
	//					if(pageIndex < totalPage) {
	//						freshFlag = 2;
	//						wd = events.showWaiting();
	//						//						pageIndex++;
	//						mod.getData(pageIndex, document.getElementById("list-container"), mod.setData);
	//					} else {
	//						freshContainer.endPullUpToRefresh();
	//						mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
	//					}
	//				}
	//			}
	//		});
	//	}
	//	mod.endFresh = function() {
	//		events.closeWaiting();
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
	mod.setListener = function() {
		//点击头像
		mui(".mui-slider").on("tap", ".course-img", function(e) {
			var item = e.target;
			mod.gotoCourseDetail(item);
		});
		//点击课程名称
		mui(".mui-slider").on("tap", ".course-name", function(e) {
			var item = e.target;
			mod.gotoCourseDetail(item);
		});
		//点击节次名
		mui(".mui-slider").on("tap", ".course-info", function(e) {
			var item = e.target;
			mod.gotoCourseDetail(item);
		});
		//点击关注按钮
		mui(".mui-slider").on("tap", ".input-btn", function(e) {
			var item = e.target;
			console.log("item.info:" + JSON.stringify(item.info));
			mod.clickFocuseBtn(item);
		});
	}
	mod.gotoCourseDetail = function(item) {
		item.disabled=true;
		jQuery(item).css("pointerEvents","none");
		mod.getRedCircle(item);
		events.singleWebviewInPeriod(item,'../micro-course/course_details.html',item.info);
	}
	mod.getRedCircle=function(item){
		console.log("当前item的className:"+item.className);
		if(!item.querySelector(".red-circle")){
			mod.getRedCircle(item.parentElement);
		}else{
			console.log("获取时的className:"+item.className);
			item.querySelector(".red-circle").classList.add("display-none");
		}
	}
	return mod;
})(course_listnew || {})