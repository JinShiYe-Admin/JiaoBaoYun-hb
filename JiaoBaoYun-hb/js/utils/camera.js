/**
 * 相机模块
 */
var camera=(function(mod){
	mod.filePaths=[];
	//获取相机
	mod.getCamera=function(){
		var cmr=plus.camera.getCamera(1);
		return cmr;
	}
	//拍照
	mod.getPic=function(cmr,managePic){
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		cmr.captureImage(function(path){
			console.log( "Capture image success: " + path );
			//数组添加path
			mod.filePaths.push(path);
			//处理图片
			managePic(mod.getAbsolutePath(path));
		},
		function(err){
			console.log( "Capture image failed: " + err.message );  
		},
		{format:fmt})
	}
	//录像
	mod.getVideo=function(cmr,manageVideo){
		var res=cmr.supportedVideoResolutions[0];
		var fmt=cmr.supportedVideoFormats[0];
		cmr.startVideoCapture(function(path){
			mod.filePaths.push(path);
			manageVideo(mod.getAbsolutePath(path));
		},
		function(error){
			mui.toast('发生错误，请重试')
		},
		{format:fmt})
	}
	//获取局对路径
	mod.getAbsolutePath=function(path){
	 var abPath=plus.io.convertLocalFileSystemURL(path);
	 abPath="file://"+abPath;
	 console.log('file path='+abPath);
	 return abPath;
	}
	return mod;
})(window.camera||{});
