/**
 * 相机模块
 */
var camera=(function(mod){
//	mod.filePaths=[];
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
//			mod.filePaths.push(mod.getAbsolutePath(path));
			//处理图片
//			managePic(mod.getAbsolutePath(path));
			managePic(path)
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
//	 console.log('file path='+abPath);
	 return abPath;
	}
	return mod;
})(window.camera||{});
/**
 * 相册模块
 */
var gallery=(function(mod){
	/**
	 * 获取单张图片的方法
	 * @param {Object} callback 为获取图片的回调函数
	 */
	mod.getSinglePic=function(callback){
	 plus.gallery.pick( function(path){
    	console.log('图片路径为：'+path);
    	callback(path);
	    }, function ( e ) {
	    	console.log( "取消选择图片" );
	    }, {filter:"image"} );
	}
	return mod;
})(window.gallery||{})
