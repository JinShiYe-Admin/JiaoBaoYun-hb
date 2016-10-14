/**
 * @author an
 */
var events=(function($){
	/**
	 * 加载跳转界面监听的公用方法 
	 * @param {Object} item 加载监听的控件
	 * @param {Object} targetHTML 目标Url
	 */
	var jumpPage=function(item,targetHTML){
		item.addEventListener('tap',function(){
			openNewWindow(targetHTML);
		})
	}
	/**
	 * 打开新界面
	 * @param {Object} targetHTML 目标界面
	 */
	var openNewWindow=function(targetHTML){
		$.openWindow({
				url:targetHTML,
				id:targetHTML,
				show:{
					anishow:'slide-in-right'
				},
				waiting:{
					title:'正在加载...'
				},
				styles: {
						top: localStorage.getItem('$Statusbar'),
					}
			})
	}
	/**
	 * 加载子页面
	 * @param {Object} subPage 子页面
	 */
	var initSubPage=function(subPage){
		$.init({
				gestureConfig: {
					doubletap: true//启用双击监听
				},
				subpages: [{
					url: subPage,
					id: subPage,
					styles: {
						top: '45px',
						bottom: localStorage.getItem('$Statusbar'),
					}
				}]
			});
	
			var contentWebview = null;
			document.querySelector('header').addEventListener('doubletap', function() {
				if(contentWebview == null) {
					contentWebview = plus.webview.currentWebview().children()[0];
				}
				contentWebview.evalJS("$('#refreshContainer').pullRefresh().scrollTo(0,0,100)");
			});
	}
	
	/**
	 * 刷新
	 * @param {Object} id 刷新的list控件
	 * @param {Object} fresh 下拉刷新加载数据的方法
	 * @param {Object} addMore 上拉刷新加载数据的方法
	 */
	var initRefresh=function(id,fresh,addMore){
			$.init({
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
						var item = document.getElementById(id)
						//清除所有数据
						while(item.firstChild!=null) {
							item.removeChild(item.firstChild)
						}
						//加载新控件
						fresh();
						$('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
					}, 150);
				}
				var count = 0;
				/**
				 * 上拉加载具体业务实现
				 */
				function pullupRefresh() {
					setTimeout(function() {
						$('#refreshContainer').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
						var item = document.getElementById(id)
						var cells = document.body.querySelectorAll('.mui-table-view-cell');
						//加载更多数据
						addMore();
					}, 1500);
				}
	}
	/**
	 * 预加载页面
	 * @param {Object} tarPage 目标页面
	 */
	var preLoad=function(tarPage){
		//初始化预加载详情页面
		$.init({
		  preloadPages:[{
		    id:tarPage,
		    url:tarPage,  
		    styles: {
			top: localStorage.getItem('$Statusbar'),
			}
		  }]
		
		});
	}
	/**
	 * 传递数据到指定页面
	 * @param {Object} tarPage 目标页面
	 * @param {Object} listener 事件名称
	 * @param {Object} item 绑定控件
	 * @param {Object} datas
	 */
	var fireToNewPage=function(tarPage,listener,item,datas){
		
		console.log('tarPage:'+tarPage);
		var targetPage = null;
		//添加列表项的点击事件
		item.addEventListener('tap',function() {
		  //获得目标页面
		  if(!targetPage){
		    targetPage = plus.webview.getWebviewById(tarPage);
		  }
		  //触发目标页面的listener事件
		  $.fire(targetPage,listener,{
		    data:datas
		  });
		//打开m目标页面          
		 openNewWindow(tarPage)
		});  
	}
	/**
	 * 清空子元素
	 * @param {Object} item 需清空子元素的控件
	 */
	var clearChild=function(item){
		while(item.firstElementChild){
			item.removeChild(item.firstElementChild);
		}
	}
	
	return {
		jumpPage: jumpPage, //跳转页面
		openNewWindow: openNewWindow,//打开新页面
		initSubPage:initSubPage,//加载子页面
		initRefresh:initRefresh,//刷新
		preLoad:preLoad,//预加载
		fireToNewPage:fireToNewPage,//传递数据到新界面
		clearChild:clearChild//清空子元素
	}

})(mui);
