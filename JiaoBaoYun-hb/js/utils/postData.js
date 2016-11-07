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
		success: callback,
		error: function(xhr, type, errorThrown) {
			waitingDialog.close();
			mui.alert("网络连接失败，请重新尝试一下", "错误", "OK", null);
		}
	});
}

function postDataEncry(url, encryData, commonData, waitingDialog, callback) {
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
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
	var signTemp = sortUrls.sortIt(signArr);

	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, storageKeyName.SIGNKEY, function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = Object.assign(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//发送协议
		mui.ajax(url, {
			data: JSON.stringify(tempData),
			dataType: 'json',
			type: 'post',
			contentType: "application/json",
			timeout: 60000,
			success:callback,
			error: function(xhr, type, errorThrown) {
				waitingDialog.close();
				mui.alert("网络连接失败，请重新尝试一下", "错误", "OK", null);
			}
		});
	});
}