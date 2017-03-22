(function($) {
	$.init();
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	var detailReady = false;
	var areaReady = false;
	var newsDetail;
	var choseContainer;
	var curAreaInfo;
	//滚动参数
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
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
	 * 放置当前城市
	 */
	var setCurArea=function(){
		document.getElementById("choose-area").innerHTML=curAreaInfo.aname+'<span class="mui-icon mui-icon-arrowdown"></span>';
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
		mui(".mui-table-view").on('tap', ".", function() {
			newsDetail = this.newsInfo;
			sendMessageToPre();
		})
		events.addTap("choose-area", function() {
			openPrePage();
		})
	}
	var openPrePage = function() {
		//		console.log("当前页面的id:" + plus.webview.currentWebview().subIsReady)
		if(areaReady) {
			events.fireToPageWithData("area-choose.html", "chooseArea", choseContainer.value);
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