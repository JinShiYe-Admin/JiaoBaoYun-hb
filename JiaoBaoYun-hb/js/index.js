/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init({
	statusBarBackground: '#13b7f6'
});
var loginRoleType = 0; //登录角色0为游客1为用户
var noReadCount = 0;
var aniShow = {};
mui.plusReady(function() {
	var personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
	if(parseInt(personalInfo.utid)) {
		loginRoleType = 1
	} else {
		loginRoleType = 0;
	}
	setConditionbyRole(loginRoleType);
	//	events.preload("../qiuzhi/expert-detail.html",100);
	var waitingDia = events.showWaiting();
	//安卓的连续点击两次退出程序
	var backButtonPress = 0;
	//重写返回键
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
	Statusbar.barHeight(); //获取一些硬件参数
	addSubPages(); //加载子页面
	//	slideNavigation.add('mine.html', 200); //加载侧滑导航栏
	window.addEventListener('infoChanged', function() {
		events.fireToPageNone("cloud_home.html", "infoChanged");
		events.fireToPageNone("qiuzhi_home.html", "infoChanged");
		//		getAboutMe();
		//		console.log('監聽：infoChanged:' + myStorage.getItem(storageKeyName.PERSONALINFO).uimg)
		//		var img = myStorage.getItem(storageKeyName.PERSONALINFO).uimg;
		//		var imgNode = document.getElementById("index-header").querySelector('img');
		//		if(imgNode) {
		//			if(parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid)){
		//				imgNode.src = updateHeadImg(img, 2);
		//				imgNode.style.display="inline-block";
		//			}
		//		}
	});
	//登录的监听
	window.addEventListener("login", function() {
		console.log("login");
		loginRoleType = 1;
		setConditionbyRole(loginRoleType);
	})
	//退出的监听
	window.addEventListener("quit", function() {
		loginRoleType = 0;
		setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
	})
	//关闭等待框
	window.addEventListener('closeWaiting', function() {
		events.closeWaiting();
	})
	//	window.addEventListener('aboutmNoRead', function() {
	//		getAboutMe();
	//	});
	//	//默认自动登录
	//	events.defaultLogin(function(data) {
	//		console.log("自动登录获取的值：" + JSON.stringify(data));
	//		if(data.value == 1) {
	//			loginRoleType = data.flag;
	//			setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
	//			setTimeout(appUpdate.updateApp, 5000);
	//		} else if(data.value == -1) { //登录失败
	//			if(parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid)) {
	//				loginRoleType = 1;
	//			} else {
	//				loginRoleType = 0;
	//			}
	//			setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
	//			mui.toast("登录失败，请检查网络！");
	//		}
	//		//android更新app
	//	});
	//加载监听
	setListener();

});
//加载子页面
var addSubPages = function() {
	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../cloud/cloud_home.html', '../sciedu/sciedu_home.html', '../show/show_home_1.html', '../qiuzhi/qiuzhi_home.html'];
	//	var titles = ['首页', '科教', '展现', '求知'];
	//设置子页面距离顶部的位置
	var subpage_style = events.getWebStyle();
	subpage_style.top = (localStorage.getItem('StatusHeightNo') * 1) + 'px';
	subpage_style.bottom = '50px';

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
	activeTab = subpages[Index];
	//去掉展现和科教城市下面的点
	//	var idSlider = ['sciEduSlider', 'showSlider'];
	//	//去掉展现和科教城市下面的点
	//	for(var i = 0; i < idSlider.length; i++) {
	//		var element = document.getElementById(idSlider[i]);
	//		if(element) {
	//			element.parentNode.removeChild(element);
	//		}
	//	}
	events.closeWaiting();
}
//加载监听
var setListener = function() {
	var title = document.getElementById("title");
	//	var aniShow = {};
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		console.log("活动的页面：" + activeTab)
		if(targetTab == activeTab) {
			if(activeTab == '../cloud/cloud_home.html') {
				events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover', {})
			}

			return;
		}
		var idSlider = []; //去掉展现和科教城市下面的点
		if(activeTab == '../cloud/cloud_home.html') {
			events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover', {})
		}
		//		if(this.querySelector('.mui-tab-label').innerHTML == '展现') {
		//			idSlider = ['sciEduSlider'];
		//		} else if(this.querySelector('.mui-tab-label').innerHTML == '科教') {
		//			idSlider = ['showSlider'];
		//		} else {
		//			
		//			//更换标题
		//			title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//			//去掉展现和科教城市下面的点
		//			idSlider = ['sciEduSlider', 'showSlider'];
		//		}
		//		//去掉展现和科教城市下面的点
		//		for(var i = 0; i < idSlider.length; i++) {
		//			var element = document.getElementById(idSlider[i]);
		//			if(element) {
		//				element.parentNode.removeChild(element);
		//			}
		//		}
		//更改按钮
		//		changRightIcons(targetTab);
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
	//首页加号点击事件
	//	events.addTap('add', function() {
	//		events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
	//	})
}
//获取作业的提醒
//function getHomeworkAlert(NoReadCnt) {
//	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户id
//	//56.（用户空间）获取与我相关
//	//所需参数
//	var comData = {
//		userId: personalUTID, //用户ID
//		pageSize: '1' //每页记录数
//	};
//	//返回model：model_homeSchoolList，model_userSpaceAboutMe
//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//	//24.获取与我相关
//	postDataPro_GetHomeworkAlertCount(comData, wd, function(data) {
//		wd.close();
//		console.log('postDataPro_GetHomeworkAlertCount:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//		if(data.RspCode == 0) {
//			NoReadCnt = data.RspData.NoReadCnt + NoReadCnt;
//			noReadCount = NoReadCnt;
//			events.fireToPageWithData('../cloud/cloud_home.html', 'NoReadCnt', NoReadCnt)
//
//		} else {
//			//				mui.toast(data.RspTxt);
//		}
//	});
//}

