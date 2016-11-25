//页码，请求第几页数据
var tempPage = 1;
//当前留言的总条数
var totalCnt = 0;
//获取个人信息                                                        
var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//判断是加载更多1，还是刷新2
var flag = 2;
//页码请求到要显示的数据，array[model_userSpaceAboutMe]
var aboutMeArray = [];
mui.init();
mui.plusReady(function(){
	requestData();
})
//请求数据
function requestData() {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	var comData = {
		userId: personalUTID, //用户ID
		pageIndex: '1', //当前页数
		pageSize: '10' //每页记录数
	};
	//56.（用户空间）获取与我相关
	postDataPro_getAboutMe(comData, wd, function(data) {
		wd.close();
		console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.UserId);
				//循环当前model中的回复数组
				for(var item1 in tempModel0.MsgArray) {
					//回复中的model
					var tempModel1 = tempModel0.MsgArray[item1];
					//将回复中的id塞到数组
					tempArray.push(tempModel1.MsgFrom);
					tempArray.push(tempModel1.MsgTo);
				}
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			console.log('tempData:' + JSON.stringify(tempData));
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd, function(data1) {
				wd.close();
				console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
				if(data1.RspCode == 0) {
					//循环当前的个人信息返回值数组
					for(var i in data1.RspData) {
						//当前model
						var tempModel = data1.RspData[i];
						//更新头像
						tempModel.uimg = updateHeadImg(tempModel.uimg, 1);
						//循环留言数组
						for(var item in tempRspData) {
							//当前循环的model
							var tempModel0 = tempRspData[item];
							//对比id是否一致
							if(tempModel0.utid == tempModel.UserId) {
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
							//循环当前model中的回复数组
							for(var item1 in tempModel0.MsgArray) {
								//回复中的model
								var tempModel1 = tempModel0.MsgArray[item1];
								//对比id是否一致
								if(tempModel.utid == tempModel1.MsgFrom) {
									//添加参数
									tempModel1.MsgFromName = tempModel.unick;
									tempModel1.MsgFromImg = tempModel.uimg;
								}
								if(tempModel.utid == tempModel1.MsgTo) {
									//添加参数
									tempModel1.MsgToName = tempModel.unick;
									tempModel1.MsgToImg = tempModel.uimg;
								}
							}
						}
					}
				}
				console.log('循环遍历后的值：' + JSON.stringify(tempRspData));

				//判断是加载更多1，还是刷新2
				if(flag == 1) {
					//合并数组
					aboutMeArray = aboutMeArray.concat(data.RspData.Data);
				} else {
					tempPage = 1;
					//合并数组
					aboutMeArray = data.RspData.Data;
				}
				//留言总条数
				totalCnt = data.RspData.TotalCnt;
			});
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

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
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	totalCnt = 0;
	flag = 2; //刷新
	var comData = {
		userId: personalUTID, //用户ID
		pageIndex: '1', //当前页数
		pageSize: '10' //每页记录数
	};
	//请求数据
	requestData(comData);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	if(tempPage * 10 > totalCnt || tempPage * 10 == totalCnt) {
		mui.toast('没有更多了...');
	} else {
		flag = 1; //加载更多
		tempPage++;
		var comData = {
			userId: personalUTID, //用户ID
			pageIndex: (tempPage).toString(), //当前页数
			pageSize: '10' //每页记录数
		};
		//请求数据
		requestData(comData);
	}
}