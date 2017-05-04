/**
 * 上传、下载组件
 */
var load = (function(mod) {
	/**
	 * 上传文件
	 * @param {Object} url 上传接口
	 * @param {Object} paths 需上传文件的路径
	 */
	mod.createUpload = function(url, paths, savePath, getToken) {
		//等待框
		var wt = plus.nativeUI.showWaiting();
		//创建上传方法
		var task = plus.uploader.createUpload(url, {
				method: "POST",
				blocksize: 409600,
				priority: 100
			},
			function(t, status) {
				//关闭对话框
				wt.close();
				console.log('当前状态：' + status);
				//上传完成
				//上传成功
				if(status == 200) {
					console.log("Upload success" + t.responseText);
					//上传失败
				} else {
					mui.toast('上传失败,请重新上传');
				}
			});

		task.addData('token', getToken)
		//加载所有文件
		paths.forEach(function(path, i) {
			task.addData('key', path);
			task.addFile(path, {
				key: "file",
				name: "file"
			});
			console.log(path);
		})
		task.addEventListener("statechanged", onStateChanged, false);
		//开始上传
		task.start();
		console.log('start');
	}
	// 监听上传任务状态
	function onStateChanged(upload, status) {
		console.log('mui上传状态：' + upload.state)
		if(upload.state == 4 && status == 200) {
			// 上传完成
			console.log("Upload success: " + upload.getFileName());
		}
	}
	/**
	 * 
	 * @param {Object} type
	 * @param {Object} saveSpace
	 * @param {Object} isClip
	 */
	mod.getManageOptions = function(type,saveSpace,isClip) {
		var data = {};
		data.spaceId = spaceId;
		data.saveSpace = saveSpace;
		data.spaceType = 0; //公共空间
		switch(type) {
			case 1: //图片
				data.options = {
					type:0,
					thumbSize: {
						width: 200,
						height: 200
					},
					cropSize: {
						width: event.width,
						height: event.width * 0.45
					}
				}
				if(isClip){
					data.options.type=10;
				}
				break;
			case 2: //视频
				break;
			case 3: //文字
				break;
			case 4: //音频
				break;
			default:
				break;
		}
	}
	/**
	 * 
	 * @param {Number} type
	 * @param {Object} fileData {filePath:,spaceId: ,saveSpace:,manageOptions:,}
	 */
	mod.upload = function(type, fileData) {
		switch(type) {
			case 1: //图片

				break;
			case 2: //视频
				break;
			case 3: //文字
				break;
			case 4: //音频
				break;
			default:
				break;
		}
	}
	mod.uploadImgs = function(imgPaths, manageType) {
		plus.nativeUI.showWaiting(storageKeyName.UPLOADING, {
			back: 'none'
		}); //等待框
		console.log("保存的路径：" + JSON.stringify(paths));
		var saveSpace = storageKeyName.KNOWLEDGE; //保存路径
		compress.compressPics(paths, function(compressedPaths, widths) {
				console.log('获取的图片路径：' + JSON.stringify(compressedPaths));
				var multiOptions = [];
				for(var i in compressedPaths) {
					var options = { //上传七牛后的处理参数
						type: 1, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
						thumbSize: {
							width: 200, //缩略图最大宽度
							height: 200 //缩略图最大高度
						},
						cropSize: {
							width: widths[i],
							height: widths[i] * 0.45 //裁剪宽度值
						}
					}
					multiOptions.push(options);
				}
				//多图片处理获取参数
				var data = CloudFileUtil.getMultipleImgUploadOptions(compressedPaths, 7, 0, saveSpace, multiOptions);
				//								var data = CloudFileUtil.getMultipleUploadDataOptions(compressedPaths, 7, 200, 0, saveSpace); //获取获取token的各参数
				CloudFileUtil.getQNUpTokenWithManage(storageKeyName.QNGETUPLOADTOKEN, data.options, function(datas) {
					console.log("传回来的值：" + JSON.stringify(datas)) //回调数据
					if(datas.Status == 1) { //成功
						var tokenInfos = datas.Data; //参数信息
						var imgs = [];
						//上传图片
						CloudFileUtil.uploadFiles(compressedPaths, tokenInfos, function(uploadData, status, index) {
							console.log(JSON.stringify(uploadData));
							//												if(index == 0) {
							imgs[index] = {
								url: tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key,
								thumb: (tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key).replace(saveSpace, saveSpace + "thumb/"),
								clip: (tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key).replace(saveSpace, saveSpace + "clip/"),
								type: 1
							}
							//												} else {
							//													imgs[index] = {
							//														url: tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key,
							//														thumb: (tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key).replace(saveSpace, saveSpace + "thumb/"),
							//														type: 1
							//													}
							//												}

							picCount++;

							if(picCount == compressedPaths.length) { //所有图片已上传
								plus.nativeUI.closeWaiting(); //关闭等待框
								for(var i in imgs) {
									CloudFileUtil.setPic(imgs[i]); //放置图片
								}

							}
						});
					}
				})
			},
			//错误的回调
			function(xhr, type, errorThrown) {
				console.log("错误类型：" + type + errorThrown);
				plus.nativeUI.closeWaiting();
			});
	}
	mod.uploadVideo = function(videoPath) {

	}
	return mod
})(load || {})