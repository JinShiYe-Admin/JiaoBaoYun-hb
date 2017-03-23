(function($) {
	$.init();
	//阻尼系数
	//	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	var detailReady = false;
	var areaReady = false;
	var newsDetail;
	var choseContainer; //选择
	var curAreaInfo;
	var pageIndex = 1; //请求页码
	var checkType = "-1"; //类型
	var newsData = {}; //新闻数据
	var newsPage = {}; //新闻页码信息;
	//滚动参数
	$('.mui-scroll-wrapper').scroll({
		//		bounce: false,
		indicators: true, //是否显示滚动条
		//		deceleration: deceleration
	});
	$.plusReady(function() {
		events.preload("news-detail.html", 200);
		events.preload("area-choose.html");
		choseContainer = document.getElementById("choose-area");
		choseContainer.value = 0;
		curAreaInfo = {
			"acode": "000000",
			"aname": "全国",
			"atype": 0
		}
		//获取数据
		requestAreaNews();
		/**
		 * 获取选择的地区监听
		 */
		window.addEventListener("choseArea", function(e) {
			console.log("获取选中的城市：" + JSON.stringify(e.detail));
			if(e.detail.acode != curAreaInfo.acode) {
				curAreaInfo = e.detail;
				clearAll();
				setCurArea();
				requestAreaNews();
			}
		})
		//清空所有控件
		var clearAll = function() {
			pageIndex = 1;
			newsData = {};
			newsPage = {};
			document.getElementById("all-list").innerHTML = "";
			document.getElementById("uncheck-list").innerHTML = "";
			document.getElementById("passed-list").innerHTML = "";
			document.getElementById("unpass-list").innerHTML = "";
		}
		/**
		 * 子页面加载完成事件
		 */
		window.addEventListener("subReady", function(e) {
			console.log("监听子页面预加载完成");
			if(e.detail) {
				areaReady = true;
			} else {
				detailReady = true;
			}
		})
		setListener();
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							ul.appendChild(createFragment(ul, index, 5));
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
	/**
	 * 获取新新闻信息
	 */
	var requestAreaNews = function() {
		var areaCode;
		if(curAreaInfo.acode.substring(2, 6) == 0) {
			areaCode = curAreaInfo.acode.substring(0, 2);
		} else {
			areaCode = curAreaInfo.acode.substring(0, 4);
		}
		if(areaCode == 0) {
			areaCode = "";
		}
		var options = {
			top: 10, //每页行数
			vvl: areaCode, //查询的区域代码,省份截取城市代码前两位,城市截取城市代码的前4位
			vvl1: pageIndex, //页码,获取第几页
			vvl2: checkType, //审核状态,审核状态,0未审,1已审,2拒绝,全部-1
			vvl3: '' //标题模拟查询,标题模拟字符,可留空字符
		};
		var wd = events.showWaiting();
		postDataPro_PostTnewsC(options, wd, function(data) {
			wd.close();
			console.log("获取的城市新闻：" + JSON.stringify(data));
			if(data.RspCode == 0) {
				if(pageIndex == 1) { //第一页
					newsData[checkType] = data.RspData.dt;
				} else {
					newsData[checkType] = newsData[checkType].concat(data.RspData.dt);
				}
				setNewsData(data.RspData.dt)
				newsPage[checkType] = data.RspData.pg;
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}
	/**
	 * 放置数据
	 * @param {Object} data
	 */
	var setNewsData = function(data) {
		console.log("要放置的城市数据：" + JSON.stringify(data) + ";当前类型：" + checkType);
		var list_container;
		switch(checkType) {
			case "-1":
				console.log('-1')
				list_container = document.getElementById("all-list")
				break;
			case "0":
				list_container = document.getElementById("uncheck-list");
				break;
			case "1":
				list_container = document.getElementById("passed-list");
				break;
			case "2":
				list_container = document.getElementById("unpass-list");
				break;
			default:
				break;
		}
		for(var i in data) {
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.innerHTML = createInner(data[i]);
			console.log(li.innerHTML);
			list_container.appendChild(li);
			li.querySelector(".news-container").newsInfo = data[i];
		}
	}
	/**
	 * 
	 * @param {Object} item
	 */
	var createInner = function(item) {
		var inner = '<div class="list-news"><div class="news-container">' + getImgs(item) +
			'<div class="news-words"><p class="words-title">' + item.title +
			'</p><p class="words-info">' + item.tips + '</p></div></div><div class="check-container">' + setCheckButton(item) + '</div></div>'
		return inner;
	}
	var setCheckButton = function(item) {
		var inner;
		switch(item.Ischeck) {
			case 0:
				inner = '<input class="check-button" type="button" value="审核"/>'
				break;
			case 1:
				inner = '<input class="passed-button" type="button" value="已通过"/>'
				break;
			case 2:
				inner = '<input class="refused-button" type="button" value="已拒绝"/>'
				break;
			default:
				break;
		}
		return inner;
	}
	var getImgs = function(item) {
		if(item.timgs) {
			var imgs = item.timgs.split("|");
			return '<img class="news-img" src="' + imgs[0] + '"/>';
		}
		return '';
	}
	/**
	 * 放置当前城市
	 */
	var setCurArea = function() {
		document.getElementById("choose-area").innerHTML = curAreaInfo.aname + '<span class="mui-icon mui-icon-arrowdown"></span>';
	}
	/**
	 * 
	 * @param {Object} ul
	 * @param {Object} index
	 * @param {Object} count
	 * @param {Object} reverse
	 */
	var createFragment = function(ul, index, count, reverse) {
		var length = ul.querySelectorAll('li').length;
		var fragment = document.createDocumentFragment();
		var li;
		//						for (var i = 0; i < count; i++) {
		//							li = document.createElement('li');
		//							li.className = 'mui-table-view-cell';
		//							li.innerHTML = '第' + (index + 1) + '个选项卡子项-' + (length + (reverse ? (count - i) : (i + 1)));
		//							fragment.appendChild(li);
		//						}
		return fragment;
	};
	/**
	 * 设置监听
	 */
	var setListener = function() {
		//		mui(".mui-table-view").on('tap', "", function() {
		//			
		//		})
		events.addTap("choose-area", function() {
			openPrePage();
		})
		mui(".mui-scroll-wrapper").on("tap", ".mui-control-item", function() {
			checkType = this.getAttribute("value");
			if(!newsData[checkType]) {
				pageIndex = 1;
				requestAreaNews();
			}
		})
		mui(".mui-table-view").on("tap", ".news-container", function() {
			newsDetail = this.newsInfo;
			sendMessageToPre();
		})
		mui(".mui-table-view").on("tap", ".check-button", function() {
			newsDetail = this.parentElement.parentElement.querySelector(".news-container").newsInfo;
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: [{
					title: "通过"
				}, {
					title: "拒绝"
				}]
			}, function(e) {
				console.log(e.index);
				switch(parseInt(e.index)) {
					case 1: //通过
						checkNews(1);
						break;
					case 2: //拒绝
						checkNews(2);
						break;
					default:
						break;
				}
			})
		})
		mui(".mui-table-view").on("tap", ".passed-button", function() {
			newsDetail = this.parentElement.parentElement.querySelector(".news-container").newsInfo;
			checkNews(2, this);
		})
		mui(".mui-table-view").on("tap", ".refused-button", function() {
			newsDetail = this.parentElement.parentElement.querySelector(".news-container").newsInfo;
			checkNews(1, this);
		})
	}
	/**
	 * 
	 * @param {Object} checkType
	 */
	var checkNews = function(checkType, checkItem) {
		var wd = events.showWaiting();
		postDataPro_PostTnewsE({
			vvl: newsDetail.tabid,
			vvl1: checkType
		}, wd, function(data) {
			wd.close();
			console.log("当前返回状态：" + JSON.stringify(data));
			if(data.RspCode == 0) {
				newsDetail.Ischeck = checkType;
				setChangedButton(checkType,checkItem);
			} else {
				mui.toast("审核失败，打回重审");
			}
		})
	}
	var setChangedButton = function(checkType, checkItem) {
		checkItem.parentElement.parentElement.querySelector(".news-container").newsInfo = newsDetail;
		switch(checkType) {
			case 1:
				checkItem.className = "passed-button";
				checkItem.value = "已通过";
				break;
			case 2:
				checkItem.className = "refused-button";
				checkItem.value = "已拒绝";
				break;
			default:
				break;
		}
	}
	var openPrePage = function() {
		//		console.log("当前页面的id:" + plus.webview.currentWebview().subIsReady)
		if(areaReady) {
			events.closeWaiting();
			events.fireToPageWithData("area-choose.html", "chooseArea", curAreaInfo);
		} else {
			events.showWaiting();
			setTimeout(function() {
				openPrePage();
			}, 500)
		}
	}
	/**
	 * 传递信息至子页面
	 */
	var sendMessageToPre = function() {
		if(detailReady) {
			events.fireToPageWithData("news-detail.html", "newsDetail", newsDetail)
		} else {
			setTimeout(sendMessageToPre, 500);
		}
	}
	/**
	 * 获取省份
	 */
	//		var getAllProvince=function(){
	//			var wd=events.showWaiting();
	//			postDataPro_PostArea({
	//				vtp:0,//0(获取省份),1(获取城市),2(获取区县),3获取所有城市,4模糊查询城市
	//				vvl:''//查询
	//			},wd,function(data){
	//				
	//			})
	//		}

})(mui);