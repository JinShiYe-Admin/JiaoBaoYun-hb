var slideNavigation = (function($) {
	var menu = null, //预加载界面设置
		main = null; //主界面
	var showMenu = false; //是否显示主界面界面
	var isInTransition = false; //是否显示侧滑界面
	/**
	 * 
	 * @param {Object} tarpage 目标页面Url
	 * @param {Object} interval 时间间隔
	 */
	var add = function(tarpage, interval) {
			//加载主界面左上角图标
			addSlideIcon();
			//设置显示方向，添加监听，关闭侧滑
			setCondition();
			//预加载侧滑界面
			preloadSlideNag(tarpage, interval);
			//加载界面监听
			addSystemEvents();
			//图标加载监听事件
			iconAddEvent();
			//安卓系统返回按钮
			getBack();
		}
		/**
		 * 设置显示方向，添加监听，关闭侧滑
		 */
	var setCondition = function() {
			//仅支持竖屏显示
			plus.screen.lockOrientation("portrait-primary");
			//点击主界面时，关闭侧滑
			main = plus.webview.currentWebview();
			main.addEventListener('maskClick', closeMenu);
		}
		/**
		 * 打开侧滑
		 */
	var openMenu = function() {
			console.log('openMenu' + isInTransition);
			console.log("show:" + showMenu)
			if(isInTransition) {
				return;
			}
			if(!showMenu) {
				//侧滑菜单处于隐藏状态，则立即显示出来；
				isInTransition = true;
				menu.setStyle({
					mask: 'rgba(0,0,0,0)'
				}); //menu设置透明遮罩防止点击
				menu.show('none', 0, function() {
					//主窗体开始侧滑并显示遮罩
					main.setStyle({
						mask: 'rgba(0,0,0,0.4)',
						left: '70%',
						transition: {
							duration: 150
						}
					});
					mui.later(function() {
						isInTransition = false;
						menu.setStyle({
							mask: "none"
						}); //移除menu的mask
					}, 160);
					showMenu = true;
				});
			}
		}
		/**
		 * 关闭侧滑
		 */
	var closeMenu = function() {
			console.log("closeMenu:" + isInTransition);
			console.log("show:" + showMenu)
			if(isInTransition) {
				return;
			}
			if(showMenu) {
				//关闭遮罩；
				//主窗体开始侧滑；
				isInTransition = true;
				main.setStyle({
					mask: 'none',
					left: '0',
					transition: {
						duration: 200
					}
				});
			
				//等动画结束后，隐藏菜单webview，节省资源；
				setTimeout(function() {
					isInTransition = false;
					menu.hide();
				}, 200);
				showMenu = false;
			}
		}
		/**
		 * 加载监听
		 */
	var iconAddEvent = function() {
			//点击左上角侧滑图标，打开侧滑菜单；
			document.querySelector('.mui-icon-bars').addEventListener('tap', function(e) {
				if(showMenu) {
					closeMenu();
				} else {
					openMenu();
				}
			});
		}
		/**
		 * 加载界面和系统事件
		 */
	var addSystemEvents = function() {
			//主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作
			window.addEventListener("swiperight", openMenu);
			//主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
			window.addEventListener("swipeleft", closeMenu);
			//侧滑菜单触发关闭菜单命令
			window.addEventListener("menu:close", closeMenu);
			window.addEventListener("menu:open", openMenu);
			//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
			mui.menu = function() {
				console.log('menu事件:' + showMenu)
				if(showMenu) {
					closeMenu();
				} else {
					openMenu();
				}
			}
		}
		/**
		 * 预加载 侧滑导航
		 * @param {Object} tarpage 导航页面
		 * @param {Object} interval 延迟加载时间间隔
		 */
	var preloadSlideNag = function(tarpage, interval) {
			//延迟加载
			setTimeout(function() {
				menu = mui.preload({
					id: tarpage,
					url: tarpage,
					styles: {
						left: 0,
						width: '70%',
						zindex: 99,
					},
					show: {
						aniShow: 'none'
					}
				});
			}, interval);
			console.log('加载了吗？')
		}
		/**
		 * 加载主界面左上角图标
		 */
	var addSlideIcon = function() {
		var header = document.querySelector(".mui-bar-nav");
		var a = document.createElement('a');
		a.className = 'mui-icon mui-icon-bars mui-pull-left mui-plus-visible';
		//在第一个位置中插入元素
		header.insertBefore(a, header.firstChild);

	}
	
	//安卓系统返回按钮
	var getBack = function() {
		console.log("show:" + showMenu)
		//首页返回键处理
		//1、若侧滑菜单显示，则关闭侧滑菜单
		//2、否则，执行mui框架默认的关闭首页功能
		var _back = mui.back;
		mui.back = function() {
			console.log('back:' + showMenu)
			if(showMenu) {
				closeMenu();
			} else {
				_back();
			}
		};
	}
	return {
		add: add,
		addSlideIcon: addSlideIcon
	};
})(mui)
