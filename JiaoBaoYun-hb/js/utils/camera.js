var camera=(function(mod){
	
	mod.getCamera=function(){
		var cmr=plus.camera.getCamera(1);
		return cmr;
	}
	mod.getPic=function(cmr){
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		cmr.captureImage(function(path){
			console.log( "Capture image success: " + path );
			mod.getPicPath(path);
		},
		function(err){
			console.log( "Capture image failed: " + err.message );  
		},
		{format:fmt})
	}
	mod.getPicPath=function(path){
	 var picPath=plus.io.convertLocalFileSystemURL(path);
	 picPath="file://"+picPath;
	 console.log('picture path='+picPath);
	 return picPath;
	}
	return mod;
})(window.camera||{})
