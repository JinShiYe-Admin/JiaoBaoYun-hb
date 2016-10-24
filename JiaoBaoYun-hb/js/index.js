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
	header.style.height = localStorage.getItem('$Statusbar');

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
	var subpages = ['zone_sub.html', 'tab_knowledge.html', 'clip/clip_sub.html', 'cloud/cloud_sub.html'];

	var subpage_style = {
		top: localStorage.getItem('$Statusbar'), //设置距离顶部的距离
		bottom: '51px'
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
			self.append(sub);
		}
	});
	//当前激活选项
	var activeTab = subpages[0];
	var title = document.getElementById("title");
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
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
			console.log('targetTab:'+targetTab);
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