var show_list = (function(mod) {
	var showList = [{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://www.2cto.com/uploadfile/2012/0725/20120725082941503.jpg",
			anthor:"an",
			time:"2017-05-12"
		},
		{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://img05.tooopen.com/images/20141125/sy_75734382392.jpg",
			anthor:"an",
			time:"2017-05-12"
		},
		{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://img05.tooopen.com/images/20141125/sy_75734382392.jpg",
			anthor:"an",
			time:"2017-05-12"
		},
		{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://img05.tooopen.com/images/20141125/sy_75734382392.jpg",
			anthor:"an",
			time:"2017-05-12"
		},
		{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://img05.tooopen.com/images/20141125/sy_75734382392.jpg",
			anthor:"an",
			time:"2017-05-12"
		},
		{
			title: "子标题栏,乱七八糟，仪表人才，从此走上人生巅峰。我就是我 不一样的烟火",
			img: "http://img05.tooopen.com/images/20141125/sy_75734382392.jpg",
			anthor:"an",
			time:"2017-05-12"
		}
	]
	mod.getShowList = function(showCity, listContainer, callback) {
		if(showCity.pageIndex==1){
			listContainer.innerHTML="";
		}
		callback(showCity,listContainer,showList);
//		var wd = events.showWaiting();
//		postDataPro_PostTnews({
//			top: 6, //每页行数，
//			vvl: showCity.acode, //查询的区域代码,省份截取城市代码前两位,城市截取城市代码的前4位
//			vvl1: showCity.pageIndex //页码,获取第几页
//		}, wd, function(data) {
//			wd.close();
//			console.log("获取的分页新闻：" + JSON.stringify(data));
//			if(data.RspCode == 0) {
//				mod.setShowList(pageIndex, listContainer, data);
//			} else {
//
//			}
//		})
	}
	mod.setShowList = function(showCity, listContainer, showData) {
		var div = document.createElement("div");
		div.className = "cityNews-container mui-card";
		var listDiv=document.createElement("div");
		listDiv.className="mui-table-view";
		for(var i in showData) {
			var subDiv = document.createElement("li");
			subDiv.className = "mui-table-view-cell news-container";
			subDiv.innerHTML = mod.getShowInner(showData[i]);
			listDiv.appendChild(subDiv);
			div.appendChild(listDiv);
		}
		listContainer.appendChild(div);
		console.log("listContainer.innerHTML:"+listContainer.innerHTML);
		mod.endFresh();
	}
	mod.getShowInner = function(data) {
		return '<img class="news-img" src="' + data.img + '"/><div class="news-words"><p class="news-title single-line">' + data.title + '</p>'+
		'<div class="anthor-date"><p class="news-anthor">'+data.anthor+'</p><p class="news-date">'+data.time+'</p></div></div>'
	}
	mod.initFresh = function() {
		mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
			down: {
				callback: function() {
					freshContainer = this;
					oldPageIndex =showCity.pageIndex;
					freshFlag = 1;
					showCity.pageIndex = 1;
					wd = events.showWaiting(); //2.获取符合条件的专家信息
					mod.getShowList(showCity, document.getElementById("list-container"), mod.setShowList);
				}
			},
			up: {
				callback: function() {
					freshContainer = this;
					totalPage = 100;
					if(showCity.pageIndex < totalPage) {
						freshFlag = 2;
						wd = events.showWaiting();
						showCity.pageIndex++;
						mod.getShowList(showCity, document.getElementById("list-container"), mod.setShowList);
					} else {
						freshContainer.endPullUpToRefresh();
						mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
					}
				}
			}
		});
	}
	mod.endFresh = function() {
		events.closeWaiting();
		console.log("freshFlag:" + freshFlag);
		if(freshContainer) {
			console.log("freshContainer className" + freshContainer.className)
			if(freshFlag == 1) {
				console.log("走这吗？？？？？");
				freshContainer.endPullDownToRefresh();
				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
			} else if(freshFlag == 2) {
				freshContainer.endPullUpToRefresh();
			} else {
				mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
			}
		}
		freshFlag = 0;
	}
	return mod;
})(show_list || {})