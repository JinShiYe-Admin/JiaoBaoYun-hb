/**
 * 相机模块
 */
var camera=(function(mod){
	mod.imgPaths=[];
	//获取相机
	mod.getCamera=function(){
		var cmr=plus.camera.getCamera(1);
		return cmr;
	}
	//获取图片
	mod.getPic=function(cmr,managePic){
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		cmr.captureImage(function(path){
			console.log( "Capture image success: " + path );
			//数组添加path
			mod.imgPaths.push(path);
			//处理图片
			managePic(mod.getPicPath(path));
		},
		function(err){
			console.log( "Capture image failed: " + err.message );  
		},
		{format:fmt})
	}
	//获取图片路径
	mod.getPicPath=function(path){
	 var picPath=plus.io.convertLocalFileSystemURL(path);
	 picPath="file://"+picPath;
	 console.log('picture path='+picPath);
	 return picPath;
	}
	return mod;
})(window.camera||{})
