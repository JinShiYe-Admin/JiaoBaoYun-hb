var ExpertsInfoModel; //专家详细页传来的 专家信息
var pageIndex = 1; //请求数据页面
var totalPageCount; //总页码
var flagRef = 0; //是刷新0，还是加载更多1
var questionArray = []; //回答总数组
mui.init();

mui.plusReady(function() {
	//	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
	//		events.openNewWindowWithData('../qiuzhi/expert-detail.html', expertData);
	//	});

	window.addEventListener('focus-question', function(event) {
		ExpertsInfoModel = event.detail.data;
		console.log('传值的model为=' + JSON.stringify(ExpertsInfoModel));
		//清除节点

		document.getElementById('list-container').innerHTML = "";
		//26.获取某个用户的关注问题列表
		getFocusAsksByUser(ExpertsInfoModel.UserId);
	});
	//初次加载
	getFocusAsksByUser();
	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				//清除节点

				document.getElementById('list-container').innerHTML = "";
				var self = this;
				console.log("下拉刷新");
				pageIndex = 1;
				flagRef = 0;
				//26.获取某个用户的关注问题列表
				getFocusAsksByUser(ExpertsInfoModel.UserId);
				self.endPullDownToRefresh();
			}
		},
		up: {
			callback: function() {

				var self = this;
				console.log("上拉加载更多");
				if(pageIndex < totalPageCount) {
					pageIndex++;
					//26.获取某个用户的关注问题列表
					getFocusAsksByUser(ExpertsInfoModel.UserId);

				}
				self.endPullUpToRefresh();
			}
		}
	});

});

//26.获取某个用户的关注问题列表
function getFocusAsksByUser(userId) {
	//需要加密的数据
	var comData = {
		userId: userId, //用户ID
		pageIndex: '1', //当前页数
		pageSize: 10 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//26.获取某个用户的关注问题列表
	postDataQZPro_getFocusAsksByUser(comData, wd, function(data) {
		wd.close();
		console.log('26.获取某个用户的关注问题列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//总页数
			totalPageCount = data.RspData.TotalPage;
			if(flagRef == 0) { //刷新
				questionArray = data.RspData.Data;
			} else { //加载更多
				pageIndex++;
				//合并数组
				questionArray = questionArray.concat(data.RspData.Data);
			}
			setQuestionRecord(data.RspData.Data);
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

/**
 * 放置关注问题记录数据
 * @param {Object} list 关注问题记录数据
 */
var setQuestionRecord = function(list) {
	var listContainer = document.getElementById('list-container');
	for(var i in list) {
		createList(listContainer, list[i])
	}
}
/**
 *
 * @param {Object} cell
 */
var getChannelIcon = function(channelName) {
	var iconSourse = "../../image/qiuzhi/";
	switch(channelName) {
		case "教学":
			iconSourse += "channel-edu.png";
			break;
		case "美食":
			iconSourse += "channel-food.png";
			break;
		case "健康":
			iconSourse += "channel-health.png";
			break;
		case "其他":
			iconSourse += "channel-others.png";
			break;
		default:
			iconSourse = "";
			break;
	}
	return iconSourse;
}
/**
 * 拼接问题记录
 * @param {Object} listContainer
 * @param {Object} record
 */
var createList = function(listContainer, record) {
console.log("图片path："+getChannelIcon(record))

	
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell';
	//拼接显示

	li.innerHTML = '<a>'+
						'<div class="channel-info">'+
							'<p>'+
								'<img src="'+getChannelIcon(record)+'"  class="channel-icon head-portrait "/>来自话题:'
							+record.AskChannel+
						'</p>'+

					'</div>'+
					'<div class="ask-container ">'+
						'<h5 class="single-line ask-title " >'+record.AskTitle+'</h5>'+
						
					'</div>'+
					'<p>' +record.FocusNum+'关注·'+record.AnswerNum+'回答'+'</p>'+
				'</a>'
	listContainer.appendChild(li)
}