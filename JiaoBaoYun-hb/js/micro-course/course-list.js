/**
 * 微课获取课程列表功能模块
 */
var course_list = (function(mod) {
	/**
	 * 获取数据
	 * @param {Int} pageIndex 页码
	 * @param {View} listContainer 放置数据的容器
	 * @param {Function} callback 回调
	 */
	mod.getData = function(pageIndex, listContainer, callback) {

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
		var htmlInner = '';
		htmlInner += '<div class="course-container">' +
			'<img class="course-img" src="' + +'"/>' +
			'<div class="course-detail">' +
			'<div class="courseName-button">' +
			'<p class="coursre-name">' + +'</p>' +
			mod.getBtn() +
			'</div>' +
			'<p class="course-info">' + +'</p>' +
			'</div>' +
			'</div>'
	}
	/**
	 * 获取按钮
	 * @param {Object} cell
	 */
	mod.getBtn = function(cell) {
		if(cell.IsFocused) {
			return '<input class="input-btn btn-focused" value="已关注"/>'
		}
		return '<input class="input-btn btn-unfocus" value="关注"/>'

	}
	/**
	 * 
	 */
	mod.initFresh = function() {
		var setFresh = function() {
			//上拉下拉注册
			mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
				down: {
					callback: function() {
						freshContainer = this;
						oldPageIndex = pageIndex;
						freshFlag = 1;
						pageIndex = 1;
						wd = events.showWaiting(); //2.获取符合条件的专家信息
						mod.getData(pageIndex,document.getElementById("list-container"),mod.setData);
					}
				},
				up: {
					callback: function() {
						freshContainer = this;
						console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPage);
						if(pageIndex < totalPage) {
							freshFlag = 2;
							wd = events.showWaiting();
							pageIndex++;
							mod.getData(pageIndex,document.getElementById("list-container"),mod.setData);
						} else {
							freshContainer.endPullUpToRefresh();
							mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
						}
					}
				}
			});
			setFresh();
		}
	}
	return mod;
})(course_list || {})