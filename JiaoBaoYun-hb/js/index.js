/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();
var loginRoleType; //登录角色0为游客1为用户
var noReadCount = 0;
mui.plusReady(function() {

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
	//自动登录
	events.defaultLogin(function(data) {
		console.log("自动登录获取的值：" + JSON.stringify(data));
		if(data.value) {
			loginRoleType = data.type;
			setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
			addSubPages(loginRoleType);
		} else { //登录失败
			mui.toast("登录失败，请检查网络！");
		}
	})
	console.log("加载图标")
	slideNavigation.add('mine.html', 200);
	window.addEventListener('infoChanged', function() {
		//		getAboutMe();
		console.log('監聽：infoChanged:' + myStorage.getItem(storageKeyName.PERSONALINFO).uimg)
		var img = myStorage.getItem(storageKeyName.PERSONALINFO).uimg;
		document.querySelector('img').src = updateHeadImg(img, 2);
	});
	window.addEventListener('closeWaiting', function() {
		events.closeWaiting();
	})
	window.addEventListener('aboutmNoRead', function() {
		//		getAboutMe();
	});	
});
var addSubPages = function(role) {
	//设置默认打开首页显示的子页序号；
	var Index = role ? 0 : 1;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../cloud/cloud_home.html', '../sciedu/sciedu_home.html', '../show/show_home_1.html', '../qiuzhi/qiuzhi_home.html'];
	//	var titles = ['首页', '科教', '展现', '求知'];
	//设置子页面距离顶部的位置
	var subpage_style = events.getWebStyle();
	subpage_style.top = (localStorage.getItem('StatusHeightNo') * 1 + 45) + 'px';
	subpage_style.bottom = '50px';
	var aniShow = {};
	//创建子页面，首个选项卡页面显示，其它均隐藏；
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i].split('/')[subpages[i].split('/').length - 1], subpage_style);
		if(role) {
			if(i > 0) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
		} else {
			if(i==1){
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}else{
				sub.hide();
			}
		}

		//append,在被选元素的结尾(仍然在内部)插入指定内容
		self.append(sub);
	}
	//当前激活选项
	var activeTab = subpages[Index];
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
	events.closeWaiting();
	if(!role){
		changRightIcons("../sciedu/sciedu_home.html");
	}
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		console.log("活动的页面：" + activeTab)
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
//		if(title.innerHTML == '云盘') {
//			title.innerHTML = '云盘';
//		}
		//更改按钮
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
	//首页加号点击事件
//	events.addTap('add', function() {
//		events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
//	})
}

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
	console.log("更改标题栏的图标")
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
	var title=document.getElementById("title");
	switch(targetTab) {
		case '../cloud/cloud_home.html': //首页
			title.innerText="云盘";
			addPlus(iconContainer, 'jxq');
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
			title.innerText="求知";
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
		//判断是否是游客身份登录
		events.judgeLoginMode();
		var self = this
		self.disabled = true;
		if(name == 'jxq') {
			events.openNewWindowWithData('../quan/pub-dynamic.html', 'jxq');
		} else {
			events.openNewWindowWithData('../quan/pub-dynamic.html', 'zx');
		}
		setTimeout(function() {
			self.disabled = false;
		}, 1500);

	})
}
var addPlus = function(container, name) {
	var add = document.createElement('a');
	add.className = 'mui-icon iconfont icon-jiahao mui-pull-right mui-icon-plusempty';
	add.style.fontSize = '15px'
	add.style.marginTop = '5px'
	add.style.marginRight = '-5px'
	add.id = 'add'
	container.appendChild(add);
	events.addTap('add', function() {
		if(name == 'jxq') {
			//判断是否是游客身份登录
			events.judgeLoginMode();
			events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
		} else {
			//判断是否是游客身份登录
			events.judgeLoginMode();
			events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
		}

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
	console.log("加载顶部导航！")
	a.addEventListener('tap', function() {
		//判断是否是游客身份登录
//		events.judgeLoginMode();
		var self = this;
		self.disabled = true;
		events.fireToPageNone(id, 'tapTitleLeft');
		setTimeout(function() {
			self.disabled = false;
		}, 1500);
	});
	container.appendChild(a)
}
var setConditionbyRole = function(role) {
	var cloudIcon = document.getElementById("defaultTab");
	var sceIcon = document.getElementById("tabclass");
	if(role) { //正常用户
		cloudIcon.style.display = "inline-block";
		cloudIcon.className = "mui-tab-item mui-active";
		sceIcon.className = "mui-tab-item";
	} else { //游客
		cloudIcon.style.display = "none";
		cloudIcon.className = "mui-tab-item";
		sceIcon.className = "mui-tab-item mui-active";
	}
}