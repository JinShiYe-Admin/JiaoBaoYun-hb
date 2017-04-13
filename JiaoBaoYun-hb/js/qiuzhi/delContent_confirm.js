//在求知中，详情页，进行删除操作时调用
//flag:提问详情页，删除提问1，删除回答2；回答详情页，删除回答2，删除评论3；班级空间：删除动态4
//id:删除项中，对应的id
//delFlag:删除确认弹出框格式，1从下弹出，2中间confirm
//callback:删除时，是否成功，code
var delContent_confirm = function(flag, id,delFlag, callback) {
	mui.confirm('', '确定删除？', ['取消', '确定'], function(e) {
		var index = e.index;
		switch(index) {
			case 0: //取消
				break;
			case 1: //确定
				// 等待的对话框
				var wd = events.showWaiting();
				if(flag == 1) { //删除提问1
					
				} else if(flag == 2) { //删除回答2
					//所需参数
					var comData = {
						answerId: id //回答ID
					};
					//11.删除某个用户的某条回答
					postDataQZPro_delAnswerById(comData, wd, function(data) {
						wd.close();
						console.log('11.删除某个用户的某条回答:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
						callback(data.RspCode);
						if(data.RspCode == 0) {

						} else {
							mui.toast(data.RspTxt);
						}
					});
				} else if(flag == 3) { //删除评论3
					//所需参数
					var comData = {
						commentId:id//评论ID
					};
					//18.删除某条回答的评论
					postDataQZPro_delCommentById(comData, wd, function(data) {
						wd.close();
						console.log('18.删除某条回答的评论:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
						callback(data.RspCode);
						if(data.RspCode == 0) {

						} else {
							mui.toast(data.RspTxt);
						}
					});
				} else if(flag == 4) { //删除动态4
					
				}
				callback(200);
				break;
		}
	}, 'div');
}