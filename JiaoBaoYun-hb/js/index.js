/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();
var loginRoleType; //登录角色0为游客1为用户
var noReadCount = 0;
mui.plusReady(function() {
	//如果之前登录成功，则重新获取token，获取个人信息，则为登录成功
	var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
	console.log('person==='+JSON.stringify(personal));
	if(personal && personal.utid != 0) { //有账号，正常登录

	} else {
		var model_area = {
			procode: '00', //省份code，自己添加的参数
			proname: '全国', //省份名称，自己添加的参数
			acode: '000000', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码--城市代码
			aname: '全国', //节点名称--城市名称
			atype: '' //节点类型,0省1城市2区县
		}
		var personal1 = {
			utid: '0', //用户表ID
			uid: '00000000000', //电话号码
			uname: '游客', //姓名,账号,只能修改一次,且只能字母开头,字母与数字,定了就不能修改
			uimg: '../../image/utils/default_personalimage.png', //用户头像地址
			unick: '游客', //用户昵称
			usex: '', //用户性别
			utxt: '', //用户签名
			uarea: model_area, //用户区域,省代码 市代码|省名称 市名称
			token: '', //用户令牌
			ispw: '', //0无密码，1有密码
			isLogin: '' //是否登录，0没有登录过，1有登录过
		}
		window.myStorage.setItem(window.storageKeyName.PERSONALINFO, personal1);
	}
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
	addSubPages();
	console.log("加载图标");
	slideNavigation.add('mine.html', 200);
	window.addEventListener('infoChanged', function() {
		//		getAboutMe();
		console.log('監聽：infoChanged:' + myStorage.getItem(storageKeyName.PERSONALINFO).uimg)
		var img = myStorage.getItem(storageKeyName.PERSONALINFO).uimg;
		var imgNode = document.querySelector('img');
		if(imgNode) {
			imgNode.src = updateHeadImg(img, 2);
		}

	});
	window.addEventListener("login", function() {
		console.log("login");
		loginRoleType = 1;
		setConditionbyRole(loginRoleType);
	})
	window.addEventListener('closeWaiting', function() {
		events.closeWaiting();
	})
	window.addEventListener('aboutmNoRead', function() {
		//		getAboutMe();
	});
	events.defaultLogin(function(data) {
		console.log("自动登录获取的值：" + JSON.stringify(data));
		if(data.value) {
			loginRoleType = data.flag;
			setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
		} else { //登录失败
			mui.toast("登录失败，请检查网络！");
		}
	});
	plus.webview.currentWebview().addEventListener("show", function() {
		console.log("index的show事件");
		//自动登录
		//		events.defaultLogin(function(data) {
		//			console.log("自动登录获取的值：" + JSON.stringify(data));
		//			if(data.value) {
		//				loginRoleType = data.flag;
		//				setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
		//			} else { //登录失败
		//				mui.toast("登录失败，请检查网络！");
		//			}
		//		});
	})
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
	subpage_style.top = (localStorage.getItem('StatusHeightNo') * 1 + 45) + 'px';
	subpage_style.bottom = '50px';
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
	activeTab = subpages[Index];
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

}
//加载监听
var setListener = function() {
	var title = document.getElementById("title");
	var aniShow = {};
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
	events.addTap('add', function() {
		events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
	})
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
	var title = document.getElementById("title");
	switch(targetTab) {
		case '../cloud/cloud_home.html': //首页
			title.innerText = "云盘";
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
			title.innerText = "求知";
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
	events.addTap('add', function() {
		events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
	})
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
	events.addTap('pubDynamic',
		function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode()) { return; }
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
			if(events.judgeLoginMode()) { return; }
			events.fireToPageNone('../cloud/cloud_home.html', 'topPopover')
		} else {
			//判断是否是游客身份登录
			if(events.judgeLoginMode()) { return; }
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
	a.addEventListener('tap', function() {
		//判断是否是游客身份登录
		if(events.judgeLoginMode()) { return; }
		var self = this;
		self.disabled = true;
		events.fireToPageNone(id, 'tapTitleLeft');
		setTimeout(function() {
			self.disabled = false;
		}, 1500);
	});
	container.appendChild(a);
}
var setConditionbyRole = function(role) {
	console.log("获取的身份信息：" + JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)));
	var cloudIcon = document.getElementById("defaultTab");
	var sceIcon = document.getElementById("tabclass");
	if(role) { //正常用户
		cloudIcon.style.display = "table-cell";
		//		cloudIcon.className = "mui-tab-item mui-active";
		//		sceIcon.className = "mui-tab-item";
		//		plus.webview.show("cloud_home.html");
		//		activeTab=plus.webview.getWebviewById("cloud_home.html");
		//		plus.webview.hide("sciedu_home.html");
		//		changRightIcons("../cloud/cloud_home.html")
	} else { //游客
		cloudIcon.style.display = "none";
		cloudIcon.className = "mui-tab-item";
		sceIcon.className = "mui-tab-item mui-active";
		plus.webview.show("sciedu_home.html");
		activeTab = plus.webview.getWebviewById("sciedu_home.html");
		plus.webview.hide("cloud_home.html");
		changRightIcons("../sciedu/sciedu_home.html")
	}

}