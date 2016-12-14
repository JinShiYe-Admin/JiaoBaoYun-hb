//url
//data
//callback,返回方法
//waitingDialog,失败弹出框
function postData(url, data, callback, waitingDialog) {
	mui.ajax(url, {
		data: JSON.stringify(data),
		dataType: 'json',
		type: 'post',
		contentType: "application/json",
		timeout: 60000,
		success: function(data) {
//			console.log('data.RspCode:' + data.RspCode + 'data.data:' + data.data);
			if(data.RspCode == 6) {
				renewToken();
			} else {
				callback(data);
			}
		},
		error: function(xhr, type, errorThrown) {
			waitingDialog.close();
			mui.alert("网络连接失败，请重新尝试一下", "错误", "OK", null);
		}
	});
}
//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//waitingDialog,等待框
//callback,返回值
function postDataEncry(url, encryData, commonData, flag, waitingDialog, callback) {
	//	if (plus.networkinfo.getCurrentType(==plus.networkinfo.CONNECTION_NONE)) {
	//		mui.toast("网络异常，请检查网络设置！");
	//		return;
	//	}
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
	}
	//判断是否需要添加共用数据
	if(flag == 1) {
		//获取个人信息
		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
		var comData = {
			uuid: plus.device.uuid,
			utid: personalUTID,
			token: personalToken,
			appid: plus.runtime.appid
		};
		commonData = $.extend(commonData, comData);
	} else if(flag == 2) {
		//获取个人信息
		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
		var comData = {
			uuid: plus.device.uuid,
			token: personalToken,
			appid: plus.runtime.appid
		};
		commonData = $.extend(commonData, comData);
	} else if(flag == 3) {
		//获取个人信息
		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
		var comData = {
			token: personalToken
		};
		commonData = $.extend(commonData, comData);
	}
	//将对象转为数组
	var arr0 = [];
	for(var item in encryData) {
		arr0.push(item + '=' + encryData[item]);
	};
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	//拼接登录需要的签名
	var signTemp = signArr.sort().join('&');
	//	var signTemp = sortUrls.sortIt(signArr);

	//	console.log('sign:'+signTemp);
	//将对象转为数组
	//	var arr0 = [];
	//	for(var item in encryData) {
	//		arr0.push(item);
	//	};
	//	var arr1 = [];
	//	for(var item in commonData) {
	//		arr1.push(item);
	//	};
	//	//合并数组
	//	var signArr = arr0.concat(arr1);
	//	//拼接登录需要的签名
	//	var signTemp0 = sortUrls.sortIt(signArr);
	//	//将拼接好的签名，拆为数组
	//	var signTempArr = signTemp0.split('&');
	//	//合并对象
	//	var tempData0 = $.extend(encryData, commonData);
	//	//循环遍历，找对应的值，然后拼接
	//	var signTemp = '';
	//	for (var tempSign in signTempArr) {
	//		for(var item in tempData0) {
	//			if (signTempArr[tempSign] == item) {
	//				signTemp = signTemp+item + '=' + tempData0[item]+'&';
	//			}
	//		};
	//	}
	//	signTemp = signTemp.substring(0,signTemp.length-1);

	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, storageKeyName.SIGNKEY, function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		//		var tempData = Object.assign(encryData, commonData);
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		var urlArr = url.split('/');
		for(var item in tempData){
			console.log('postData.tempData:' + urlArr[urlArr.length-1]+' ' + item+':'+tempData[item]);
		}
		console.log('postData.tempData:' + urlArr[urlArr.length-1] + JSON.stringify(tempData));
		//发送协议
		mui.ajax(url, {
			data: JSON.stringify(tempData),
			dataType: 'json',
			type: 'post',
			contentType: "application/json",
			timeout: 60000,
			//			success: callback,
			success: function(data) {
//				console.log('data.RspCode:' + data.RspCode + 'data.data:' + data.data);
				if(data.RspCode == 6) {
					renewToken();
				} else {
					callback(data);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(''+url+':'+ type + ',' + JSON.stringify(xhr) + ','  + errorThrown);
				waitingDialog.close();
				mui.toast("网络连接失败，请重新尝试一下");
			}
		});
	});
}