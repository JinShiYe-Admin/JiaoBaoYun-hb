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

	//设置子页面距离顶部的位置

	var subpage_style = {
		top: (localStorage.getItem('StatusHeightNo')+45)+'px', //设置距离顶部的距离
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
		if(targetTab == activeTab) {
			return;
		}
		if(targetTab == 'tab-zone.html') {

			var header = document.querySelector(".mui-bar-nav");
			var a = document.getElementById('aboutme');
			a.style.visibility = 'visible';
			var a = document.getElementById('leave');
			a.style.visibility = 'visible';

			header.insertBefore(a, header.firstChild);
		} else {
			var header = document.querySelector(".mui-bar-nav");
			var a = document.getElementById('aboutme');
			a.style.visibility = 'hidden';
			var a = document.getElementById('leave');
			a.style.visibility = 'hidden';
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
});

