/**
 * 压缩模块
 */
var compress = (function(mod) {
	mod.compressPIC = function(picPath, callback) {
		var options = {
			src: picPath, //压缩转换原始图片的路径
			dst: getSavePath(picPath), //压缩转换目标图片的路径
			overwrite: true
		}
		//获取图片类型
		getPicType(picPath, function(picType) {
			if(picType) { //宽>=长
				options.width = "1024px";
				options.height = "auto";
			} else { //宽<长
				options.width = "auto";
				options.height = "1024px";
			}
			//压缩图片
			plus.zip.compressImage(options,
				function(event) {
					console.log('压缩图片成功:' + JSON.stringify(event));
					callback(event);
				},
				function(error) {
					//图片压缩失败
					var code = error.code; // 错误编码
					var message = error.message; // 错误描述信息
					mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
					console.log('图片压缩失败！' + JSON.stringify(error));
					plus.nativeUI.closeWaiting();
				})
		});

	}
	mod.compressPics = function(picPaths, callback) {
		var compressedPaths = [];
		//		var trueComPaths=[];
		var compressCount = 0;
		var widths = [];
		for(var i in picPaths) {
			mod.compressPIC(picPaths[i], function(event) {
				compressCount++;
				compressedPaths.push(event.target);
				widths.push(event.width);
				if(compressCount == picPaths.length) {
					console.log('压缩后的图片：' + JSON.stringify(compressedPaths));
					console.log('压缩前的图片：' + JSON.stringify(picPaths))
					console.log('全部压缩成功');
					callback(compressedPaths, widths);
				}
			})
		}

	}
	var getPicType = function(picPath, callback) {
		var picType;
		var img = new Image();
		img.src = picPath;
		img.onload = function() {
			if(img.width >= img.height) {
				picType = true;
			} else {
				picType = false;
			}
			callback(picType);
		}
	}
	var getSavePath = function(picPath) {
		var picPaths = picPath.split('/');
		picPaths.splice(picPaths.length - 1, 0, "savePath");
		return picPaths.join('/');
	}

	/**
	 * 将图片压缩至1M以下
	 * @author莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_1MB = function(data, successCallBack, errorCallBack) {
		var options = {
			path: data.path, //压缩转换原始图片的路径
			dst: data.dst, //压缩转换目标图片的路径
		}
		console.log('compressImageTo_1MB options ' + JSON.stringify(options));
		mod.compressImageTo_xx(options, function(event) {
			console.log('compressImageTo_1MB 成功');
			successCallBack(event);
		}, function(error) {
			console.log('### ERROR ### compressImageTo_1MB 失败 ' + JSON.stringify(error));
			errorCallBack(error);
		});
	}

	/**
	 * 将图片压缩至512KB以下
	 * @author 莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_512KB = function(data, successCallBack, errorCallBack) {
		var options = {
			path: data.path, //压缩转换原始图片的路径
			dst: data.dst, //压缩转换目标图片的路径
			sizemax: 524288, //最大文件大小
		}
		console.log('compressImageTo_512KB options ' + JSON.stringify(options));
		mod.compressImageTo_xx(options, function(event) {
			console.log('compressImageTo_512KB 成功');
			successCallBack(event);
		}, function(error) {
			console.log('### ERROR ### compressImageTo_1MB 失败 ' + JSON.stringify(error));
			errorCallBack(error);
		});
	}

	/**
	 * 将图片压缩至XX大小以下(默认1MB)
	 * @author 莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_xx = function(data, successCallBack, errorCallBack) {
		var optionWith = 'auto';
		var optionHeight = 'auto';
		var sizeMax = 1048576; //1MB
		if(data.width) {
			optionWith = data.width;
		}
		if(data.height) {
			optionHeight = data.height;
		}
		if(data.sizemax) {
			sizeMax = data.sizemax;
		}
		var options = {
			src: data.path, //压缩转换原始图片的路径
			dst: data.dst, //压缩转换目标图片的路径
			overwrite: true, //覆盖生成新文件,仅在dst制定的路径文件存在时有效
			format: '.png', //压缩转换后的图片格式
			width: optionWith, //缩放图片的宽度
			height: optionHeight //(String 类型 )缩放图片的高度
		}
		console.log('compressImageTo_xx options ' + JSON.stringify(options));
		try {
			plus.zip.compressImage(options,
				function(event) {
					//图片压缩成功
					//var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
					//var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
					//var width = event.width; // 压缩转换后图片的实际宽度，单位为px
					//var height = event.height; // 压缩转换后图片的实际高度，单位为px
					console.log('compressImageTo_xx 成功 target:' + event.target + ' size:' + event.size + ' width:' + event.width + ' height:' + event.height);
					if(event.size <= sizeMax) {
						successCallBack(event);
					} else {
						var data = {
							path: event.target,
							dst: event.target,
							sizemax: sizeMax,
						}

						if(event.width > event.height) { //宽>=长
							data.width = parseInt(event.width / 2) + "px";
						} else { //宽<长
							data.height = parseInt(event.height / 2) + "px";
						}
						mod.compressImageTo_xx(data, successCallBack, errorCallBack);
					}
				},
				function(error) {
					//图片压缩失败
					//var code = error.code; // 错误编码
					//var message = error.message; // 错误描述信息
					console.log('### ERROR ### compressImageTo_xx 失败 ' + JSON.stringify(error));
					errorCallBack(error);
				}
			);
		} catch(e) {
			alert('### ERROR ### 压缩至XX异常 name:' + e.name + " message:" + e.message);
			errorCallBack({
				code: 'ERROR', // 错误编码
				message: '压缩至XX异常' + ' name:' + e.name + " message:" + e.message // 错误描述信息
			});
		}
	}

	return mod;
})(compress || {})