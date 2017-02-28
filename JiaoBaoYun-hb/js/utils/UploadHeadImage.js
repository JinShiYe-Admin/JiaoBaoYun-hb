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
	//私有空间或公有空间
	var mainSpace = window.storageKeyName.QNPUBSPACE;
	//头像上传的空间
	var uploadSpace = window.storageKeyName.HEADIMAGE;
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
				fileName = 'headimage' + headData.id + '.png';
				titleStr = '选择修改个人头像的方式';
				break;
			case 1: //资料头像
				fileName = 'stuheadimage' + headData.id + '.png';
				titleStr = '选择修改学生资料头像的方式';
				break;
			case 2: //群头像
				fileName = 'qunheadimage' + headData.id + '.png';
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
				var wd = events.showWaiting();
				//console.log('拍照成功,图片的路径为：' + capturedFile);
				//将本地URL路径转换成平台绝对路径
				//capturedFile = 'file://' + plus.io.convertLocalFileSystemURL(capturedFile);
				//console.log('转换成平台绝对路径,图片的路径为：' + capturedFile);
				compressImage(wd, capturedFile) //压缩图片
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
			var wd = events.showWaiting();
			console.log('从相册选取图片成功,图片的路径为：' + file);
			//openImage(file); //打开新页面查看图片
			compressImage(wd, file) //压缩图片
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
	function compressImage(wd, filepath) {
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
				uploadHeadImge(wd, target);
			},
			function(error) {
				//图片压缩失败
				var code = error.code; // 错误编码
				var message = error.message; // 错误描述信息
				mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
				console.log('图片压缩失败！' + JSON.stringify(error));
				//关闭等待窗口
				wd.close();
			}
		);
	}

	/**
	 * 打开新页面查看选择的图片
	 * @param {Object} path 图片路径
	 */
	//	function openImage(path) {
	//		events.openNewWindowWithData('studentpersonalimge.html', {
	//			path: path
	//		});
	//	}

	/**
	 * 上传资料头像
	 */
	function uploadHeadImge(wd, fPath) {
		var getToken = {
			type: '0', //str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
			QNFileName: fileName, //str 必填 存放到七牛的文件名
			appId: 5, //int 必填 项目id
			mainSpace: mainSpace, //str 必填 私有空间或公有空间
			uploadSpace: uploadSpace, //str 必填  上传的空间
		}
		CloudFileUtil.getQNUpToken(getUploadTokenUrl, getToken, function(data) {
			var QNUptoken = data.data; //token数据
			var configure = data.configure; //获取token的配置信息
			console.log('七牛上传token:' + JSON.stringify(QNUptoken));
			if(QNUptoken.Status == 0) { //失败
				mui.toast('获取上传凭证失败 ' + QNUptoken.Message);
				console.log('### ERROR ### 请求上传凭证失败' + QNUptoken.Message);
				wd.close();
			} else {
				CloudFileUtil.upload(fPath, QNUptoken.Data.Token, QNUptoken.Data.Key, function(upload, status) {
					//上传任务完成的监听
					console.log('上传任务完成:' + status);
					console.log('上传任务完成:' + JSON.stringify(upload));
					if(status == 200) { //上传任务成功
						//头像类型,个人头像0，资料头像1，群头像2
						var thumb = QNUptoken.Data.OtherKey[configure.thumbKey]; //缩略图地址
						var domain = QNUptoken.Data.Domain + QNUptoken.Data.Key; //文件地址
						console.log(thumb);
						console.log(domain);
						switch(imageType) {
							case 0: //个人头像
								changeHeadImge(wd, domain, thumb);
								break;
							case 1: //资料头像
								changeSutHeadImge(wd, domain, thumb);
								break;
							case 2: //群头像
								changeQunHeadImge(wd, domain, thumb);
							default:
								break;
						}
					} else { //上传失败
						errorCallBack(upload.responseText);
						wd.close();
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
							//console.log('上传任务状态监听:|id:' + id + '|uploadedSize:' + uploadedSize + '|totalSize:' + totalSize + '|uploadState:' + uploadState);
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
			}
		}, function(xhr, type, errorThrown) {
			wd.close();
			mui.toast('请求上传凭证失败 ' + type);
			console.log('### ERROR ### 请求上传凭证失败' + type);
		});
	}

	/**
	 * 修改群头像
	 * @param { Object } domain 头像在七牛上的文件地址
	 * @param { Object } thumb 头像在七牛上的文件缩略图地址
	 */
	function changeQunHeadImge(wd, domain, thumb) {
		var myDate = new Date();
		var imgeURL = thumb + '?' + myDate.getTime();
		//8.用户修改群各项信息
		//需要参数
		var comData2 = {
			rid: headData.id, //要修改的群id
			vtp: 'gimg', //更改项，指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名),gnote(群说明)
			vvl: imgeURL, //要修改成的值

		};
		//返回值model：model_groupList
		// 等待的对话框
		//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING, {
		//			back: 'none'
		//		});
		postDataPro_PostReGinfo(comData2, wd, function(data) {
			console.log('8_PostReGinfo:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(domain + '?' + myDate.getTime());
			} else {
				errorCallBack(data);
			}
			wd.close();
		});
	}

	/**
	 * 修改个人头像
	 * @param { Object } domain 头像在七牛上的文件地址
	 * @param { Object } thumb 头像在七牛上的文件缩略图地址
	 */
	function changeHeadImge(wd, domain, thumb) {
		var myDate = new Date();
		var imgeURL = thumb + '?' + myDate.getTime();
		//6.用户修改各项用户信息
		//调用方法
		var comData = {
			vtp: 'uimg', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件)
			vvl: imgeURL //对应的值
		};
		postDataPro_PostReUinf(comData, wd, function(data) {
			console.log('6_PostReUinf:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(domain + '?' + myDate.getTime());
			} else {
				errorCallBack(data);
			}
			wd.close();
		});
	}

	/**
	 * 修改学生资料头像
	 * @param {Object} domain 头像在七牛上的文件地址
	 * @param {Object} thumb 头像在七牛上的文件缩略图地址
	 */
	function changeSutHeadImge(wd, domain, thumb) {
		var myDate = new Date();
		var stuImgePath = thumb + '?' + myDate.getTime();
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
		postDataPro_PostReStu(comData, wd, function(data) {
			console.log('23_PostReStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//成功的回调
				successCallBack(domain + '?' + myDate.getTime());
			} else {
				errorCallBack(data);
			}
			wd.close();
		});
	}

	return mod;

})(mui, window.UploadHeadImage || {});