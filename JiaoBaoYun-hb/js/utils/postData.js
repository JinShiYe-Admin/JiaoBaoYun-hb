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
		timeout: 1000,
		success: callback,
		error: function(xhr, type, errorThrown) {
			waitingDialog.close();
			mui.alert("网络连接失败，请重新尝试一下", "错误", "OK", null);
		}
	});
}