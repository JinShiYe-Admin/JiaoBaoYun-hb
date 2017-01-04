/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();

mui.plusReady(function() {
	var backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if(backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
	slideNavigation.add('mine.html', 200)
	window.addEventListener('infoChanged', function() {
		getAboutMe();
		console.log('監聽：infoChanged:' + myStorage.getItem(storageKeyName.PERSONALINFO).uimg)
		var img = myStorage.getItem(storageKeyName.PERSONALINFO).uimg;
		document.querySelector('img').src = img ? img : storageKeyName.storageKeyName.DEFAULTPERSONALHEADIMAGE;
	})
	window.addEventListener('aboutmNoRead', function() {
		getAboutMe();
	})

	getAboutMe(); //获取与我相关未读数
	Statusbar.barHeight(); //设置距离顶部的高度
	var header = document.querySelector(".mui-bar-nav"); //顶部导航
	//设置顶部导航高度（状态栏）
	header.style.height = localStorage.getItem('StatusHeightNo') + 45 + 'px';

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../quan/tab-zone.html', '../tab_knowledge.html', '../cloud/cloud_home.html'];
	var titles = ['家校圈', '问答', '云盘'];
	//设置子页面距离顶部的位置

	var subpage_style = {
		top: (localStorage.getItem('StatusHeightNo') + 45) + 'px', //设置距离顶部的距离
		bottom: '50px'
	};

	var aniShow = {};

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 3; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		//append,在被选元素的结尾(仍然在内部)插入指定内容
		self.append(sub);
	}
	//当前激活选项
	var activeTab = subpages[0];
	var title = document.getElementById("title");

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		console.log(activeTab)
		if(targetTab == activeTab) {
			return;
		}

		//更换标题
		title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		if(title.innerHTML == '家校圈') {
			title.innerHTML = '';

		}
		changRightIcons(title.innerHTML)
			//显示目标选项卡
			//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//当切换到云盘界面时
		if(targetTab == '../tab_cloud.html') {
			console.log('targetTab:' + targetTab);
			var tab = plus.webview.getWebviewById(targetTab);
			mui.fire(tab, "isVisible", {
				isVisible: true
			});
		}

		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;

	});

	function getHomeworkAlert(NoReadCnt) {
		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户id
		//56.（用户空间）获取与我相关
		//所需参数
		var comData = {
			userId: personalUTID, //用户ID
			pageSize: '1' //每页记录数
		};
		//返回model：model_homeSchoolList，model_userSpaceAboutMe
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//24.获取与我相关
		postDataPro_GetHomeworkAlertCount(comData, wd, function(data) {
			wd.close();
			console.log('postDataPro_GetHomeworkAlertCount:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				var noRead = document.getElementById('aboutme_noRead');
				NoReadCnt = data.RspData.NoReadCnt + NoReadCnt;
				if(NoReadCnt == 0) {
					noRead.innerHTML = NoReadCnt;
					noRead.style.visibility = 'hidden';
				} else {
					noRead.style.visibility = 'visible';
					noRead.innerHTML = NoReadCnt;

				}

			} else {
				//				mui.toast(data.RspTxt);
			}
		});
	}

	function getAboutMe() {
		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户id
		//56.（用户空间）获取与我相关
		//所需参数
		var comData = {
			userId: personalUTID, //用户ID
			pageIndex: '1', //当前页数
			pageSize: '1' //每页记录数
		};
		//返回model：model_homeSchoolList，model_userSpaceAboutMe
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//24.获取与我相关
		postDataPro_getAboutMe(comData, wd, function(data) {
			wd.close();
			console.log('postDataPro_getAboutMe:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				getHomeworkAlert(data.RspData.NoReadCnt);
				//				var noRead = document.getElementById('aboutme_noRead');
				//				if(data.RspData.NoReadCnt == 0) {
				//					noRead.innerHTML = data.RspData.NoReadCnt;
				//					noRead.style.visibility = 'hidden';
				//				} else {
				//					noRead.style.visibility = 'visible';
				//					noRead.innerHTML = data.RspData.NoReadCnt;
				//
				//				}

			} else {
				//				mui.toast(data.RspTxt);
			}
		});
	}
	var changRightIcons = function(title) {
		var iconContainer = document.getElementById('random_icon');
		while(iconContainer.firstElementChild) {
			iconContainer.removeChild(iconContainer.firstElementChild);
		}

		switch(title) {
			case '':
				addZoneIcon(iconContainer);
				break;
			case '问答':
				break;
			case '视频':
				break;
			case '云盘':
				addCloudIcon(iconContainer);
				break;
			default:
				break;
		}

	}
	var addZoneIcon = function(container) {
		var pubDynamic = document.createElement('a');
		pubDynamic.id = 'pubDynamic'
		pubDynamic.className = 'mui-pull-right mui-plus-visible';
		pubDynamic.style.paddingLeft = '20px'
		pubDynamic.style.paddingTop = '10px'
		pubDynamic.style.fontSize = '16px'
		pubDynamic.innerHTML = '晒一晒'
		container.appendChild(pubDynamic)
		var aboutme = document.createElement('a');
		aboutme.className = 'mui-icon  mui-pull-right mui-plus-visible';
		aboutme.id = 'aboutme'
		aboutme.innerHTML = '@与我相关'
		aboutme.style.fontSize = '16px'
		aboutme.style.paddingTop = '15px'
		var span = document.createElement('span');
		span.id = id = 'aboutme_noRead';
		span.className = 'mui-badge mui-badge-danger'
		span.style.marginLeft = "-15px";
		span.style.marginTop = "4px";
		span.style.visibility = 'hidden'
		span.innerHTML = '3'
		aboutme.appendChild(span)
		container.appendChild(aboutme);
		events.addTap('aboutme', function() {
			events.openNewWindow('../quan/aboutme.html')
			var noRead = document.getElementById('aboutme_noRead');
			noRead.style.visibility = 'hidden';

		})
		events.addTap('pubDynamic', function() {
			events.openNewWindowWithData('../quan/pub-dynamic.html', 'FromIndex');
		})
	}

	var addCloudIcon = function(container) {
		var a = document.createElement('a');
		a.className = 'mui-icon iconfont icon-upload mui-pull-right';
		a.addEventListener('tap', function() {
			events.fireToPageNone('../cloud/cloud_home.html', 'upload');
		});
		container.appendChild(a)
	}
	var aboutme = document.getElementById('aboutme');
	events.addTap('aboutme', function() {
		events.openNewWindow('../quan/aboutme.html')
		var noRead = document.getElementById('aboutme_noRead');
		noRead.style.visibility = 'hidden';

	})
	var pubDynamic = document.getElementById('pubDynamic');
	events.addTap('pubDynamic', function() {
			events.openNewWindowWithData('../quan/pub-dynamic.html', 'FromIndex');
		})
		//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
		if(defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});

});