/**
 * 作者：莫尚霖
 * 时间：2016-10-17 12:01:57
 * 描述：修改个人头像，修改群头像，修改资料头像到七牛
 */
var UploadHeadImage = (function($, mod) {
	//文件名
	var fileName = null;
	//头像对应的数据
	var headData = null;
	//头像类型,个人头像0，资料头像1，群头像2
	var imageType = null;
	//获取七牛上传token的url
	var getUploadTokenUrl = window.storageKeyName.QNGETUPTOKENHEADIMGE;
	//存放头像的七牛域名
	var domain = window.storageKeyName.QNHEADIMGEDOMAIN;
	//成功的回调
	var successCallBack;
	//失败的回调
	var errorCallBack;
	/**
	 * 设置监听
	 * @param {Object} element 点击弹出上传选项的元素
	 * @param {Object} type 修改个人头像0，修改资料头像1，群头像2
	 * @param {Object} data 头像对应的数据
	 */
	mod.addListener = function(element, type, data, successCB, errorCB) {
		//配置参数
		headData = data; //头像对应的数据
		imageType = type; //头像类型,个人头像0，资料头像1，群头像2
		var titleStr = '';
		switch(imageType) {
			case 0: //个人头像
				fileName = 'headimge' + headData.id + '.png';
				titleStr = '选择修改个人头像的方式';
				break;
			case 1: //资料头像
				fileName = 'stuheadimge' + headData.id + '.png';
				titleStr = '选择修改学生资料头像的方式';
				break;
			case 2: //群头像
				fileName = 'qunheadimge' + headData.id + '.png';
				titleStr = '选择修改群头像的方式';
				break;
			default:
				console.log('上传头像设置的类型异常');
				break;
		}
		successCallBack = successCB;
		errorCallBack = errorCB;
		//设置监听
		element.addEventListener('tap', function() {
			var btnArray = [{
				title: "拍照"
			}, {
				title: "相册"
			}];
			plus.nativeUI.actionSheet({
				title: titleStr,
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch(index) {
					case 0: //取消
						break;
					case 1: //拍照
						camera();
						break;
					case 2: //相册
						pick();
						break;
				}
			});
		});
	}

	//拍照
	function camera() {

		//获取设备默认的摄像头对象
		var cmr = plus.camera.getCamera();
		//获取摄像头支持的拍照分辨率。“WIDTH*Height”，如“400*800”
		//属性类型为String[]，若不支持此属性则返回空数组对象
		var res = cmr.supportedImageResolutions[0]; //[0]:最高的分辨率模式

		//获取摄像头支持的拍照文件格式。文件格式后缀名，如“jpg”、“png”、“bmp”
		//属性类型为String[]，若不支持此属性则返回空数组对象
		var fmt = cmr.supportedImageFormats[0];

		//				console.log('支持的拍照分辨率:' + JSON.stringify(cmr.supportedImageResolutions));
		//				console.log('支持的拍照文件格式:' + JSON.stringify(cmr.supportedImageFormats));
		//				console.log("选择的拍照分辨率: " + res + ", 选择的文件格式: " + fmt);

		//进行拍照操作cmr.captureImage( successCB, errorCB, option );
		//摄像头资源为独占资源，如果其它程序或页面已经占用摄像头，再次操作则失败
		//successCB: ( CameraSuccessCallback ) 必选 拍照操作成功的回调函数
		//errorCB: ( CameraErrorCallback ) 可选 拍照操作失败的回调函数
		//option: ( CameraOption ) 必选 摄像头拍照参数
		cmr.captureImage(function(capturedFile) {
				//拍照成功的回调
				//capturedFile ：图片的路径
				//显示等待窗口
				plus.nativeUI.showWaiting('正在加载中');
				//console.log('拍照成功,图片的路径为：' + capturedFile);
				//将本地URL路径转换成平台绝对路径
				//capturedFile = 'file://' + plus.io.convertLocalFileSystemURL(capturedFile);
				//console.log('转换成平台绝对路径,图片的路径为：' + capturedFile);
				compressImage(capturedFile) //压缩图片
			},
			function(error) {
				// 拍照失败的回调
				var code = error.code; // error.code（Number类型）获取错误编码
				var message = error.message; // error.message（String类型）获取错误描述信息。
				if(mui.os.ios) {
					if(code !== 2) {
						mui.toast('拍照失败！' + '错误编码：' + code + ' 描述信息：' + message, '拍照失败');
						console.log('拍照失败！' + JSON.stringify(error));
					} else {
						console.log('未拍取图片');
					}
				} else if(mui.os.android) {
					if(code !== 11) {
						mui.toast('拍照失败！' + '错误编码：' + code + ' 描述信息：' + message, '拍照失败');
						console.log('拍照失败！' + JSON.stringify(error));
					} else {
						console.log('未拍取图片:' + JSON.stringify(error));
					}
				}
			}, {
				//						resolution: res,
				format: fmt
			}
		);
	}

	//相册
	function pick() {

		plus.gallery.pick(function(file) {

			//显示等待窗口
			plus.nativeUI.showWaiting('正在加载中');
			console.log('从相册选取图片成功,图片的路径为：' + file);
			//openImage(file); //打开新页面查看图片
			compressImage(file) //压缩图片
		}, function(error) {
			//从相册选取图片失败的回调
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			if(mui.os.ios) {
				if(code != -2) {
					mui.toast('从相册选取图片失败！' + '错误编码：' + code + '描述信息：' + message);
					console.log('从相册选取图片失败！' + JSON.stringify(error));
				} else {
					console.log('未选取图片');
				}
			} else if(mui.os.android) {
				if(code != 12) {
					mui.toast('从相册选取图片失败！' + '错误编码：' + code + '描述信息：' + message);
					console.log('从相册选取图片失败！' + JSON.stringify(error));
				} else {
					console.log('未选取图片:' + JSON.stringify(error));
				}
			}
		});
	}

	//压缩图片并且在新页面显示压缩后的图片
	function compressImage(filepath) {
		//console.log('压缩图片,图片的路径为：' + filepath);
		plus.zip.compressImage({
				src: filepath, //压缩转换原始图片的路径
				dst: '_documents/' + fileName, //压缩转换目标图片的路径
				overwrite: true, //覆盖生成新文件,仅在dst制定的路径文件存在时有效
				format: '.png'
			},
			function(event) {
				//图片压缩成功
				var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
				var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
				var width = event.width; // 压缩转换后图片的实际宽度，单位为px
				var height = event.height; // 压缩转换后图片的实际高度，单位为px
				console.log('压缩图片成功---target:' + target + '|size:' + AndroidFileSystem.readSize(size) + '|width:' + width + '|height:' + height);
				//openImage(target); //打开新页面查看图片
				uploadHeadImge(target);
			},
			function(error) {
				//图片压缩失败
				var code = error.code; // 错误编码
				var message = error.message; // 错误描述信息
				mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
				console.log('图片压缩失败！' + JSON.stringify(error));
				//关闭等待窗口
				plus.nativeUI.closeWaiting();
			}
		);
	}

	/**
	 * 打开新页面查看选择的图片
	 * @param {Object} path 图片路径
	 */
	function openImage(path) {
		events.openNewWindowWithData('studentpersonalimge.html', {
			path: path
		});
	}

	/**
	 * 上传资料头像
	 */
	function uploadHeadImge(fPath) {
		CloudFileUtil.getQNUpToken(getUploadTokenUrl, fileName, function(data) {
			var QNUptoken = data.uptoken;
			console.log('七牛上传token:' + QNUptoken);
			//关闭等待窗口
			//plus.nativeUI.closeWaiting();
			//var size = plus.nativeUI.showWaiting('正在上传');
			CloudFileUtil.upload(fPath, QNUptoken, fileName, function(upload, status) {
				//上传任务完成的监听
				console.log('上传任务完成');
				console.log('上传任务完成:' + status);
				console.log('上传任务完成:' + JSON.stringify(upload));
				//size.close();
				plus.nativeUI.closeWaiting();
				if(status == 200) { //上传任务成功
					//头像类型,个人头像0，资料头像1，群头像2
					switch(imageType) {
						case 0: //个人头像
							changeHeadImge(fileName);
							break;
						case 1: //资料头像
							changeSutHeadImge(fileName);
							break;
						case 2: //群头像
							changeQunHeadImge(fileName);
						default:
							break;
					}
				} else { //上传失败
					errorCallBack(data.responseText);
				}
			}, function(upload, status) {
				//上传任务状态监听
				//上传任务的标识
				var id = upload.__UUID__;
				//已完成上传数据的大小
				var uploadedSize = AndroidFileSystem.readSize(upload.uploadedSize);
				//上传数据的总大小
				var totalSize = AndroidFileSystem.readSize(upload.totalSize);
				//上传任务的状态
				var uploadState = upload.state;
				switch(uploadState) {
					case 0: //上传任务开始调度
						console.log('上传任务开始调度:|id:' + id + '|uploadState:' + uploadState);
						break;
					case 1: //上传任务开始请求
						console.log('上传任务开始请求:|id:' + id + '|uploadState:' + uploadState);
						break;
					case 2: //上传任务请求已经建立
						console.log('上传任务请求已经建立:|id:' + id + '|uploadState:' + uploadState);
						break;
					case 3: //上传任务提交数据
						console.log('上传任务状态监听:|id:' + id + '|uploadedSize:' + uploadedSize + '|totalSize:' + totalSize + '|uploadState:' + uploadState);
						//var num = parseInt(upload.uploadedSize / upload.totalSize * 100) + '%';
						//console.log(num);
						//size.setTitle('正在上传 ' + num);
						break;
					case 4: //上传任务已完成
						//console.log('上传任务已完成:|id:' + id + '|uploadState:' + uploadState);
						break;
					case 5: //上传任务已暂停
						console.log('上传任务已暂停:|id:' + id + '|uploadState:' + uploadState);
						break;
					default:
						console.log('上传任务状态监听:其他状态:' + uploadState);
						break;
				}
			}, function(task) {
				//上传任务创建成功的回调
				task.start();
			});
		}, function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.toast('获取七牛上传token失败：' + type);
			console.log('获取七牛上传token失败：' + type);
		});
	}

	/**
	 * 修改群头像
	 * @param {Object} fileName 头像在七牛上的名称
	 */
	function changeQunHeadImge(fileName) {
		var myDate = new Date();
		var imgeURL = domain + fileName + '?' + myDate.getTime();
		//8.用户修改群各项信息
		//需要参数
		var comData2 = {
			rid: headData.id, //要修改的群id
			vtp: 'gimg', //更改项，指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名),gnote(群说明)
			vvl: imgeURL, //要修改成的值

		};
		//返回值model：model_groupList
		// 等待的对话框
		var wd2 = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostReGinfo(comData2, wd2, function(data) {
			wd2.close();
			console.log('8_PostReGinfo:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(imgeURL);
			} else {
				errorCallBack(data);
			}
			wd2.close();
		});
	}

	/**
	 * 修改个人头像
	 * @param {Object} fileName 头像在七牛上的名称
	 */
	function changeHeadImge(fileName) {
		var myDate = new Date();
		var imgeURL = domain + fileName + '?' + myDate.getTime();
		//6.用户修改各项用户信息
		//调用方法
		var comData = {
			vtp: 'uimg', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件)
			vvl: imgeURL //对应的值
		};
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostReUinf(comData, wd, function(data) {
			console.log('6_PostReUinf:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(imgeURL);
			} else {
				errorCallBack(data);
			}
			wd.close();
		});
	}

	/**
	 * 修改学生资料头像
	 * @param {Object} fileName 头像在七牛上的名称
	 */
	function changeSutHeadImge(fileName) {
		var myDate = new Date();
		var stuImgePath = domain + fileName + '?' + myDate.getTime();
		//23.通过用户资料ID或关联ID更改各类型资料
		//所需参数
		var comData = {
			vtp: 'stu', //更新资料类型,stu:学生,tec:老师,gen:家长关系
			stuid: headData.id, //资料ID,更新学生老师必填,关系留0
			stuname: headData.name, //资料名称
			stuimg: stuImgePath, //资料头像,学生必填,其他留0
			job: '', //职位,老师必填,其他留空
			title: '', //职称,老师必填,其他留空
			expsch: '', //教龄,老师必填,其他留空
			sub: '', //科目,老师必填,其他留空
			ustuid: '', //关联ID,更新与家长关系必填,其他留空
			urel: '' //关系,更新与家长关系必填,其他留空
		};
		//返回值model：model_groupList
		// 等待的对话框
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostReStu(comData, wd, function(data) {
			wd.close();
			console.log('23_PostReStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(stuImgePath);
			} else {
				errorCallBack(data);
			}
		});
	}

	return mod;

})(mui, window.UploadHeadImage || {});
