/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init();

mui.plusReady(function() {
	Statusbar.barHeight(); //设置距离顶部的高度
	var header = document.querySelector(".mui-bar-nav"); //顶部导航
	//设置顶部导航高度（状态栏）
	header.style.height = localStorage.getItem('StatusHeightNo') + 45 + 'px';

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['tab-zone.html', 'tab_knowledge.html', 'clip/clip_sub.html', 'cloud/cloud_home.html'];
	var titles = ['家校圈', '问答', '视频', '云盘'];
	//设置子页面距离顶部的位置

	var subpage_style = {
		top: (localStorage.getItem('StatusHeightNo') + 45) + 'px', //设置距离顶部的距离
		bottom: '50px'
	};

	var aniShow = {};

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	mui.plusReady(function() {
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
	});
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
		if(targetTab == 'tab_cloud.html') {
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
	var changRightIcons = function(title) {
		var iconContainer = document.getElementById('random_icon');
		while(iconContainer.firstElementChild) {
			iconContainer.removeChild(iconContainer.firstElementChild);
		}

		switch(title) {
			case '家校圈':
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
		var a = document.createElement('a');
		a.id = 'leave'
		a.className = 'mui-icon mui-icon-compose  mui-pull-right mui-plus-visible';
		a.style.paddingLeft = '20px'
		container.appendChild(a)
		var a = document.createElement('a');
		a.className = 'mui-icon  mui-pull-right mui-plus-visible';
		a.id = 'aboutme'
		a.innerHTML = '@与我相关'
		a.style.fontSize = '16px'
		a.style.paddingTop = '15px'
		var span = document.createElement('span');
		span.className = 'mui-badge mui-badge-danger custom-badge1'
		span.innerHTML = '3'
		a.appendChild(span)
		container.appendChild(a);
	}

	var addCloudIcon = function(container) {
		var a = document.createElement('a');
		a.className = 'mui-icon mui-icon-upload mui-pull-right';
		a.addEventListener('tap',function(){
			mui.toast("上传");
		});
		container.appendChild(a)
	}

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