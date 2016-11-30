/**
 * 与我相关界面
 * 逻辑部分
 * @anthor an
 */
//页码，请求第几页数据
var pageIndex = 1;
//每页条数
var pageCount = 10;
//当前留言的总条数
var totalCnt = 0;
//获取个人信息                                                        
var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//判断是加载更多1，还是刷新2
var flag = 2;
var pNick=myStorage.getItem(storageKeyName.PERSONALINFO).unick;
//页码请求到要显示的数据，array[model_userSpaceAboutMe]
var aboutMeArray = [];
mui.init();
mui.plusReady(function() {
		//页码1
		tempPage = 1;
		//请求并放置数据
		requestData(setData);
	})
	/**
	 * 界面放置数据
	 * @param {Object} data 请求成功后返回的数据
	 */
var setData = function(data) {
		var list = document.getElementById('list-container');
		data.forEach(function(cell, i) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = createInner(cell);
			list.appendChild(li);
		})
	}
	/**
	 * 创建Inner
	 * @param {Object} cell
	 */
var createInner = function(cell) {
		var cellData = getCellData(cell);
		var inner = '<a>' +
			'<div class="cell-title">' +
			'<img class="title-img"src="' + ifHaveImg(cellData.headImg) + '"/>' +
			'<div class="title-words">' +
			'<h4 class="title-title">' + cellData.title + '</h4>' +
			'<p class="title-words">' + cellData.time + '</p>' +
			'</div>' +
			'</div>' +
			'<p class="comment-content">' + ifHave(cellData.content) + '</p>' +
			'<div class="refer-content">'+'<span>'+pNick+':</span>' +ifHave(cellData.referContent)+'</div>' +
			'<div class="extras">' + ifHave(cellData.messages)  + '</div>'
		'</a>';
		console.log('每个cell的内容：' + inner)
		return inner;
	}
var ifHave=function(data){
	return data?data:'';
}
var ifHaveImg=function(img){
	return img?img:'../../image/utils/default_personalimage.png'
}
	/**
	 * 根据获取信息 设置
	 * @param {Object} cell 单个cell数据
	 */
var getCellData = function(cell) {
	var cellData = new Object();
	cellData.headImg = cell.uimg;
	cellData.content = cell.MsgContent;
	cellData.referContent=cell.Content;
	switch(cell.MsgType) {
		//其他用户评论
		case 1:
			cellData.title = cell.unick+' 評論了你';

			break;
			//评论的回复
		case 2:
			cellData.title = cell.unick + " 回复";
			break;
			//其他用户点赞
		case 3:
			cellData.title = cell.unick + " 赞了我";
			break;
			//其他用户留言
		case 4:
			cellData.title = cell.unick + " 给我留言";
			break;
			//留言的回复
		case 5:
			cellData.title = cell.unick + " 给我留言的回复";
			break;
		default:
			break;
	}
	cellData.time = cell.MsgDate;
	var messages = new Array();
	if(cell.MsgArray.length > 0) {
		
		cell.MsgArray.forEach(function(msg, i, msgArray) {
			if(msg.MsgContent) {
				if(msg.MsgToName) {
					messages.push('<p><span>' + msg.MsgFromName + '</span>回复<span>' + msg.MsgToName + ':</span>' + msg.MsgContent + '</p>');
				} else {
					messages.push('<p><span>' + msg.MsgFromName + ':</span>' + msg.MsgContent + '</p>');
				}
			}

		});
		
	}else{
		messages.push('<p><span>' + cell.unick + ':</span>' + cell.MsgContent+ '</p>')
	}
	cellData.messages = messages.join('');
	console.log('获取的额外数据：' + cellData.messages);
	console.log('获取的cellData：' + JSON.stringify(cellData));
	return cellData;
}

/**
 * 请求数据
 * @param {Object} callback 请求数据后的回调
 */
function requestData(callback) {
	var comData = {
		userId: personalUTID, //用户ID
		pageIndex: pageIndex + '', //当前页数
		pageSize: pageCount + '' //每页记录数
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//56.（用户空间）获取与我相关
	postDataPro_getAboutMe(comData, wd, function(data) {
		wd.close();
		console.log('获取的与我相关的数据：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			var tempRspData = data.RspData.Data;
			if(data.RspData.TotalCnt > 0) {
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
					console.log('获取个人资料success:RspCode:' + JSON.stringify(data1));
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
								if(tempModel0.UserId == tempModel.utid) {
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
					totalCnt = data.RspData.TotalCnt;
					setData(tempRspData);
				});
			} else {
				mui.toast('暂时无数据');
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 加载刷新
 */
events.initRefresh('list-container',
	function() {
		pageIndex = 1;
		requestData(setData);
	},
	function() {
		console.log('请求页面：page' + pageIndex);
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(pageIndex * pageCount >= totalCnt);
		if(pageIndex * pageCount < totalCnt) {
			pageIndex++;
			requestData(setData);
		}
	});