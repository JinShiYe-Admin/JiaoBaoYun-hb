/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();
//var waitingDia;
//var cityType = 0;
mui.plusReady(function() {
	var showCity; //当前展示城市信息
	var SECity; //当前科教频道城市信息
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
		showCity = 0;
		SECity = 0;
	});
	window.addEventListener('closeWaiting',function(){
		waitingDia.close();
	})
	window.addEventListener('aboutmNoRead', function() {
		getAboutMe();
	});
	//退出订制城市界面返回的数据
//	window.addEventListener('customizeCity', function(e) {
//		var data = e.detail.data;
//		console.log('获取的修改后的城市信息:' + JSON.stringify(data));
//		cityType = parseInt(data.type);
//		var citiesArray = data.cities;
//		var path;
//		if(cityType) {
//			showCity = citiesArray[0];
//			path = "../show/show_home.html";
//		} else {
//			SECity = citiesArray[0];
//			path = "../scienceeducation/scienceeducation_home.html";
//		}
//		setShowCity(cityType);
//		events.fireToPageNone(path, 'citiesInfo', citiesArray);
//
//	});
//	window.addEventListener('showCity', function(e) {
//		var curCity;
//		if(cityType) {
//			curCity = showCity = e.detail.data;
//			console.log('主界面标题获取的城市信息：' + JSON.stringify(showCity));
//		} else {
//			curCity = SECity = e.detail.data;
//			console.log('主界面标题获取的城市信息：' + JSON.stringify(SECity));
//		}
//		setShowCity(cityType);
//	});
	getAboutMe(); //获取与我相关未读数

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['../cloud/cloud_home.html', '../scienceeducation/scienceeducation_home.html', '../show/show_home.html', '../qiuzhi/qiuzhi_home.html'];
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

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		console.log(activeTab)
		if(targetTab == activeTab) {
			return;
		}
		if(this.querySelector('.mui-tab-label').innerHTML == '展现') {
			cityType = 1;
//			if(showCity) {
//				setShowCity(cityType);
//			} else {
//				title.innerHTML = '展现';
//			}

		} else if(this.querySelector('.mui-tab-label').innerHTML == '科教') {
			cityType = 0;
//			if(SECity) {
//				setShowCity(cityType);
//			} else {
//				title.innerHTML = '科教';
//			}
		} else {
			//更换标题
			title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
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
					if(!SECity) {
						requestCustomizationCity();
					}
					break;
				case '../show/show_home.html': //展现
					addListIcon(title_left, '../show/show_home.html');
					addShai(iconContainer);
					if(!showCity) {
						requestUserCity();
					}
					break;
				case '../qiuzhi/qiuzhi_home.html': //求知

					break;
				default:
					break;
			}
		}
		//44.获取个人的订制城市
