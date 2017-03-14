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
		var widths=[];
		for(var i in picPaths) {
			mod.compressPIC(picPaths[i], function(event) {
				compressCount++;
				compressedPaths.push(event.target);
				widths.push(event.width);
				if(compressCount == picPaths.length) {
					console.log('压缩后的图片：' + JSON.stringify(compressedPaths));
					console.log('压缩前的图片：' + JSON.stringify(picPaths))
					console.log('全部压缩成功');
					callback(compressedPaths,widths);
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
	return mod;
})(compress || {})