var CloudFileUtil = (function($, mod) {
	mod.files = [];
	/**
	 * 获取当前的网络连接状态
	 * @author 莫尚霖
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
	 * 获取七牛下载的token
	 * @author 莫尚霖
	 * @param {Object} url 获取下载token路径
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 */
	mod.getQNDownToken = function(url, successCB, errorCB) {
		console.log('getQNDownToken:' + url);
		mui.ajax(url, {
			async: false,
			//			data: {
			//				Key: QNFileName
			//			},
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
	 * 创建下载任务
	 * @author 莫尚霖
	 * @param {Object} url 文件路径
	 * @param {Object} filename 下载到本地的路径
	 * @param {Object} uploadCompletedCallBack 下载完成时的回调
	 * @param {Object} onStateChangedCallBack 下载任务状态监听的回调
	 * @param {Object} successCallBack 下载任务创建成功的回调
	 */
	mod.download = function(url, filename, DownloadCompletedCallback, onStateChangedCallBack, successCallBack) {
		var dtask = plus.downloader.createDownload(url, {
				filename: filename //下载文件保存的路径
			},
			/**
			 * 下载完成时的回调
			 * @param {Object} download 下载任务对象
			 * @param {Object} status 下载结果状态码
			 */
			function(download, status) {
				// 下载完成
				DownloadCompletedCallback(download, status);
			}
		);
		//下载状态变化的监听
		dtask.addEventListener("statechanged",
			/**
			 * 下载状态变化的监听
			 * @param {Object} download 下载任务对象
			 * @param {Object} status 下载结果状态码
			 */
			function(download, status) {
				onStateChangedCallBack(download, status);
			}
		);
		successCallBack(dtask);
		//dtask.start();
	}

	/**
	 * 创建下载任务
	 * @author 莫尚霖
	 * @param {Object} url 要下载文件资源地址
	 * @param {Object} filename 下载文件保存的路径
	 * @param {Object} callback 下载成功回调
	 */
	mod.downloadFile = function(url, fileName, callback) {
		var dtask = plus.downloader.createDownload(url, {
				filename: fileName //下载文件保存的路径
			},
			/**
			 * 下载完成时的回调
			 * @param {Object} download 下载任务对象
			 * @param {Object} status 下载结果状态码
			 */
			function(d, status) {
				// 下载完成
				if(status == 200) {
					callback(d);
					console.log("Upload success" + d.filename);
					//上传失败
				} else {
					mui.toast('上传失败,请重新上传:' + status);
				}
			}
		);
		//下载状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
		dtask.start();
	}

	/**
	 * 获取上传到七牛的uptoken（单个文件的token）
	 * @author 莫尚霖
	 * @param {Object} url 获取token的url
	 * @param {Object} data 数据 json
	 * @param {Object} successCB 成功的回调successCB(data)
	 * @param {Object} errorCB 失败的回调errorCB(xhr, type, errorThrown);
	 * data={
	 * 	type:'',//str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
	 *  QNFileName:'',//str 必填 存放到七牛的文件名
	 *  appId:'' , //int 必填 项目id
	 *  mainSpace:'', //str 必填 文件存放在私有空间或公有空间
	 *  uploadSpace: '',//str 必填  上传的空间
	 *  imageThumb:'',//str json 选填 type为0时有效，缩略图存放在私有空间或公有空间，默认mainSpace
	 *  style:{ 	//json 选填 type为0时有效，配置生成缩略图的最大宽和高
	 * 		maxWidth:'', //int 配置生成缩略图的最大宽,默认100
	 *  	maxHeight:'' //int 配置生成缩略图的最大高，默认100
	 *  }
	 * }
	 */
	mod.getQNUpToken = function(url, data, successCB, errorCB) {
		console.log('getQNUpToken ' + url + ' ' + JSON.stringify(data));
		var type = ''; //获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
		var QNFileName = ''; //存放到七牛的文件名
		var desKey = ''; //项目名称
		var appId = 0; //项目id
		var mainSpace = ''; //文件存放在私有空间或公有空间
		var imageThumb = ''; //缩略图存放在私有空间或公有空间
		var saveSpace = ''; //上传的空间
		var configure = {}; //配置的数据
		var maxWidth = '100'; //type为0时 缩略图默认宽为100
		var maxHeight = '100'; //type为0时 缩略图默认高为100
		if(data) {
			if(data.type) {
				type = data.type
				if(type == 0) {
					if(data.style) {
						if(data.style.maxWidth) {
							maxWidth = data.style.maxWidth
						}
						if(data.style.maxHeight) {
							maxHeight = data.style.maxHeight
						}
					}
				}
			}
			if(data.QNFileName) {
				QNFileName = data.QNFileName;
			}
			if(data.appId) {
				appId = data.appId;
				switch(data.appId) {
					case 0:
						break;
					case 1:
						break;
					case 2: //资源平台
						desKey = "jsy8004";
						break;
					case 3: //教宝云作业
						desKey = "zy309309!";
						break;
					case 4: //教宝云盘
						desKey = "jbyp@2017"
						break;
					case 5: //教宝云用户管理
						desKey = "jbman456"
						break;
					case 6: //家校圈
						desKey = "jxq789!@";
						break;
					case 7: //家校圈
						desKey = "qz123qwe";
						break;
					default:
						break;
				}
			}
			if(data.mainSpace) {
				mainSpace = data.mainSpace;
			}
			if(data.imageThumb) {
				imageThumb = data.imageThumb;
			}
			if(imageThumb == '') {
				imageThumb = mainSpace;
			}
			if(data.uploadSpace) {
				saveSpace = data.uploadSpace;
			}

		}
		if((type == '0' || type == '1') && QNFileName != '' && desKey != '' && mainSpace != '' && saveSpace != '') {
			var thumbSpace = ''; //缩略图的七牛空间
			var ops = '' //七牛预持久化命令
			if(type == '0') {
				thumbSpace = saveSpace + 'Thumb/'; //缩略图的七牛空间
				var temp = QNFileName.split('.');
				console.log(JSON.stringify(temp));
				var thumbName = temp[0];
				var thumbType = temp[1];
				if(thumbType == 'avi' || thumbType == 'mp4' || thumbType == 'flv' || thumbType == 'swf' || thumbType == '3gp' || thumbType == 'rm') {
					//视频
					configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					ops = "vframe/png/offset/1/w/" + maxWidth + "/h/" + maxHeight + "|saveas/" + configure.thumbKey;
				} else {
					//图片
					if(appId == 5) { //头像
						configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + QNFileName);
					} else if(appId == 4) { //云存储
						configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					}
					ops = "imageView2/2/w/" + maxWidth + "/h/" + maxHeight + "/format/png|saveas/" + configure.thumbKey;
				}
			}

			var param = {
				Bucket: mainSpace,
				Key: saveSpace + QNFileName,
				Pops: ops,
				NotifyUrl: ''
			}
			console.log("参数数据：" + JSON.stringify(param))
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(param))
			}
			console.log("参数数据：" + JSON.stringify(configure.options))
			//获取token
			mod.getQNUpTokenWithManage(url, configure.options, function(data) {
				successCB({
					configure: configure,
					data: data
				});
			}, function(xhr, type, errorThrown) {
				errorCB(xhr, type, errorThrown);
			});
		} else {
			errorCB('### ERROR ### 配置获取七牛上传token参数错误');
		}
	}

	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传单张图片）
	 * @author 安琪
	 * @param {Object} picPath 图片本地路径
	 * @param {Object} appId AppID
	 * @param {Object} maxSize 最大长宽
	 * @param {Object} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {Object} uploadSpace 上传的空间
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getSingleUploadDataOptions = function(picPath, appId, maxSize, spaceType, uploadSpace) {
		var data = {};
		var desKey;
		switch(appId) {
			case 0:
				break;
			case 1:
				break;
			case 2: //资源平台
				desKey = "jsy8004";
				break;
			case 3: //教宝云作业
				desKey = "zy309309!";
				break;
			case 4: //教宝云盘
				desKey = "jbyp@2017";
				break;
			case 5: //教宝云用户管理
				desKey = "jbman456";
				break;
			case 6: //家校圈
				desKey = "jxq789!@";
				break;
			case 7: //家校圈
				desKey = "qz123qwe";
				break;
			default:
				break;
		}
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var saveSpace = uploadSpace;
		var thumbSpace = saveSpace + 'thumb/';
		var QNFileName = events.getFileNameByPath(picPath);
		data.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
		var ops = "imageView2/2/w/" + maxSize + "/h/" + maxSize + "/format/png|saveas/" + data.thumbKey;
		var param = {
			Bucket: mainSpace,
			Key: saveSpace + QNFileName,
			Pops: ops,
			NotifyUrl: ''
		}
		console.log("参数数据：" + JSON.stringify(param))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(param))
		}
		console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		return data;
	}

	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传多张图片）
	 * @author 安琪
	 * @param {Object} picPaths 图片本地路径
	 * @param {Object} appId AppID
	 * @param {Object} maxSize 最大长宽
	 * @param {Object} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {Object} uploadSpace 上传的空间
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getMultipleUploadDataOptions = function(picPaths, appId, maxSize, spaceType, uploadSpace) {
		var data = {};
		var desKey;
		switch(appId) {
			case 0:
				break;
			case 1:
				break;
			case 2: //资源平台
				desKey = "jsy8004";
				break;
			case 3: //教宝云作业
				desKey = "zy309309!";
				break;
			case 4: //教宝云盘
				desKey = "jbyp@2017"
				break;
			case 5: //教宝云用户管理
				desKey = "jbman456"
				break;
			case 6: //家校圈
				desKey = "jxq789!@";
				break;
			case 7: //家校圈
				desKey = "qz123qwe";
				break;
			default:
				break;
		}
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var saveSpace = uploadSpace;
		var thumbSpace = saveSpace + 'thumb/';
		var QNFileName;
		//		var QNFileNames =[];
		data.thumbKeys = []
		//		var ops=[];
		var thumbKey;
		var params = [];
		for(var i in picPaths) {
			var param = {};
			param.Bucket = mainSpace;
			QNFileName = events.getFileNameByPath(picPaths[i])
			//			QNFileNames.push(QNFileName);
			thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
			data.thumbKeys.push(thumbKey);
			param.Key = saveSpace + QNFileName;
			console.log('key:' + param.Key);
			param.Pops = "imageView2/2/w/" + maxSize + "/h/" + maxSize + "/format/png|saveas/" + thumbKey;
			param.NotifyUrl = '';
			params.push(param);
		}
		console.log("参数数据：" + JSON.stringify(params))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}
		console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		console.log('加密后的data:' + JSON.stringify(data));
		return data;
	}

	/**
	 * 获取上传的token
	 * @author 安琪
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 */
	mod.getQNUpTokenWithManage = function(url, data, successCB, errorCB) {
		mui.ajax(url, {
			async: false,
			data: data, //请求参数
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒
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
	 * @author 莫尚霖
	 * @param {Object} fPath 文件路径
	 * @param {Object} token 七牛上传token
	 * @param {Object} key 七牛上传key
	 * @param {Object} uploadCompletedCallBack 上传完成时的回调
	 * @param {Object} onStateChangedCallBack 上传任务状态监听的回调
	 * @param {Object} successCallBack 上传任务创建成功监听的回调
	 */
	mod.upload = function(fPath, token, key, uploadCompletedCallBack, onStateChangedCallBack, successCallBack) {
		console.log('upload fPath ' + fPath);
		console.log('upload token ' + token);
		console.log('upload key ' + key);
		var task = plus.uploader.createUpload("http://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				uploadCompletedCallBack(upload, status);
			}
		);
		task.addData("key", key);
		task.addData("token", token);
		task.addFile(fPath, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged",
			/**
			 * 上传状态变化的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				onStateChangedCallBack(upload, status);
			}, false);
		//console.log('upload2:' + fPath + '|' + type + "|" + QNUptoken);
		successCallBack(task);
		//task.start();
	}

	/**
	 * 单张图片文件上传
	 * @author 安琪
	 * @param {Object} path 要上传文件的目标地址
	 * @param {Object} fileName 本地路径
	 * @param {Object} QNUptoken 上传token
	 * @param {Object} callback 回调函数
	 */
	mod.uploadFile = function(tokenInfo, fileName, callback) {
		//console.log('upload:' + fPath);
		var task = plus.uploader.createUpload("http://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				callback(upload, status);
			}
		);

		task.addData("key", tokenInfo.Key);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", tokenInfo.Token);
		task.addFile(fileName, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
		task.start();
	}

	/**
	 * 多张图片上传
	 * @author 安琪
	 * @param {Object} paths 要上传文件的目标地址
	 * @param {Object} fileNames 本地路径
	 * @param {Object} QNUptokens 上传token
	 * @param {Object} callback 回调函数
	 */
	mod.uploadFiles = function(fileNames, tokenInfos, callback) {
		var tasks = [];
		for(var i in tokenInfos) {
			//console.log('upload:' + fPath);
			var task = plus.uploader.createUpload("http://upload.qiniu.com/", {
					method: "POST"
				},
				/**
				 * 上传任务完成的监听
				 * @param {Object} upload 上传任务对象
				 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
				 */
				function(upload, status) {
					callback(upload, status);
				}
			);
			task.addData("key", tokenInfos[i].Key);
			//task.addData("scope", scope + ':' + type);
			task.addData("token", tokenInfos[i].Token);
			task.addFile(fileNames[i], {
				"key": 'file',
				"name": "file"
			});

			//上传状态变化的监听
			task.addEventListener("statechanged", onStateChanged, false);
			tasks.push(task);
		}
		plus.uploader.startAll();
	}
	// 监听上传任务状态
	function onStateChanged(upload, status) {
		//		console.log('mui上传状态：' + upload.state)
		if(upload.state == 4 && status == 200) {
			// 上传完成
			//			console.log("Upload success: " + upload.getFileName());
		}
	}

	/**
	 * 批量删除七牛的文件
	 * @param {Object} Url 批量删除文件的地址
	 * @param {Object} fileUrl 所有的文件路径'['url1','url2']'
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.BatchDelete = function(Url, fileUrl, successCB, errorCB) {
		console.log('BatchDelete:' + Url + '|' + fileUrl);
		mui.ajax(Url, {
			async: false,
			data: {
				Paths: fileUrl
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
	 * 在界面上放置图片
	 * @author 安琪
	 * @param {Object} img
	 * @flag {Object} 1获取的 0：上传模式
	 */
	mod.setPic = function(img, flag) {
		mod.files.push(img);
		//	picPath=camero.getAbsolutePath(picPath);
		var pictures = document.getElementById('pictures');
		var div = document.createElement('div');
		div.img = img;
		div.className = 'img-div';
		if(flag) {
			div.innerHTML = '<img src="' + img.thumb + '" data-preview-src="' + img.url + '" data-preview-group="1"/>' +
				'<a class="mui-icon iconfont icon-guanbi"></a>';
		} else {
			div.innerHTML = '<img src="' + img.url + '" data-preview-src="' + img.url + '" data-preview-group="1"/>' +
				'<a class="mui-icon iconfont icon-guanbi"></a>';
		}

		console.log("放置的图片信息:" + JSON.stringify(img));
		pictures.appendChild(div);
	}

	/**
	 *
	 * @param {Object} pics
	 *  @author 安琪
	 */
	mod.rechargePicsData = function(pics) {
		var files=[];
		for(var i in pics) {
			var img = {};
			img.url = pics[i].Url;
			img.thumb = pics[i].ThumbUrl;
			img.order = pics[i].DisplayOrder;
			img.type = pics[i].FileType;
			files.push(img);
		}
		files.sort(function(a, b) {
			return a.order - b.order;
		})
		return files;
	}
	
	/**
	 * 放置删除图片的监听
	 * @author 安琪
	 */
	mod.setDelPicListener = function() {
		//删除图标的点击事件
		mui('#pictures').on('tap', '.icon-guanbi', function() {
			for(var i in mod.files){
				if(this.parentElement.img.url==mod.files[i].url){
					mod.files.splice(i,1);
					break;
				}
			}
			//删除图片
			var pictures = document.getElementById('pictures');
			pictures.removeChild(this.parentElement);
		})
	}
	return mod;
})(mui, window.ColudFileUtil || {});