var MultiMedia = (function($, mod) {

	var html_picture_header = '<span id="MultiMedia_Picture_Header" class="mui-icon iconfont icon-xiangji"></span>'; //相机图标
	var html_audio_header = '<span id="MultiMedia_Audio_Header" class="mui-icon iconfont icon-yuyin"></span>'; //语音图标
	var html_video_header = '<span id="MultiMedia_Video_Header" class="mui-icon iconfont icon-shipin"></span>'; //相机图标
	var html_picture_footer = '<div id="MultiMedia_Picture_Footer"></div>'; //放置图片
	var html_audio_footer = '<div id="MultiMedia_Audio_Footer"></div>'; //放置音频
	var html_video_footer = '<div id="MultiMedia_Video_Footer"></div>'; //放置视频

	var div = document.createElement('div');

	/**
	 * 多媒体对象
	 * @param {Object} options 配置参数
	 */
	var MultiMedia = function(options) {
		//配置参数
		this.options = $.extend(true, {
			Id: '_MSL_MultiMedia', //整个控件的ID
			MultiMediaId: '', //存放多媒体对象控件的ID
			Picture: true, //是否显示图片图标
			Audio: true, //是否显示音频图标
			Video: true, //是否显示视频图标
			TotalPicture: 9, //图片的个数
			TotalAudio: 9, //音频的个数
			TotalVideo: 9, //视频的个数
		}, options || {});

		//初始化
		this.init();
		this.initData();
		this.initEvent();
	}

	var proto = MultiMedia.prototype; //属性使您有能力向对象添加属性和方法。

	//初始化界面
	proto.init = function() {
		console.log('MultiMedia-init');
		var options = this.options;
		var str_div_0 = '<div id="MultiMedia_Body" class="multimedia-body"><div id="MultiMedia_Header" class="multimedia-header">'
		var str_pic_0 = ''; //图片按钮
		var str_aud_0 = ''; //音频按钮
		var str_vid_0 = ''; //视频按钮
		var srt_div_1 = '</div><div id="MultiMedia_Footer" class="multimedia-footer">';
		var str_pic_1 = ''; //放置选择的图片
		var str_aud_1 = ''; //放置录制的音频
		var str_vid_1 = ''; //放置录制的视频
		var srt_div_2 = '</div></div>'
		if(this.options.Picture) {
			str_pic_0 = html_picture_header;
		}
		if(this.options.Audio) {
			str_aud_0 = html_audio_header;
		}
		if(this.options.Video) {
			str_vid_0 = html_video_header;
		}
		div.id = this.options.Id;
		div.innerHTML = str_div_0 + str_aud_0 + str_pic_0 + str_vid_0 + srt_div_1 + str_pic_1 + str_aud_1 + str_vid_1 + srt_div_2;

		if(this.options.MultiMediaId != '') {
			var el = document.getElementById(this.options.MultiMediaId);
			el.appendChild(div);
		} else {
			//页面最下面
			document.body.appendChild(div);
		}
		this.element = div; //控件元素
	}

	//初始化数据
	proto.initData = function() {
		console.log('MultiMedia-initData');
		this.data = {};
		var options = this.options;
		if(this.options.Picture) {
			this.data.Pictures = options.TotalPicture;
			this.data.PictureArray = [];
		}
		if(this.options.Audio) {
			this.data.Audios = options.TotalAudio;
			this.data.AudioArray = [];
		}
		if(this.options.Video) {
			this.data.Videos = options.TotalVideo;
			this.data.VideoArray = [];
		}
	}

	//初始化监听
	proto.initEvent = function() {
		console.log('MultiMedia-initEvent');
		var self = this;
		var options = this.options;

		if(this.options.Picture) {
			document.getElementById('MultiMedia_Picture_Header').addEventListener('tap', function() {
				//				if(self.data.Pictures > 0) {
				//					self.pictureActionSheet();
				//				} else {
				//					mui.alert('图片超出' + self.options.TotalPicture + ' 张限制');
				//				}
				mui.toast('图片功能暂未开放');
			});
		}
		if(this.options.Audio) {
			document.getElementById('MultiMedia_Audio_Header').addEventListener('tap', function() {
				mui.toast('语音功能暂未开放');
			});
		}
		if(this.options.Video) {
			document.getElementById('MultiMedia_Video_Header').addEventListener('tap', function() {
				mui.toast('视频功能暂未开放');
			});
		}
	}

	/**
	 * 显示图片的选择方式
	 */
	proto.pictureActionSheet = function() {
		console.log('pictureActionSheet');
		var self = this;
		var NumPick = self.data.Pictures;
		console.log('NumPick ' + NumPick);
		var btnArray = btnArray = [{
			title: "拍取照片"
		}, {
			title: "从相册选取照片"
		}];
		plus.nativeUI.actionSheet({
			title: '选择文件的方式',
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			console.log('选择文件的方式:' + index);
			switch(index) {
				case 1: //拍取照片
					self.pictureTake();
					break;
				case 2: //从相册选取照片
					self.picturesPick(NumPick);
					break;
				default:
					break;
			}
		});
	}

	/**
	 * 相机拍取照片
	 */
	proto.pictureTake = function() {
		var self = this;
		console.log('pictureTake');
		var self = this;
		self.cameraTake(function(path) {
			console.log('pictureTake :' + path);
			self.data.Pictures--;
			self.data.PictureArray.push(path);
		}, function() {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			mui.toast('从相册选取图片失败 ' + '错误编码 ' + code + '描述信息 ' + message);
		});
	}

	/**
	 * 相册选择图片
	 * @param {Object} multiple
	 * @param {Object} num
	 */
	proto.picturesPick = function(NumPick) {
		console.log('picturesPick');
		var self = this;
		self.galleryPick('image', true, NumPick, function(event) {
			var files = event.files; // 保存多选的图片或视频文件路径
			mui.each(files, function(index, element) {
				console.log(index + '|' + element);
				self.data.Pictures--;
				self.data.PictureArray.push(element);
			});
			console.log('picturesPick :' + self.data.Pictures);
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			mui.toast('从相册选取图片失败 ' + '错误编码 ' + code + '描述信息 ' + message);
		});

	}

	/**
	 * 调用系统方法相册选择照片或视频
	 * @param {Object} filter 相册选择文件过滤类型,图片文件（“image”）,视频文件（“video”）,所有文件（“none”）
	 * @param {Object} multiple 是否是多选，多选true
	 * @param {Object} maximum 最多选择的图片数量，单选设置1
	 * @param {Object} successCB 选择照片成功的回调
	 * @param {Object} errorCB 选择照片失败的回调
	 */
	proto.galleryPick = function(filter, multiple, maximum, successCB, errorCB) {
		console.log('galleryPick | filter ' + filter + ' | multiple ' + multiple + ' | maximum ' + maximum);
		plus.gallery.pick(function(event) {
			successCB(event);
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			if(mui.os.ios) { //苹果
				if(code != -2) {
					console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
					errorCB({
						code: code, // 错误编码
						message: 'ios ' + message // 错误描述信息
					});
				} else {
					console.log('未选取图片 ' + JSON.stringify(error));
				}
			} else if(mui.os.android) { //安卓
				if(code != 12) {
					console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
					errorCB({
						code: code, // 错误编码
						message: 'android ' + message // 错误描述信息
					});
				} else {
					console.log('未选取图片 ' + JSON.stringify(error));
				}
			} else { //其他
				errorCB({
					code: code, // 错误编码
					message: 'os ' + message // 错误描述信息
				});
			}
		}, {
			filter: filter,
			maximum: maximum,
			multiple: multiple,
			onmaxed: function() {
				mui.alert('图片数量超出限制');
			},
			system: false //多选必须设置的参数
		});
	}

	/**
	 * 拍照
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	proto.cameraTake = function(successCB, errorCB) {

		//获取设备默认的摄像头对象
		var cmr = plus.camera.getCamera();
		//获取摄像头支持的拍照分辨率。“WIDTH*Height”，如“400*800”
		//属性类型为String[]，若不支持此属性则返回空数组对象
		var res = cmr.supportedImageResolutions[0]; //[0]:最高的分辨率模式

		//获取摄像头支持的拍照文件格式。文件格式后缀名，如“jpg”、“png”、“bmp”
		//属性类型为String[]，若不支持此属性则返回空数组对象
		var fmt = cmr.supportedImageFormats[0];

		//console.log('支持的拍照分辨率:' + JSON.stringify(cmr.supportedImageResolutions));
		//console.log('支持的拍照文件格式:' + JSON.stringify(cmr.supportedImageFormats));
		//console.log("选择的拍照分辨率: " + res + ", 选择的文件格式: " + fmt);

		//进行拍照操作cmr.captureImage( successCB, errorCB, option );
		//摄像头资源为独占资源，如果其它程序或页面已经占用摄像头，再次操作则失败
		//successCB: ( CameraSuccessCallback ) 必选 拍照操作成功的回调函数
		//errorCB: ( CameraErrorCallback ) 可选 拍照操作失败的回调函数
		//option: ( CameraOption ) 必选 摄像头拍照参数
		cmr.captureImage(function(capturedFile) {
				//拍照成功的回调
				console.log('拍照成功,图片的路径为 ' + capturedFile);
				//capturedFile ：图片的路径
				//将本地URL路径转换成平台绝对路径
				var path = 'file://' + plus.io.convertLocalFileSystemURL(capturedFile);
				console.log('转换成平台绝对路径,图片的路径为 ' + path);
				successCB(path);
			},
			function(error) {
				// 拍照失败的回调
				var code = error.code; // error.code（Number类型）获取错误编码
				var message = error.message; // error.message（String类型）获取错误描述信息。
				if(mui.os.ios) {
					if(code !== 2) {
						errorCB({
							code: code, // 错误编码
							message: 'ios ' + message // 错误描述信息
						});

						mui.toast('拍照失败！' + '错误编码：' + code + ' 描述信息：' + message, '拍照失败');
						console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else if(mui.os.android) {
					if(code !== 11) {
						errorCB({
							code: code, // 错误编码
							message: 'android ' + message // 错误描述信息
						});
						console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else {
					errorCB({
						code: code, // 错误编码
						message: 'os ' + message // 错误描述信息
					});
				}
			}, {
				format: fmt
			}
		);
	}

	var MultiMediaApi = null; //声明一个null的变量，用来存储多媒体对象

	//创建并返回一个多媒体对象
	mod.multiMedia = function(options) {
		console.log('multiMedia ' + JSON.stringify(options));
		if(!MultiMediaApi) {
			MultiMediaApi = new MultiMedia(options); //new一个多媒体对象
		}
		return MultiMediaApi;
	};

	//返回一个多媒体对象
	mod.getMultiMedia = function() {
		return MultiMediaApi;
	}

	return mod;
})(mui, window.MultiMedia || {});