//	function requestCustomizationCity() {
//		//所需参数
//		var comData = {
//			vvl: '0' //订制频道,0科教频道,1展示频道,其他待定
//		};
//		// 等待的对话框
//		waitingDia = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//		//44.获取个人的订制城市
//		postDataPro_PostUTcity(comData, waitingDia, function(data) {
//			waitingDia.close();
//			var eduArray = [];
//			console.log('获取个人的订制城市科教频道:' + JSON.stringify(data));
//			if(data.RspCode == 0) {
//				if(data.RspData[0].citys) {
//					//先通过‘|’将返回值分为数组
//					eduArray = data.RspData[0].citys.split('|');
//					//遍历此数组
//					for(var m in eduArray) {
//						var tempStr = eduArray[m];
//						//初始化model
//						var model_area = {
//							//						acode: '', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码
//							//						aname: '', //节点名称
//							//						atype: '', //节点类型,0省1城市2区县
//							//						index: '', //在数组位置
//							//						totalNo: 0 //数组大小
//						};
//						console.log('tempStr:' + tempStr);
//						//将分成的每个值，再通过‘_’拆分为model
//						var tempArea = tempStr.split('_');
//						model_area.acode = tempArea[0];
//						model_area.aname = tempArea[1];
//						model_area.atype = '1';
//						model_area.index = m;
//						model_area.array = [];
//						model_area.eduIndex = 1;
//						model_area.eduSumCount = 0;
//						model_area.totalNo = eduArray.length;
//						//将对应的这个数组的str和model对换，将数组中的值，替换为model数组
//						eduArray.splice(m, 1, model_area);
//						//					//如果有值，默认获取第一个城市的数据
//						//					if(m == 0) {
//						//						requestCityNews(tempArea[0]);
//						//					}
//					}
//					SECity = eduArray[0];
//
//					setShowCity(0);
//					console.log('修改后的最终值为:' + JSON.stringify(eduArray));
//				} else {
////					waitingDia.close();
//					mui.toast('暂无科教频道的定制城市，请选择')
//				}
//
//			} else {
//				eduArray = [];
//				mui.toast(data.RspTxt);
//			}
//			events.fireToPageNone('../scienceeducation/scienceeducation_home.html', 'citiesInfo', eduArray);
//		});
//	}
//	var setShowCity = function(type) {
//			var curCity;
//			var titleInner;
//			if(type) { //1为展现频道
//				curCity = showCity;
//				titleInner = '展现';
//			} else {
//				curCity = SECity;
//				titleInner = '科教';
//			}
//			if(curCity) {
//				if(curCity.totalNo == 1) {
//					title.innerText = curCity.aname;
//				} else {
//					title.innerHTML = getShowCityInner(curCity)
//				}
//			} else {
//				title.innerHTML = titleInner;
//			}
//		}
//		/**
//		 * 点点点模式
//		 * @param {Object} cities
//		 */
//	var getShowCityInner = function(curCity) {
//			var inner = '<p id="current-city" class="current-city">' + curCity.aname + '</p><div class="mine-slider-indicator">';
//			for(var i = 0; i < curCity.totalNo; i++) {
//				if(i == curCity.index) {
//					inner += '<div class="mine-indicator mine-active"></div>'
//				} else {
//					inner += '<div class="mine-indicator"></div>'
//				}
//				if(i == curCity.totalNo - 1) {
//					inner += '</div>'
//				}
//			}
//			return inner;
//		}
//		//44.获取个人的订制城市
//	function requestUserCity(callback) {
//		//所需参数
//		var comData = {
//			vvl: '1' //订制频道,0科教频道,1展示频道,其他待定
//		};
//		// 等待的对话框
//		waitingDia= plus.nativeUI.showWaiting(storageKeyName.WAITING);
//		//44.获取个人的订制城市
//		postDataPro_PostUTcity(comData, waitingDia, function(data) {
//			waitingDia.close();
//			var showArray = [];
//			console.log('获取个人的订制城市展示频道:' + JSON.stringify(data));
//			if(data.RspCode == 0) {
//				if(data.RspData[0].citys) {
//					//先通过‘|’将返回值分为数组
//					showArray = data.RspData[0].citys.split('|');
//					//遍历此数组
//					for(var m in showArray) {
//						var tempStr = showArray[m];
//						//初始化model
//						var model_area = {
//							//acode: '', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码
//							//aname: '', //节点名称
//							//atype: '', //节点类型,0省1城市2区县
//							//index:'',//当前页码
//							//totalNo:''//总数量
//						};
//						console.log('tempStr:' + tempStr);
//						//将分成的每个值，再通过‘_’拆分为model
//						var tempArea = tempStr.split('_');
//						model_area.acode = tempArea[0];
//						model_area.aname = tempArea[1];
//						model_area.atype = '1';
//						model_area.index = m;
//						model_area.totalNo = showArray.length;
//						//将对应的这个数组的str和model对换，将数组中的值，替换为model数组
//						showArray.splice(m, 1, model_area);
//					}
//					showCity = showArray[0];
//					setShowCity(cityType);
//					console.log('修改后的最终值为:' + JSON.stringify(showArray));
//				} else {
//					mui.toast('暂无订阅展示频道的城市，请订阅！');
////					waitingDia.close();
//				}
//
//			} else {
//				mui.toast(data.RspTxt);
//			}
//			events.fireToPageNone('../show/show_home.html', 'citiesInfo', showArray);
//		});
//	}

	/**
	 * 修改首页顶部导航
	 * @param {Object} container
	 */
	var addZoneIcon = function(container) {
		addShai(container);
		addAboutMe(container);
	}
	/**
	 * 加载晒一晒
	 * @param {Object} container
	 */
	var addShai=function(container){
		var pubDynamic = document.createElement('a');
		pubDynamic.id = 'pubDynamic'
		pubDynamic.className = 'mui-icon mui-pull-right mui-plus-visible';
		pubDynamic.style.paddingLeft = '30px'
		pubDynamic.style.paddingTop = '15px'
		pubDynamic.style.fontSize = '16px'
		pubDynamic.innerHTML = '晒一晒'
		container.appendChild(pubDynamic);
		events.addTap('pubDynamic', function() {
			events.openNewWindowWithData('../quan/pub-dynamic.html', 'FromIndex');
		})
	}
	/**
	 * 加载与我相关
	 * @param {Object} container
	 */
	var addAboutMe=function(container){
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