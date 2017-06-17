var Gallery = (function(mod) {

	/**
	 * 从相册选取视频
	 * @param {Object} callBack 回调
	 */
	mod.pickVideo = function(callBack) {
		plus.gallery.pick(function(filePath) {
			var wd = events.showWaiting('处理中...');
			mod.videoInfo(wd, filePath, callBack);
		}, function(error) {
			mod.galleryPickError(error, function(err) {
				mui.toast("打开相册失败 " + entryErrorCB.message);
				callBack({
					flag: 0,
					message: "打开相册失败 " + err.message
				});
			});
		}, {
			filter: "video",
		});
	}

	/**
	 * 判断视频是否通过限定
	 * @param {Object} wd
	 * @param {Object} filePath
	 * @param {Object} callBack
	 */
	mod.videoInfo = function(wd, filePath, callBack) {
		//获取选取的视频文件对象
		plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
			//1.判断大小
			entry.getMetadata(function(metadata) {
				console.log("视频文件大小 " + metadata.size);
				if(metadata.size > (30 * 1024 * 1024)) {
					console.log("视频大小不得大于30M");
					wd.close();
					mui.toast("视频大小不得大于30M");
					callBack({
						flag: 0,
						message: "视频大小不得大于30M"
					});
					return false;
				}
				//获取APP的_documents文件夹对象
				plus.io.resolveLocalFileSystemURL("_documents/", function(parentEntry) {
					var myDate = new Date();
					var copyName = myDate.getTime() + parseInt(Math.random() * 1000) + '.mp4';
					//2.拷贝视频到_documents文件夹，并修改后缀为MP4
					entry.copyTo(parentEntry, copyName, function(entrySuccesCB) {
						console.log("拷贝成功");
						//3.判断时长是否在10S之内
						var mVideo = document.createElement("video");
						mVideo.ondurationchange = function() {
							console.log("视频时长 " + mVideo.duration);
							if(mVideo.duration < 11) {
								var path = entrySuccesCB.fullPath;
								if(plus.os.name == "iOS") {
									path = "file://" + path;
								} else {
									path = "file://" + plus.io.convertLocalFileSystemURL(path);
								}
								callBack({
									flag: 1, //成功
									wd: wd, //等待框
									path: path, //视频文件路径
									video: mVideo, //video元素
									duration: mVideo.duration, //视频时长，单位秒
								});
							} else {
								entrySuccesCB.remove(function(remSucCB) {
									console.log("删除文件成功 " + remSucCB);
								}, function(remErrorCB) {
									console.log("删除文件失败" + JSON.stringify(remErrorCB));
								});
								console.log("视频时长不得超出10秒");
								wd.close();
								mui.toast("视频时长不得超出10秒");
								callBack({
									flag: 0, //失败
									message: "视频时长不得超出10秒" //失败信息
								});
							}
						}
						mVideo.onerror = function() {
							console.log("视频加载失败");
							entrySuccesCB.remove(function(remSucCB) {
								console.log("删除文件成功 " + remSucCB);
							}, function(remErrorCB) {
								console.log("删除文件失败" + JSON.stringify(remErrorCB));
							});
							wd.close();
							mui.toast("视频加载失败");
							callBack({
								flag: 0,
								message: "视频加载失败"
							});
						}
						mVideo.src = entrySuccesCB.fullPath;
					}, function(entryErrorCB) {
						console.log("拷贝视频失败 " + JSON.stringify(entryErrorCB));
						wd.close();
						mui.toast("视频处理失败 " + entryErrorCB.message);
						callBack({
							flag: 0,
							message: "视频处理失败 " + entryErrorCB.message
						});
					});
				}, function(parentEntryErrorCB) {
					console.log("获取_documents目录对象失败 " + JSON.stringify(parentEntryErrorCB));
					wd.close();
					mui.toast("视频处理失败 " + entryErrorCB.message);
					callBack({
						flag: 0,
						message: "视频处理失败 " + entryErrorCB.message
					});
				});
			}, function(metadataErrorCB) {
				console.log("获取视频信息失败 " + JSON.stringify(metadataErrorCB));
				wd.close();
				mui.toast("获取视频信息失败 " + metadataErrorCB.message);
				callBack({
					flag: 0,
					message: "获取视频信息失败 " + metadataErrorCB.message
				});
			});
		}, function(fileErrorCB) {
			console.log("获取相册的视频文件对象失败 " + JSON.stringify(fileErrorCB));
			wd.close();
			mui.toast("获取视频失败 " + fileErrorCB.message);
			callBack({
				flag: 0,
				message: "获取视频失败 " + fileErrorCB.message
			});
		});
	}

	/**
	 * 从相册中选取文件失败
	 * @param {Object} error
	 * @param {Object} callBack
	 */
	mod.galleryPickError = function(error, errorCB) {
		if(plus.os.name == 'iOS') { //苹果
			if(error.code != -2) {
				console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				console.log('未选取文件');
			}
		} else if(plus.os.name == 'Android') { //安卓
			if(error.code != 12) {
				console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				console.log('未选取文件');
			}
		} else { //其他
			errorCB({
				code: error.code, // 错误编码
				message: plus.os.name + ' ' + error.message // 错误描述信息
			});
		}
	}
	return mod;
})(window.Gallery || {});