//获取与我相关
//function getAboutMe() {
//	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户id
//	if(personalUTID == 0) {
//		return;
//	}
//	//56.（用户空间）获取与我相关
//	//所需参数
//	var comData = {
//		userId: personalUTID, //用户ID
//		pageIndex: '1', //当前页数
//		pageSize: '1' //每页记录数
//	};
//	//返回model：model_homeSchoolList，model_userSpaceAboutMe
//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//	//24.获取与我相关
//	postDataPro_getAboutMe(comData, wd, function(data) {
//		wd.close();
//		console.log('postDataPro_getAboutMe:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//		if(data.RspCode == 0) {
//			getHomeworkAlert(data.RspData.NoReadCnt);
//		} else {
//			//				mui.toast(data.RspTxt);
//		}
//	});
//}

/**
 * 修改顶部导航
 * @param {Object} title 标题
 */
//var changRightIcons = function(targetTab) {
//	console.log("更改标题栏的图标")
//	//顶部导航右侧区域
//	var iconContainer = document.getElementById('random_icon');
//	while(iconContainer.firstElementChild) {
//		iconContainer.removeChild(iconContainer.firstElementChild);
//	}
//	//顶部导航左侧区域
//	var title_left = document.getElementById("title_left");
//	while(title_left.firstElementChild) {
//		title_left.removeChild(title_left.firstElementChild);
//	};
//	var title = document.getElementById("title");
//	title.innerText = "";
////	switch(targetTab) {
////		case '../cloud/cloud_home.html': //首页
////			title.innerText = "云盘";
////			addPlus(iconContainer, 'jxq');
////			addOrder(iconContainer);
////			slideNavigation.addSlideIcon();
////			slideNavigation.iconAddEvent();
////			document.querySelector('.img-icon').style.display="inline-block";
////			break;
////		case '../sciedu/sciedu_home.html': //科教
////			addListIcon(title_left, '../sciedu/sciedu_home.html');
////			break;
////		case '../show/show_home_1.html': //展现
////			addListIcon(title_left, '../show/show_home_1.html');
////			addShai(iconContainer, 'zx');
////			break;
////		case '../qiuzhi/qiuzhi_home.html': //求知
////			title.innerText = "求知";
////			slideNavigation.addSlideIcon();
////			document.querySelector('.img-icon').style.display="inline-block";
////			addQiuZhiExpertSearch(iconContainer);
////			document.querySelector('.img-icon').addEventListener('tap', function(e) {
////				//判断是否是游客身份登录
////				if(events.judgeLoginMode()) {
////					return;
////				}
////				var personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
////				personalInfo.UserId = personalInfo.utid;
////				events.openNewWindowWithData('../qiuzhi/expert-detail.html', personalInfo);
////			})
////			break;
////		default:
////			break;
////	}
//	//	events.addTap('add', function() {
//	//		events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
//	//	})
//}

