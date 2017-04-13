//在求知中，详情页，进行删除操作时调用

//data{
//flag:提问详情页，删除提问1，删除回答2；回答详情页，删除回答2，删除评论3；班级空间：删除动态4
//comData:协议需要参数
//title:弹出框中，显示的标题
//delFlag:删除确认弹出框格式，1从下弹出，2中间confirm
//}
//callback:删除时，是否成功，code
var delContent_pop = function(data, callback) {
	if(data.delFlag == 1) { //1从下弹出
		var btnArray = [{
			title: "确定"
		}];
		plus.nativeUI.actionSheet({
			title: data.title,
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			switch(index) {
				case 0: //取消
					break;
				case 1: //确定
					delContent_req(data, callback);
					break;
			}
		});
	} else { //2从中间弹出confirm
		mui.confirm('', data.title, ['取消', '确定'], function(e) {
			var index = e.index;
			switch(index) {
				case 0: //取消
					break;
				case 1: //确定
					delContent_req(data, callback);
					break;
			}
		}, 'div');
	}
}

var delContent_req = function(data, callback) {
	// 等待的对话框
	var wd = events.showWaiting();
	if(data.flag == 1) { //删除提问1
		//37.删除某个用户的某条提问
		postDataQZPro_delAskById(data.comData, wd, function(data) {
			wd.close();
			console.log('37.删除某个用户的某条提问:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			callback(data.RspCode);
			if(data.RspCode == 0) {

			} else {
				mui.toast(data.RspTxt);
			}
		});
	} else if(data.flag == 2) { //删除回答2
		//11.删除某个用户的某条回答
		postDataQZPro_delAnswerById(data.comData, wd, function(data) {
			wd.close();
			console.log('11.删除某个用户的某条回答:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			callback(data.RspCode);
			if(data.RspCode == 0) {

			} else {
				mui.toast(data.RspTxt);
			}
		});
	} else if(data.flag == 3) { //删除评论3
		//18.删除某条回答的评论
		postDataQZPro_delCommentById(data.comData, wd, function(data) {
			wd.close();
			console.log('18.删除某条回答的评论:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			callback(data.RspCode);
			if(data.RspCode == 0) {

			} else {
				mui.toast(data.RspTxt);
			}
		});
	} else if(data.flag == 4) { //删除动态4
		//46.（用户空间）删除某用户空间
		postDataPro_delUserSpaceById(data.comData, wd, function(data) {
			wd.close();
			console.log('46.（用户空间）删除某用户空间:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			callback(data.RspCode);
			if(data.RspCode == 0) {

			} else {
				mui.toast(data.RspTxt);
			}
		});
	}else{
		wd.close();
		callback('啥都不返回');
	}
}