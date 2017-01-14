/**
   * 城市滑动选择
   * @requires jQuery.js slide_navigatian.css
   */
var slide_selector = (function(mod) {
	var thisCities; //城市数组
	var thisPagePath; //对应的界面
	var citiesIndex = 0; //滑动计数，左滑-1，右滑+1；
	var curCity; //当前城市
	var subWvs;
	var self;
	/**
	 * 放置城市数据
	 * @param {Object} cities //城市数组
	 */
	mod.setCities = function(cities) {
			thisCities = cities;
			if(cities.length > 0) {
				var fragment = document.createDocumentFragment();
				if(cities.length == 1) { //城市数组为1
					var p = document.createElement('p');
					p.className = 'single-city';
					p.innerText = cities[0];
					fragment.appendChild(p);
				} else { //城市长度为1以上
					var div = document.createElement('div');
					div.className = 'cities-selector';
					div.innerHTML = getCitiesInner(cities);
					console.log("页面获取的innerHTML:" + div.innerHTML)
					fragment.appendChild(div);
				}
				document.querySelector('.mui-content').appendChild(fragment);
			}
		}
		/**
		 * 点点点模式
		 * @param {Object} cities
		 */
	var getCitiesInner = function(cities) {
			var inner = '<p id="current-city" class="current-city">' + cities[0] + '</p><div class="mine-slider-indicator">';
			for(var i = 0; i < cities.length; i++) {
				if(i == 0) { //第一个
					inner += '<div class="mine-indicator mine-active"></div>'
				} else if(i == cities.length - 1) { //最后一个
					inner += '<div class="mine-indicator"></div></div>'
				} else { //中间的
					inner += '<div class="mine-indicator"></div>'
				}
			}
			return inner;
		}
		/**
		 * 获取不同的页面
		 * @param {Object} pagePath 要加载的html路径
		 */
	mod.getPages = function(cities,subPage) {
		thisCities = cities;
		self=plus.webview.currentWebview();
		mod.pages=[];
			// 子窗口样式
		var subStyles = {
			top: "0px",
			bottom: "50px"
		};
		// 创建子页面
		for(var i =0;i<2;i++) {
			/**
			 * 创建窗口对象，并将索引做为额外的参数传递；
			 * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.create
			 */
			var subWv = plus.webview.create(subPage, subPage+i, subStyles, {
				index: i
			});
			// 窗口对象添加至数组
			mod.pages.push(subWv);
			if(i > 0) {
				/**
				 * 隐藏非第一页的窗口对象
				 * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.hide
				 */
				subWv.hide("none");
			}
			/**
			 * 向父窗口添加子窗口
			 * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.append
			 */
			self.append(subWv);
			
		}
		curCity = thisCities[0];
		console.log("当前的城市为：" + curCity + ",当前的pageId为：" + mod.pages[0].id);
		mui.fire(mod.pages[0], 'cityInfo', curCity + 1);
		addSwipe();
//			mod.pagePaths = pagePaths;
//			mod.pages = [];
//			var curPage = plus.webview.currentWebview();
//			var page;
//			for(var i = 0; i < thisCities.length; i++) {
//				if(!plus.webview.getWebviewById(pagePaths[i % pagePaths.length])) {
//					page = plus.webview.create(pagePaths[i % pagePaths.length], pagePaths[i % pagePaths.length], {
//							top: '100px',
//							bottom: '0'
//						}
//
//					);
//					if(i % pagePaths.length != 0) {
//						page.hide(); //隐藏界面
//					}
//					mod.pages.push(page); //将界面放进数组
//					curPage.append(page); //主界面加载此页面
//				}
//			}
//			addSwipe(); //加载滑动事件
//			//显示第一个页面
//			curCity = thisCities[0];
//			thisPagePath =pagePaths[0];
//			var showPage = plus.webview.getWebviewById(pagePaths[0]);
//			console.log("当前的城市为：" + curCity + ",当前的pageId为：" + showPage.id);
//			setTimeout(function() {
//				mui.fire(showPage, 'cityInfo', curCity + 1);
//			}, 1000);
		}
		/**
		 * 加载左滑、右滑事件
		 */
	var addSwipe = function() {
			window.addEventListener("swipe_event", function(event) {
					// 获取方向以及索引
					console.log('滑动事件监听')
					var direction = event.detail.direction;
					if(direction == "left") {
						swipe(1);
					} else {
						swipe(0);
					}
				})
		}
		/**
		 * 滑动事件的实现
		 * @param {Object} type 0 右滑 1左滑
		 * @param {Object} index 
		 */
	var swipe = function(type) {
			var showPage;
			if(citiesIndex >= 0) {
				citiesIndex = citiesIndex % thisCities.length;
			} else {
				citiesIndex = citiesIndex % thisCities.length + thisCities.length;
			}
			var curPage =mod.pages[citiesIndex%2];
			if(type == 1) { //右滑
				showPage = mod.pages[(citiesIndex + 1) % 2];
				citiesIndex++;
			} else { //左滑
				showPage = mod.pages[(citiesIndex + 2-1) % 2];
				citiesIndex--;
			}
			getCurrentCity();
//			document.querySelector('#current-city').innerText = curCity;
//			setIndicatorShow(); //点点显示
			/**
			 * 向index页面传递数据
			 */
			sendPageChanged();
			curPage.hide(); //隐藏当前页面
			showPage.show("fade-in"); //显示要显示的页面;
			console.log("滑动模式：" + type + ",滑动后的要显示的页面id:" + showPage.id);
			mui.fire(showPage, 'cityInfo', curCity + 0); //向显示界面传值
		}
	var sendPageChanged=function(){
		getCurrentCity();
		events.fireToPageNone('../index/index.html','cityInfo',curCity)
	}
		/**
		 * 设置点点的显示
		 */
	var setIndicatorShow = function() {
			jQuery(".mine-active").className = "mine-indicator";
			if(citiesIndex >= 0) {
				jQuery(".mine-slider-indicator").children().eq(citiesIndex % thisCities.length).className = "mine-indicator mine-active";
			} else {
				jQuery(".mine-slider-indicator").children().eq(citiesIndex % thisCities.length + thisCities.length).className = "mine-indicator mine-active";
			}
		}
		/**
		 * 获取当前城市
		 */
	var getCurrentCity = function() {
		if(citiesIndex >= 0) {
			curCity = thisCities[citiesIndex % thisCities.length];
		} else {
			curCity = thisCities[citiesIndex % thisCities.length + thisCities.length];
		}
	}
	return mod;
})(slide_selector || {})
