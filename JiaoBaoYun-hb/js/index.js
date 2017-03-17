/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();
var noReadCount=0;
mui.plusReady(function() {
	//	events.preload("../qiuzhi/expert-detail.html",100);
	var waitingDia = events.showWaiting();
	//安卓的连续点击两次退出程序
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
		document.querySelector('img').src = updateHeadImg(img,2);
	});
	window.addEventListener('closeWaiting', function() {
		waitingDia.close();
	})
	window.addEventListener('aboutmNoRead', function() {
		getAboutMe();
	});

	getAboutMe(); //获取与我相关未读数

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../cloud/cloud_home.html', '../sciedu/sciedu_home.html', '../show/show_home_1.html', '../qiuzhi/qiuzhi_home.html'];
	//	var titles = ['首页', '科教', '展现', '求知'];
	//设置子页面距离顶部的位置

	var subpage_style = {
		top: (localStorage.getItem('StatusHeightNo') * 1 + 45) + 'px', //设置距离顶部的距离
		bottom: '50px'
	};

	var aniShow = {};

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i].split('/')[subpages[i].split('/').length - 1], subpage_style);
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

	//去掉展现和科教城市下面的点
	var idSlider = ['sciEduSlider', 'showSlider'];
	//去掉展现和科教城市下面的点
	for(var i = 0; i < idSlider.length; i++) {
		var element = document.getElementById(idSlider[i]);
		if(element) {
			element.parentNode.removeChild(element);
		}
	}
	waitingDia.close();

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		console.log("活动的页面："+activeTab)
		if(targetTab == activeTab) {
			return;
		}
		var idSlider = []; //去掉展现和科教城市下面的点
		if(this.querySelector('.mui-tab-label').innerHTML == '展现') {
			idSlider = ['sciEduSlider'];
		} else if(this.querySelector('.mui-tab-label').innerHTML == '科教') {
			idSlider = ['showSlider'];
		} else {
			//更换标题
			title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
			//去掉展现和科教城市下面的点
			idSlider = ['sciEduSlider', 'showSlider'];
		}
		//去掉展现和科教城市下面的点
		for(var i = 0; i < idSlider.length; i++) {
			var element = document.getElementById(idSlider[i]);
			if(element) {
				element.parentNode.removeChild(element);
			}
		}
		if(title.innerHTML == '云盘') {
			title.innerHTML = '';
		}
		changRightIcons(targetTab);
		var targetSplit = targetTab.split('/');
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetSplit[targetSplit.length - 1]);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetSplit[targetSplit.length - 1], "fade-in", 300);
		}
		var activeSplit = activeTab.split('/');
		//隐藏当前;
		plus.webview.hide(activeSplit[activeSplit.length - 1]);
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
				noReadCount = NoReadCnt;
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

	//获取与我相关
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
			} else {
				//				mui.toast(data.RspTxt);
			}
		});
	}

	/**
	 * 修改顶部导航
	 * @param {Object} title 标题
	 */
	var changRightIcons = function(targetTab) {
		//顶部导航右侧区域
		var iconContainer = document.getElementById('random_icon');
		while(iconContainer.firstElementChild) {
			iconContainer.removeChild(iconContainer.firstElementChild);
		}
		//顶部导航左侧区域
		var title_left = document.getElementById("title_left");
		while(title_left.firstElementChild) {
			title_left.removeChild(title_left.firstElementChild);
		};

		switch(targetTab) {
			case '../cloud/cloud_home.html': //首页
				addZoneIcon(iconContainer);
				slideNavigation.addSlideIcon();
				slideNavigation.iconAddEvent();
				break;
			case '../sciedu/sciedu_home.html': //科教
				addListIcon(title_left, '../sciedu/sciedu_home.html');
				break;
			case '../show/show_home_1.html': //展现
				addListIcon(title_left, '../show/show_home_1.html');
				addShai(iconContainer, 'zx');
				break;
			case '../qiuzhi/qiuzhi_home.html': //求知
				slideNavigation.addSlideIcon();
				addQiuZhiExpertSearch(iconContainer);
				document.querySelector('.img-icon').addEventListener('tap', function(e) {
					var personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
					personalInfo.UserId = personalInfo.utid;
					events.openNewWindowWithData('../qiuzhi/expert-detail.html', personalInfo);
				})
				break;
			default:
				break;
		}
	}

	/**
	 * 修改首页顶部导航
	 * @param {Object} container
	 */
	var addZoneIcon = function(container) {
		addShai(container, 'jxq');
		addAboutMe(container);
	}
	/**
	 * 加载晒一晒
	 * @param {Object} container
	 */
	var addShai = function(container, name) {
		var pubDynamic = document.createElement('a');
		pubDynamic.id = 'pubDynamic'
		pubDynamic.className = 'mui-icon mui-pull-right mui-plus-visible';
		pubDynamic.style.paddingLeft = '30px'
		pubDynamic.style.paddingTop = '15px'
		pubDynamic.style.fontSize = '16px'
		pubDynamic.innerHTML = '晒一晒'
		container.appendChild(pubDynamic);
		events.addTap('pubDynamic', function() {
			if(name == 'jxq') {
				events.openNewWindowWithData('../quan/pub-dynamic.html', 'jxq');
			} else {
				events.openNewWindowWithData('../quan/pub-dynamic.html', 'zx');
			}

		})
	}
	/**
	 * 加载与我相关
	 * @param {Object} container
	 */
	var addAboutMe = function(container) {
		console.log(11111)
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
		if(noReadCount==0){
			span.style.visibility = 'hidden'
			span.innerHTML = '3'
		}else{
			span.style.visibility = 'visible'
			span.innerHTML = noReadCount
		}
		
		
		aboutme.appendChild(span)
		container.appendChild(aboutme);
		console.log(container.innerHTML)
		events.addTap('aboutme', function() {
			events.openNewWindow('../quan/aboutme.html')
			var noRead = document.getElementById('aboutme_noRead');
			noRead.style.visibility = 'hidden';
			noReadCount=0;

		})
	}
	var addQiuZhiExpertSearch = function(container) {
		var pubDynamic = document.createElement('a');
		pubDynamic.id = 'expertSearch'
		pubDynamic.className = 'mui-icon mui-pull-right mui-plus-visible';
		pubDynamic.style.paddingLeft = '30px'
		pubDynamic.style.paddingTop = '15px'
		pubDynamic.style.fontSize = '16px'
		pubDynamic.innerHTML = '搜索'
		container.appendChild(pubDynamic);
		events.addTap('expertSearch', function() {
			events.openNewWindowWithData('../qiuzhi/qiuzhi-questionSearch.html', 'jxq');
		})
	}
	/**
	 * 修改科教，展现的顶部导航
	 * @param {Object} container
	 */
	var addListIcon = function(container, id) {
		var a = document.createElement('a');
		a.className = 'mui-icon mui-icon mui-icon-list mui-pull-left';
		a.style.marginTop = "2px";
		a.addEventListener('tap', function() {
			events.fireToPageNone(id, 'tapTitleLeft');
		});
		container.appendChild(a)
	}

	var aboutme = document.getElementById('aboutme');
	events.addTap('aboutme', function() {
		events.openNewWindow('../quan/aboutme.html')
		var noRead = document.getElementById('aboutme_noRead');
		noRead.style.visibility = 'hidden';
		noReadCount=0;

	})
	var pubDynamic = document.getElementById('pubDynamic');
	events.addTap('pubDynamic', function() {
		events.openNewWindowWithData('../quan/pub-dynamic.html', 'jxq');
	});

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