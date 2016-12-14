var ColudFileUtil = (function($, mod) {

	/**
	 * 获取当前的网络连接状态
	 * @param {Object} callback 回调callback(data)
	 */
	mod.getCurrentType = function(callback) {
		var num = plus.networkinfo.getCurrentType();
		var str = '';
		switch(num) {
			case plus.networkinfo.CONNECTION_UNKNOW: //0
				str = '网络连接状态未知';
				break;
			case plus.networkinfo.CONNECTION_NONE: //1
				str = '未连接网络';
				break;
			case plus.networkinfo.CONNECTION_ETHERNET: //2
				str = '有线网络';
				break;
			case plus.networkinfo.CONNECTION_WIFI: //3
				str = '无线WIFI网络';
				break;
			case plus.networkinfo.CONNECTION_CELL2G: //4
				str = '蜂窝移动2G网络';
				break;
			case plus.networkinfo.CONNECTION_CELL3G: //5
				str = '蜂窝移动3G网络';
				break;
			case plus.networkinfo.CONNECTION_CELL4G: //6
				str = '蜂窝移动4G网络';
				break;
		}
		var data = {
			code: num,
			type: str
		}
		callback(data);
	}

	/**
	 * 获取上传到七牛的uptoken
	 * @param {Object} url 获取token的url
	 * @param {Object} QNFileName 存放到七牛的文件名
	 * @param {Object} successCB 成功的回调successCB(data)
	 * @param {Object} errorCB 失败的回调errorCB(xhr, type, errorThrown);
	 */
	mod.getQNUpToken = function(url, QNFileName, successCB, errorCB) {
		mui.ajax(url, {
			async: false,
			data: {
				Key: QNFileName
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒
			//			headers: {
			//				'Content-Type': 'application/json'
			//			},
			success: function(data) {
				//服务器返回响应
				successCB(data);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理
				errorCB(xhr, type, errorThrown);
			}
		});
	}

	/**
	 * 创建上传任务
	 * @param {Object} fPath 文件路径
	 * @param {Object} QNUptoken 七牛上传token
	 * @param {Object} uploadCompleted 完成时的回调
	 * @param {Object} onStateChanged 上传任务状态监听
	 */
	mod.upload = function(fPath, QNUptoken, QNFileName, uploadCompleted, onStateChanged) {
		//console.log('upload:' + fPath);
		var uid = Math.floor(Math.random() * 100000000 + 10000000).toString();
		var scope = "private";
		var task = plus.uploader.createUpload("http://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				uploadCompleted(upload, status);
			}
		);
		task.addData("key", QNFileName);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", QNUptoken);
		task.addFile(fPath, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged",
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				onStateChanged(upload, status);
			}, false);
		//console.log('upload2:' + fPath + '|' + type + "|" + QNUptoken);
		task.start();
	}

	return mod;
})(mui, window.ColudFileUtil || {});