///**
// * 加载晒一晒
// * @param {Object} container
// */
//var addShai = function(container, name) {
//	var pubDynamic = document.createElement('a');
//	pubDynamic.id = 'pubDynamic'
//	pubDynamic.className = 'mui-icon mui-pull-right mui-plus-visible';
//	pubDynamic.style.paddingLeft = '30px'
//	pubDynamic.style.paddingTop = '18px'
//	pubDynamic.style.fontSize = '14px'
//	pubDynamic.innerHTML = '晒一晒'
//	container.appendChild(pubDynamic);
//	events.addTap('pubDynamic',
//		function() {
//			//判断是否是游客身份登录
//			if(events.judgeLoginMode()) {
//				return;
//			}
//			var self = this
//			self.disabled = true;
//			if(name == 'jxq') {
//				events.openNewWindowWithData('../quan/pub-dynamic.html', 'jxq');
//			} else {
//				events.openNewWindowWithData('../quan/pub-dynamic.html', 'zx');
//			}
//			setTimeout(function() {
//				self.disabled = false;
//			}, 1500);
//		})
//}
//var addOrder = function(container) {
//	var a = document.createElement('a');
//	a.className = 'mui-icon iconfont icon-iconhexinhuiyuan mui-pull-right';
//	a.style.marginRight="5px";
//	a.id = 'order';
//	container.appendChild(a);
//	a.addEventListener("tap", function() {
//		if(events.judgeLoginMode()) {
//			return;
//		}
//		events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover',{flag:1})
//		events.openNewWindow("../cloud/order-member.html");
//	})
//}
//云盘首页加载plus
//var addPlus = function(container, name) {
//	var add = document.createElement('a');
//	add.className = 'mui-icon iconfont icon-jiahao mui-pull-right mui-icon-plusempty';
//	add.style.fontSize = '15px'
//	add.style.marginTop = '5px'
//	add.style.marginRight = '-5px'
//	add.id = 'add'
//	container.appendChild(add);
//	events.addTap('add', function() {
//		if(name == 'jxq') {
//			//判断是否是游客身份登录
//			if(events.judgeLoginMode()) {
//				return;
//			}
//			events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover',{flag:0})
//		} else {
//			//判断是否是游客身份登录
//			if(events.judgeLoginMode()) {
//				return;
//			}
//			events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover',{flag:0})
//		}
//
//	})
//}
//求知加载搜索按钮
//var addQiuZhiExpertSearch = function(container) {
//	var pubDynamic = document.createElement('a');
//	pubDynamic.id = 'expertSearch'
//	pubDynamic.className = 'mui-icon mui-pull-right mui-plus-visible';
//	pubDynamic.style.paddingLeft = '30px'
//	pubDynamic.style.paddingTop = '15px'
//	pubDynamic.style.fontSize = '14px'
//	pubDynamic.innerHTML = '搜索'
//	container.appendChild(pubDynamic);
//	events.addTap('expertSearch', function() {
//		events.openNewWindowWithData('../qiuzhi/qiuzhi-questionSearch.html', 'jxq');
//	})
//}
/**
 * 修改科教，展现的顶部导航
 * @param {Object} container
 */
//var addListIcon = function(container, id) {
//	var a = document.createElement('a');
//	a.className = 'mui-icon mui-icon mui-icon-list mui-pull-left';
//	a.style.marginTop = "2px";
//	a.addEventListener('tap', function() {
//		//判断是否是游客身份登录
//		if(events.judgeLoginMode()) {
//			return;
//		}
//		var self = this;
//		self.disabled = true;
//		events.fireToPageNone(id, 'tapTitleLeft');
//		setTimeout(function() {
//			self.disabled = false;
//		}, 1500);
//	});
//	container.appendChild(a);
//}
//根据登录角色不同，更改界面显示
var setConditionbyRole = function(role) {
	console.log("获取的身份信息：" + JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)));
	var cloudIcon = document.getElementById("defaultTab");
	var sceIcon = document.getElementById("tabclass");
	var active_tab = document.querySelector(".mui-tab-item.mui-active").getAttribute('href');
	plus.webview.hide(active_tab.split("/")[active_tab.split("/").length - 1]);
	document.querySelector(".mui-tab-item.mui-active").className = "mui-tab-item";

	if(role) { //正常用户
		cloudIcon.style.display = "table-cell";
		cloudIcon.className = "mui-tab-item mui-active";
		activeTab = "../cloud/cloud_home.html";
	} else { //游客
		cloudIcon.style.display = "none";
		sceIcon.className = "mui-tab-item mui-active";
		activeTab = "../sciedu/sciedu_home.html";
	}
	//显示活动的界面
	setActivePage();
}
/**
 * 显示活动的界面
 */
var setActivePage = function() {
	var temp = {};
	temp[activeTab] = "true";
	mui.extend(aniShow, temp);
	var splitActiveTabs = activeTab.split("/");
	var activeId = splitActiveTabs[splitActiveTabs.length - 1];
	console.log("要显示的界面：" + activeTab);
	plus.webview.show(activeId, "fade-in", 300);
	//	changRightIcons(activeTab);
}