var expertData; //专家详细页传来的 专家信息
var pageIndex = 1; //请求数据页面
var totalPageCount = 10; //总页码10 测试用

mui.init();

mui.plusReady(function() {
	var main = plus.webview.currentWebview();
	expertData = main.data; //接收专家详情页传来的专家用户信息
	console.log('expert-data:' + JSON.stringify(expertData));
	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		events.openNewWindowWithData('../qiuzhi/expert-detail.html', expertData);
	});

//初次加载
requestInviteAnswer();
//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				//清除节点
				
				document.getElementById('list-container').innerHTML="";
				var self = this;
				console.log("下拉");
				pageIndex = 1;
				requestInviteAnswer();
				self.endPullDownToRefresh();
			}
		},
		up: {
			callback: function() {

				var self = this;
				console.log("上拉");
				if(pageIndex < totalPageCount) {
					pageIndex++;
					requestInviteAnswer();

				}
				self.endPullUpToRefresh();
			}
		}
	});

});

//8.获取某个回答的详情
function requestInviteAnswer(answerId) {
	//所需参数
	var comData = {
		answerId: answerId, //回答ID
		//		orderType: type, //评论排序方式,1 时间正序排序,2 时间倒序排序
		pageIndex: '1', //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 测试数据添加
	var list = new Array();
	console.log(pageIndex);
	for(var i = 0; i < 10; i++) {
		list.push({
			uimg: "../../image/cloud/cloud_0_tuku.png",
			unick: "李云" + ((pageIndex-1)*10+ i).toString(),
			channel: "教育",
			content: "史上严重的毁书事件层造成哪些名著失传？"
		});
	}

	setAnswerRecord(list)
}
/**
 * 放置邀请回答记录数据
 * @param {Object} list 回答记录数据
 */
var setAnswerRecord = function(list) {
	var listContainer = document.getElementById('list-container');
	for(var i in list) {
		createList(listContainer, list[i])
	}
}
/**
 * 拼接回答记录
 * @param {Object} listContainer
 * @param {Object} record
 */
var createList = function(listContainer, record) {

	/*	
	 * <li class="mui-table-view-cell">
							<img src="../../image/cloud/cloud_0_tuku.png">
							<div>
								<p><span>李云</span>邀请<span>刘老师</span>回答问题</p>
								<p>[教育]史上严重的毁书事件层造成哪些名著失传？</p>
							</div>
						</li>
		*/
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell';
	//拼接显示
	li.innerHTML = "<img src='" + record.uimg + "' /><div><p><span>" + record.unick + "</span>邀请<span>"+expertData.unick+"</span>回答问题</p><p>[" + record.channel + "]" + record.content + "</p></div>";
	listContainer.appendChild(li)
}