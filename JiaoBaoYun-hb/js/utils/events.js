/**
 * @author an
 */

var events = (function(mod) {
	/**
	 * 绑定监听
	 * @param {Object} id 绑定dom的Id
	 * @param {Object} event 绑定的监听事件
	 */
	mod.addTap = function(id, event) {
		//console.log("获取当前页面的id："+plus.webview.currentWebview().id);
		var item = document.getElementById(id);
		item.addEventListener('tap', event);
	}
	/**
	 * 加载跳转界面监听的公用方法
	 * @param {Object} item 加载监听的控件
	 * @param {Object} targetHTML 目标Url
	 */
	mod.jumpPage = function(item, targetHTML) {
		item.addEventListener('tap', function() {
			mod.openNewWindow(targetHTML);
		})
	}
	/**
	 * 打开新界面
	 * @param {Object} targetPage 目标界面
	 */
	mod.openNewWindow = function(tarPagePath) {
		var tarPageIds = tarPagePath.split('/');
		var targetPage = plus.webview.getWebviewById(tarPageIds[tarPageIds.length - 1]);
		console.log('targetPage是否存在:' + Boolean(targetPage))
		if(targetPage) {
			targetPage.show();
		} else {
			mui.openWindow({
				url: tarPagePath,
				id: tarPageIds[tarPageIds.length - 1],
				show: {
					anishow: 'slide-in-right',
					duration: 250
				},
				waiting: {
					title: '正在加载...'
				},
				styles: {
					top: '0px',
					bottom: '0px'
				}
			})
		}

	}
	/**
	 * 打开新页面时，同时传值
	 * 扩展参数仅在打开新窗口时有效，若目标窗口为预加载页面，
	 * 则通过mui.openWindow方法打开时传递的extras参数无效。
	 * @param {Object} targetHTML 新页面路径
	 * @param {Object} passData 获取要传的值
	 */
	mod.openNewWindowWithData = function(targetHTML, passData) {
		mui.openWindow({
			url: targetHTML,
			id: targetHTML.split('/')[targetHTML.split('/').length - 1],
			extras: {
				data: passData
			},
			show: {
				anishow: 'slide-in-right',
				duration: 250
			},
			waiting: {
				title: '正在加载...'
			},
			styles: {
				top: '0px',
				bottom: '0px'
			}
		});
	};
	/**
	 * 加载子页面
	 * @param {Object} subPage 子页面路径
	 * @param {Object} datas 向子页面加载的数据，可选参数
	 */
	mod.initSubPage = function(subPage, datas, height, bottom) {
		if(!datas) {
			datas = null;
		}
		height = height ? height : 0;
		bottom = bottom ? bottom : 0;
		mui.init({
			gestureConfig: {
				doubletap: true //启用双击监听
			},
			subpages: [{
				url: subPage,
				id: subPage.split('/')[subPage.split('/').length - 1],
				styles: {
					top: (localStorage.getItem('StatusHeightNo') * 1 + 45 + height) + 'px',
					bottom: bottom + 'px',
				},
				extras: {
					data: datas
				}
			}]
		});
	}

	/**
	 *
	 * @param {Object} id 刷新的list控件id
	 * @param {Object} fresh 下拉刷新加载数据的方法
	 * @param {Object} addMore 上拉刷新加载数据的方法
	 */
	mod.initRefresh = function(id, fresh, addMore) {

		mui.init({
			pullRefresh: {
				container: '#refreshContainer',
				down: {
					callback: pulldownRefresh
				},
				up: {
					contentrefresh: '正在加载...',
					callback: pullupRefresh
				}
			}
		});
		/**
		 * 下拉刷新具体业务实现
		 */
		function pulldownRefresh() {
			setTimeout(function() {
				mui('#refreshContainer').pullRefresh().refresh(true);
				var item = document.getElementById(id)
				//清除所有数据
				mod.clearChild(item);
				//					while(item.firstChild != null) {
				//						item.removeChild(item.firstChild)
				//					}
				//加载新控件
				fresh();
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 150);
		}
		var count = 0;
		/**
		 * 上拉加载具体业务实现
		 */
		function pullupRefresh() {
			setTimeout(function() {
				addMore();
			}, 1500);
		}
	}
	/**
	 * 预加载单个页面 在mui.plusReady里调用
	 * @param {Object} tarPage 页面路径
	 * @param {Object} interval 延迟加载时间间隔 单位毫秒 ，不输入默认为0
	 */
	mod.preload = function(tarPage, interval) {
		if(!interval) {
			interval = 0;
		}
		if(!plus.webview.getWebviewById(tarPage)) {
			//初始化预加载详情页面
			setTimeout(function() {
				mui.preload({
					url: tarPage,
					id: tarPage.split('/')[tarPage.split('/').length - 1], //默认使用当前页面的url作为id
					styles: { //窗口参数
						top: '0px',
						bottom: '0px'
					},
					show: {
						anishow: 'slide-in-right',
						duration: 250
					},
					waiting: {
						title: '正在加载...'
					}
				})
			}, interval)
		}

	}
	/**
	 * 加载不需要传值的预加载页面
	 * @param {Object} tarpge
	 */
	mod.showPreloadPage = function(tarPage) {
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);

		}
		targetPage.show('slide-in-right', 250);
	}
	/**
	 * 如果目标页面未加载,需要先预加载页面
	 * 传递数值到指定页面并打开页面
	 * @param {Object} tarpage 目标页面Id
	 * @param {Object} listener 监听事件
	 * @param {Object} getDatas 获取数据的方法  return somthing
	 */
	mod.fireToPage = function(tarPage, listener, getDatas) {
		//			console.log('tarPage:' + tarPage);
		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
			//				console.log(typeof(targetPage))
		}
		//触发目标页面的listener事件
		mui.fire(targetPage, listener, {
			data: getDatas()
		});
		console.log('要传的值是：' + JSON.stringify(getDatas()))
		targetPage.show('slide-in-right', 250)
	}
	/**
	 * 如果目标页面未加载,需要先预加载页面
	 * 传递数值到指定页面并打开页面
	 * @param {Object} tarpage 目标页面Id
	 * @param {Object} listener 监听事件
	 * @param {Object} datas 要传递的数据
	 */
	mod.fireToPageWithData = function(tarPage, listener, datas) {
		console.log('tarPage:' + tarPage);
		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
			//				console.log(typeof(targetPage));
		}
		//触发目标页面的listener事件
		mui.fire(targetPage, listener, {
			data: datas
		});
		targetPage.show('slide-in-right', 250)
	}
	/**
	 * 事件传递 不传数据 常用于 父子页面间
	 * @param {Object} tarPage 目标页面
	 * @param {Object} listener 事件
	 */
	mod.fireToPageNone = function(tarPage, listener, datas) {
		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		if(!datas) {
			datas = null;
		}
		console.log('tarPage:' + tarPage);
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
		}
		if(targetPage) {
			//触发目标页面的listener事件
			mui.fire(targetPage, listener, {
				data: datas
			});
		} else {
			console.log('目标页面不存在' + tarPage);
		}

	}
	/**
	 * 清空子元素
	 * @param {Object} item 需清空子元素的控件
	 */
	mod.clearChild = function(item) {
		while(item.firstElementChild) {
			item.removeChild(item.firstElementChild);
		}
	}
	/**
	 * listView加载数据
	 * @param {Object} listContainer
	 * @param {Object} data
	 * @param {Object} createInner
	 */
	mod.createListView = function(listContainer, data, createInner) {
		var list = document.getElementById(listContainer);
		data.forEach(function(cell, i, data) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = createInner(cell);
			list.appendChild(li);
		})

	}
	mod.arraySingleItem = function(array) {
		var r = [];
		for(var i = 0, l = array.length; i < l; i++) {
			for(var j = i + 1; j < l; j++)
				if(array[i] === array[j]) {
					j = ++i;
				}
			r.push(array[i]);
		}
		return r;
	}
	mod.infoChanged = function() {
		events.fireToPageNone('mine.html', 'infoChanged');
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
		events.fireToPageNone('../index/index.html', 'infoChanged');
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
	}
	mod.shortForString = function(str, len) {
		if(str.length > len + 2) {
			return str.substring(0, len) + "...";
		}
		return str;
	}
	mod.shortForDate = function(fullDate) {
		var arrDate = fullDate.split(":");
		arrDate.splice(arrDate.length - 1, 1);
		var noSecond = arrDate.join(':');
		var arrSecond = noSecond.split('-');
		if(new Date().getFullYear() == arrSecond[0]) {
			arrSecond.splice(0, 1);
		}
		return arrSecond.join('-');
	}
	mod.blurBack = function(blurItemId) {
		var oldBack = mui.back;
		mui.back = function() {
			//			plus.webview.currentWebview().blur();
			document.getElementById(blurItemId).blur();
			oldBack();
		}
	}

	/**
	 * 返回一个安卓手机返回键无法关闭的等待框
	 * @author 莫尚霖
	 */
	mod.showWaiting = function() {
		var showWaiting = plus.nativeUI.showWaiting('加载中...', {
			back: 'none'
		});
		return showWaiting;
	}

	/**
	 * 关闭一个或所有的等待框
	 * @author 莫尚霖
	 * @param {Object} waiting 等待框对象
	 */
	mod.closeWaiting = function(waiting) {
		if(waiting) {
			waiting.close();
		} else {
			plus.nativeUI.closeWaiting();
		}
	}

	/**
	 * 创建一个子页面，并传递数据
	 * @author 莫尚霖
	 * @param {Object} mainWebviewObject 主页面的窗体
	 * @param {Object} subPageUrl 子页面的路径
	 * @param {Object} data 传递给子页面的数据
	 * @param {Object} loadedCallBack 子页面加载完成的回调
	 */
	mod.createSubAppendMain = function(mainWebviewObject, subPageUrl, data, loadedCallBack) {
		var sub = plus.webview.create(subPageUrl, subPageUrl.split('/')[subPageUrl.split('/').length - 1], {
			top: (localStorage.getItem('StatusHeightNo') * 1 + 45) + 'px',
			bottom: '0px'
		}, {
			data: data
		});

		sub.addEventListener('loaded', function() {
			mainWebviewObject.append(sub);
			loadedCallBack(sub);
		});
	}

	/**
	 * 修改双webview下拉刷新出现的位置，在main中使用
	 * @author 莫尚霖
	 * @param {Object} top 下拉刷新距离顶部的高度
	 */
	mod.changeTopPocket = function(top) {
		setTimeout(function() {
			var toppocket = document.querySelector('.mui-pull-top-pocket');
			var height; //高度
			if(top) {
				height = top;
			} else {
				height = localStorage.getItem('StatusHeightNo') * 1 + 45;
			}
			if(toppocket) {
				document.querySelector('.mui-pull-top-pocket').style.top = height + 'px';
			} else {
				mod.changeTopPocket(height);
			}
		}, 200);
	}
	mod.getFileNameByPath = function(filePath) {
		var filePaths = filePath.split("/");
		return new Date().getTime() + filePaths[filePaths.length - 1];
	}

	/**
	 * 退出登录后执行的方法
	 * @author 莫尚霖
	 */
	mod.logOff = function() {
		//清理上传下载的任务和界面
		events.fireToPageNone('storage_transport.html', 'removeAllTask');
		//清理云盘主页
		events.fireToPageNone('../cloud/cloud_home.html', 'cleanCloudHome');
		//清理科教
		events.fireToPageNone('../sciedu/sciedu_home.html', 'cleanSicEduHome');
		//清理展现
		events.fireToPageNone('../show/show_home_1.html.html', 'cleanShowHome');
	}

	mod.ifHaveInfo = function(info) {
		return info ? info : '暂无信息'
	}

	/**
	 *
	 * @param {Object} title 标题
	 * @param {Object} hint 提示语
	 * @param {Object} callback 确认回调
	 * @param {Object} cancelLog 取消打印信息
	 */
	mod.setDialog = function(title, hint, callback, cancelLog) {
		var btnArray = ['否', '是'];
		mui.confirm(hint, title, btnArray, function(e) {
			if(e.index == 1) {
				callback();
			} else {
				mui.toast(cancelLog)
			}
		})
	}

	return mod;

})(events || {});