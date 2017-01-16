/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();

mui.plusReady(function() {
	var showCity;//当前展示城市信息
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
		document.querySelector('img').src = img ? img : storageKeyName.storageKeyName.DEFAULTPERSONALHEADIMAGE;
	});
	window.addEventListener('aboutmNoRead', function() {
		getAboutMe();
	});
	window.addEventListener('showCity',function(e){
		showCity=e.detail.data;
		console.log('主界面标题获取的城市信息：'+JSON.stringify(showCity));
		setShowCity();
	});
	getAboutMe(); //获取与我相关未读数

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../cloud/cloud_home.html', '../scienceeducation/scienceeducation_home.html', '../show/show_home.html', '../qiuzhi/qiuzhi_home.html'];
	var titles = ['首页', '科教', '展现', '求知'];
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
		if(title.innerHTML == '首页') {
			title.innerHTML = '';
		}
		changRightIcons(targetTab);

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
			}

			switch(targetTab) {
				case '../cloud/cloud_home.html': //首页
					addZoneIcon(iconContainer);
					slideNavigation.addSlideIcon();
					slideNavigation.iconAddEvent();
					break;
				case '../scienceeducation/scienceeducation_home.html': //科教
					addListIcon(title_left, '../scienceeducation/scienceeducation_home.html');
					break;
				case '../show/show_home.html': //展现
					addListIcon(title_left, '../show/show_home.html');
					requestUserCity(setShowCity);
					break;
				case '../qiuzhi/qiuzhi_home.html': //求知

					break;
				default:
					break;
			}
		}
	var setShowCity=function(){
		if(showCity.totalNo==1){
			title.innerText=showCity.aname;
		}else{
			title.innerHTML=getShowCityInner()
		}
		
	}
		/**
		 * 点点点模式
		 * @param {Object} cities
		 */
	var getShowCityInner = function() {
			var inner = '<p id="current-city" class="current-city">' + showCity.aname + '</p><div class="mine-slider-indicator">';
			for(var i = 0; i < showCity.totalNo; i++) {
				if(i == 0) { //第一个
					inner += '<div class="mine-indicator mine-active"></div>'
				} else if(i == showCity.totalNo - 1) { //最后一个
					inner += '<div class="mine-indicator"></div></div>'
				} else { //中间的
					inner += '<div class="mine-indicator"></div>'
				}
			}
			return inner;
		}
		//44.获取个人的订制城市
	function requestUserCity(callback) {
		var showArray=[];
		//所需参数
		var comData = {
			vvl: '1' //订制频道,0科教频道,1展示频道,其他待定
		};
		// 等待的对话框
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//44.获取个人的订制城市
		postDataPro_PostUTcity(comData, wd, function(data) {
			wd.close();
			console.log('获取个人的订制城市:' + JSON.stringify(data));
			if(data.RspCode == 0) {
				//先通过‘|’将返回值分为数组
				showArray = data.RspData[0].citys.split('|');
				//遍历此数组
				for(var m in showArray) {
					var tempStr = showArray[m];
					//初始化model
					var model_area = {
//						acode: '', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码
//						aname: '', //节点名称
//						atype: '', //节点类型,0省1城市2区县
//						index:'',//当前页码
//						totalNo:''//总数量
					};
					console.log('tempStr:' + tempStr);
					//将分成的每个值，再通过‘_’拆分为model
					var tempArea = tempStr.split('_');
					model_area.acode = tempArea[0];
					model_area.aname = tempArea[1];
					model_area.atype = '1';
					model_area.index=m;
					model_area.totalNo=showArray.length;
					//将对应的这个数组的str和model对换，将数组中的值，替换为model数组
					showArray.splice(m, 1, model_area);
					//如果有值，默认获取第一个城市的数据
//					if(m == 0) {
//						requestCityNews(tempArea[0]);
//					}
				}
				showCity=showArray[0];
				events.fireToPageNone('../show/show_home.html','citiesInfo',showArray);
				callback();
				console.log('修改后的最终值为:' + JSON.stringify(showArray));
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}

	/**
	 * 修改首页顶部导航
	 * @param {Object} container
	 */
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

	/**
	 * 修改科教，展现的顶部导航
	 * @param {Object} container
	 */
	var addListIcon = function(container, id) {
		var a = document.createElement('a');
		a.className = 'mui-icon mui-icon mui-icon-list mui-pull-left';
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

	})
	var pubDynamic = document.getElementById('pubDynamic');
	events.addTap('pubDynamic', function() {
		events.openNewWindowWithData('../quan/pub-dynamic.html', 'FromIndex');
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