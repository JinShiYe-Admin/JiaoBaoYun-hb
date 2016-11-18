/**
 * 上传、下载组件
 */
var load=(function(mod){
	/**
	 * 上传文件
	 * @param {Object} url 上传接口
	 * @param {Object} paths 需上传文件的路径
	 */
	mod.createUpload=function(url,paths,savePath,getToken){
		//等待框
		var wt=plus.nativeUI.showWaiting();
		//创建上传方法
		var task=plus.uploader.createUpload(url,
			{method:"POST"},
			function(t,status){
				//关闭对话框
				wt.close();
				//上传完成
				//上传成功
				if(status==200){
					console.log("Upload success"+t.responseText);
				//上传失败
				}else{
					mui.toast('上传失败,请重新上传');
				}
			});
			task.addData('key',savePath);
			task.addData('token',getToken)
		//加载所有文件
		paths.forEach(function(path,i){
			task.addFile(path,{key:new Date().getTime()+i});
		})
		//开始上传
		task.start();
		console.log('start')
	}
	return mod
})(load||{})
