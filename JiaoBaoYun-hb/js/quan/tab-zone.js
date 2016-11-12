mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: pulldownRefresh
					},
					up: {
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});

mui.plusReady(function() {
////获取个人信息
//	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
////	//需要参数
//	var comData = {
//		vtp: 'cg', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群)
//		vvl: personalUTID, //查询的各项，对应人的utid，可以是查询的任何人
//	};
//			// 等待的对话框
//			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//			postData_jiaobaoYunPro_PostGList(comData, wd, function(data) {
//				wd.close();
//				console.log('postData_jiaobaoYunPro_PostGListsuccess:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//				if(data.RspCode == 0) {
//
//				} else {
//					mui.toast(data.RspTxt);
//				}
//			});


			//跳转到学生动态界面
			mui('.mui-table-view').on('tap', '.studentsdynamic', function() {
				mui.openWindow({
					url: 'studentdynamic_main.html',
					id: 'studentdynamic_main.html',
					styles: {
						top: '0px', //设置距离顶部的距离
						bottom: '0px'
					}
				});
			});
						//跳转到班级动态界面
			mui('.mui-table-view').on('tap', '.tarClass', function() {
				mui.openWindow({
					url: 'class_space.html',
					id: 'class_space.html',
					styles: {
						top: '0px', //设置距离顶部的距离
						bottom: '0px'
					}
				});
			});


			//跳转到家长空间界面
			mui('.mui-table-view').on('tap', '.parent-cell1', function() {
				mui.openWindow({
					url: 'zone_main.html',
					id: 'zone_main.html',
					styles: {
						top: '0px', //设置距离顶部的距离
						bottom: '0px'
					}
				});
			});
			//跳转到家长空间界面
			mui('.mui-table-view').on('tap', '.parent-cell2', function() {
				mui.openWindow({
					url: 'zone_main.html',
					id: 'zone_main.html',
					styles: {
						top: '0px', //设置距离顶部的距离
						bottom: '0px'
					}
				});
			});

		})

		function getActiveControl() {
			var segmentedControl = document.getElementById("segmentedControl");
			var links = segmentedControl.getElementsByTagName('a');
			for(var i = 0; i < links.length; i++) {
				if(links[i].getAttribute('class').indexOf('mui-active') > 0) {
					var id = links[i].getAttribute('href');
					return id;
				}
			}
		}
function pulldownRefresh() {
				setTimeout(function() {
					var itemId = getActiveControl();
					console.log(itemId);
					var table;
					var cells;
					var parentCell;
					if(itemId == '#item1') {
						parentCell = 'parent-cell1';
						table = document.body.querySelector('.parent-table1');
						cells = document.body.querySelectorAll('.parent-cell1');
					} else {
						parentCell = 'parent-cell2';
						table = document.body.querySelector('.parent-table2');
						cells = document.body.querySelectorAll('.parent-cell2');
					}

					for(var i = cells.length, len = i + 3; i < len; i++) {
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell mui-media ' + parentCell;
						li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../image/tab_zone/u34.png">\<p class="time">10月18</p>\<div class="mui-media-body">张曦曦<p class="mui-ellipsis">\在今天的全校演讲比赛中，我班有6名同学获奖...</p>\</div>';
						//下拉刷新，新纪录插到最前面；
						table.insertBefore(li, table.firstChild);
					}
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				}, 1500);
			}
			var count = 0;

			function pullupRefresh() {
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
					var itemId = getActiveControl();
					console.log(itemId);
					var table;
					var cells;
					if(itemId == '#item1') {
						parentCell = 'parent-cell1';
						table = document.body.querySelector('.parent-table1');
						cells = document.body.querySelectorAll('.parent-cell1');
					} else {
						parentCell = 'parent-cell2';
						table = document.body.querySelector('.parent-table2');
						cells = document.body.querySelectorAll('.parent-cell2');
					}
					for(var i = cells.length, len = i + 20; i < len; i++) {
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell mui-media ' + parentCell;
						li.innerHTML = '	<img class="mui-media-object mui-pull-left" src="../image/tab_zone/u34.png">\<p class="time">10月18</p>\<div class="mui-media-body">张曦曦<p class="mui-ellipsis">\在今天的全校演讲比赛中，我班有6名同学获奖...</p>\</div>';
						//下拉刷新，新纪录插到最前面；
						table.appendChild(li);
					}
				}, 1500);
			}