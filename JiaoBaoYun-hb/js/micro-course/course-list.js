/**
 * 微课获取课程列表功能模块
 */
var course_list = (function(mod) {

	var courseList = [{
			courseImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRieEKK25qL6j9ppZ99Lu-Cm0rUYVZcch49NJpFJU1cdMF0Jv7l",
			courseName: "语文",
			courseInfo: "我的语文课程",
			IsFocused: true
		},
		{
			courseImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjJOlAGvl-iZyV6EbRbSOKCA8NBHJMx2oKMYJKwLr7n-EvWkrQ",
			courseName: "数学",
			courseInfo: "我的数学课程",
			IsFocused: false
		},
		{
			courseImg: "http://img06.tooopen.com/images/20160722/tooopen_sy_171298721947.jpg",
			courseName: "英语",
			courseInfo: "我的英语课程",
			IsFocused: false
		}
	]
	/**
	 * 获取数据
	 * @param {Int} pageIndex 页码
	 * @param {View} listContainer 放置数据的容器
	 * @param {Function} callback 回调
	 */
	mod.getData = function(pageIndex, listContainer, callback) {
		callback(pageIndex, courseList, listContainer);
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
			mod.createCell(cell, fragment);
		}
		listContainer.appendChild(fragment);
		mod.endFresh();
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
	}
	/**
	 * 
	 * @param {Object} cell
	 */
	mod.getCellInner = function(cell) {

		return '<div class="course-container">' +
			'<img class="course-img" src="' + cell.courseImg + '"/>' +
			'<div class="course-detail">' +
			'<div class="courseName-button">' +
			'<p class="coursre-name">' + cell.courseName + '</p>' +
			mod.getBtn(cell) +
			'</div>' +
			'<p class="course-info">' + cell.courseInfo + '</p>' +
			'</div>' +
			'</div>';

	}
	/**
	 * 获取按钮
	 * @param {Object} cell
	 */
	mod.getBtn = function(cell) {
		if(cell.IsFocused) {
			return '<input type="button" class="input-btn btn-focused" value="已关注"/>'
		}
		return '<input type="button" class="input-btn btn-unfocus" value="关注"/>'

	}
	/**
	 * 
	 */
	mod.initFresh = function() {
		//上拉下拉注册
		mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
			down: {
				callback: function() {
					freshContainer = this;
					oldPageIndex = pageIndex;
					freshFlag = 1;
					pageIndex = 1;
					wd = events.showWaiting(); //2.获取符合条件的专家信息
					mod.getData(pageIndex, document.getElementById("list-container"), mod.setData);
				}
			},
			up: {
				callback: function() {
					freshContainer = this;
					totalPage=100;
					console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPage);
					if(pageIndex < totalPage) {
						freshFlag = 2;
						wd = events.showWaiting();
						pageIndex++;
						mod.getData(pageIndex, document.getElementById("list-container"), mod.setData);
					} else {
						freshContainer.endPullUpToRefresh();
						mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
					}
				}
			}
		});
	}
	mod.endFresh = function() {
		events.closeWaiting();
		console.log("freshFlag:"+freshFlag);
		if(freshContainer) {
			console.log("freshContainer className"+freshContainer.className)
			if(freshFlag == 1) {
				console.log("走这吗？？？？？");
				freshContainer.endPullDownToRefresh();
				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
			} else if(freshFlag == 2) {
				freshContainer.endPullUpToRefresh();
			} else {
				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
			}
		}
		freshFlag = 0;
	}
	return mod;
})(course_list || {})