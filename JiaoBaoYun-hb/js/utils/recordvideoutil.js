/**
 * 录制视频
 * @author 莫尚霖
 */
var RecordVideo = (function(mod) {

	/**
	 * 录制视频
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideo = function(data, successCB, errorCB) {
		if(plus.os.name == 'Android') {
			mod.recordVideoAndroid(data, successCB, errorCB);
		} else if(plus.os.name == 'iOS') {
			errorCB({
				code: plus.os.name, // 错误编码
				message: '不支持该系统' // 错误描述信息
			});
			//mod.recordVideoiOS(data, successCB, errorCB);
		} else {
			errorCB({
				code: plus.os.name, // 错误编码
				message: '不支持该系统' // 错误描述信息
			});
		}
	}

	/**
	 * 录制视频H5
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideoHtml = function(data, successCB, errorCB) {
		var cmr = plus.camera.getCamera();
		if(cmr) {
			try {
				cmr.startVideoCapture(function(capturedFile) {
					console.log('录制成功 ' + fpath);
					successCB(capturedFile);
				}, function(error) {
					if(error != 'null') {
						console.log('录制失败 ' + JSON.stringify(error));
						errorCB({
							code: error.code, // 错误编码
							message: error.message // 错误描述信息
						});
					} else {
						console.log('未录制视频 ' + JSON.stringify(error));
					}
				}, {});
			} catch(e) {
				alert('### ERROR ### 录制视频异常 name:' + e.name + " message:" + e.message);
				errorCB({
					code: 'ERROR', // 错误编码
					message: '录制视频异常' // 错误描述信息
				});
			}

		} else {
			errorCB({
				code: 'NULL', // 错误编码
				message: '获取摄像头失败' // 错误描述信息
			});
		}
	}

	/**
	 * 录制视频Android
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideoAndroid = function(data, successCB, errorCB) {
		//设置录像文件的路径
		var myDate = new Date();
		var outPutPath = plus.io.convertLocalFileSystemURL('_documents/' + myDate.getTime() + '.mp4');
		var time = 10; //默认10s
		if(data) {
			if(data.outPutPath) { //路径
				outPutPath = data.outPutPath;
			}
			if(data.time) { //时间
				time = data.time;
			}
		}

		var File = plus.android.importClass("java.io.File");
		var Uri = plus.android.importClass("android.net.Uri");
		var MediaStore = plus.android.importClass("android.provider.MediaStore");
		var Intent = plus.android.importClass("android.content.Intent");
		var intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
		var file = new File(outPutPath);
		var outPutUri = Uri.fromFile(file);
		intent.putExtra(MediaStore.EXTRA_OUTPUT, outPutUri); //录像输出位置
		//intent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 1); //0 最低质量, 1高质量(不设置,10M;0,几百KB;1,50M)
		intent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, time); //控制录制时间单位秒

		try {
			var main = plus.android.runtimeMainActivity();
			main.startActivityForResult(intent, 0);
			//第一个参数：一个Intent对象，用于携带将跳转至下一个界面中使用的数据，使用putExtra(A,B)方法，此处存储的数据类型特别多，基本类型全部支持。
			//第二个参数：如果> = 0,当Activity结束时requestCode将归还在onActivityResult()中。以便确定返回的数据是从哪个Activity中返回，用来标识目标activity。
			//与下面的resultCode功能一致，感觉Android就是为了保证数据的严格一致性特地设置了两把锁，来保证数据的发送，目的地的严格一致性。
		} catch(e) {
			alert('### ERROR ### 调用录像异常 name:' + e.name + " message:" + e.message);
			errorCB({
				code: 'ERROR', // 错误编码
				message: '调用录像异常' // 错误描述信息
			});
		}

		try {
			main.onActivityResult = function(requestCode, resultCode, data) {
				//第一个参数： 这个整数requestCode用于与startActivityForResult中的requestCode中值进行比较判断， 是以便确认返回的数据是从哪个Activity返回的。
				//第二个参数： 这整数resultCode是由子Activity通过其setResult() 方法返回。 适用于多个activity都返回数据时， 来标识到底是哪一个activity返回的值。
				//第三个参数： 一个Intent对象， 带有返回的数据。 可以通过data.getXxxExtra()方法来获取指定数据类型的数据，
				//停止录像
				if(requestCode == 0) { //拍照的Activity的code
					if(resultCode == -1) { //成功
						console.log('录像成功 ' + outPutPath);
						successCB(outPutPath); //返回录像文件的位置
					} else if(resultCode == 0) { //未拍照
						console.log('未录像');
					} else {
						console.log('录像失败 requestCode ' + requestCode + ' resultCode' + resultCode);
						errorCB({
							code: resultCode, // 错误编码
							message: '录像失败' // 错误描述信息
						});
					}
				}
			}
		} catch(e) {
			alert('### ERROR ### 录像回调异常 name:' + e.name + " message:" + e.message);
			errorCB({
				code: 'ERROR', // 错误编码
				message: '录像回调异常' // 错误描述信息
			});
		}
	}

	/**
	 * 录制视频iOS
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideoiOS = function(data, successCB, errorCB) {

	}

	return mod;

})(window.RecordVideo || {});