/**
 * 压缩模块
 */
var compress = (function(mod) {
	mod.compressPIC = function(picPath, callback) {
		var options = {
			src: picPath, //压缩转换原始图片的路径
			dst: getSavePath(picPath) //压缩转换目标图片的路径
		}
		var picType=getPicType(picPath);
		if(picType) { //宽>=长
			options.width = "1024px";
			options.height = "auto";
		} else { //宽<长
			options.width = "auto";
			options.height = "1024px";
		}
		plus.zip.compressImage(options,
			function(event) {
				//图片压缩成功
				//				var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
				//				var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
				//				var width = event.width; // 压缩转换后图片的实际宽度，单位为px
				//				var height = event.height; // 压缩转换后图片的实际高度，单位为px
				console.log('压缩图片成功:' + JSON.stringify(event));
				callback(event);
			},
			function(error) {
				//图片压缩失败
				var code = error.code; // 错误编码
				var message = error.message; // 错误描述信息
				mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
				console.log('图片压缩失败！' + JSON.stringify(error));

			})
	}
	var getPicType = function(picPath) {
		var picType;
		var img = new Image();
		img.src = picPath;
		if(img.width >= img.height) {
			picType = true;
		} else {
			picType = false;
		}
		return picType;
	}
	var getSavePath = function(picPath) {
		var picPaths = picPath.split('/');
		picPaths.splice(picPaths.length - 2, 0, "savePath");
		return picPaths.join('/');
	}
	return mod;
})(compress || {})