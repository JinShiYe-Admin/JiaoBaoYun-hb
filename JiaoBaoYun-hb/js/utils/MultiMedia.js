/**
 * 录音，拍照，录像控件
 * @author 莫尚霖
 */
var MultiMedia = (function($, mod) {

	var html_picture_header = '<span id="MultiMedia_Picture_Header" class="mui-icon iconfont icon-xiangji2"></span>'; //相机图标
	var html_tuku_header = '<span id="MultiMedia_Tuku_Header" class="mui-icon iconfont icon-tuku"></span>'; //图库图标
	var html_audio_header = '<span id="MultiMedia_Audio_Header" class="mui-icon iconfont icon-yuyin3"></span>'; //语音图标
	var html_video_header = '<span id="MultiMedia_Video_Header" class="mui-icon iconfont icon-shipin2"></span>'; //视频图标
	var html_picture_footer = '<div id="MultiMedia_Picture_Footer"></div>'; //放置图片
	var html_audio_footer = '<div id="MultiMedia_Audio_Footer"></div>'; //放置音频
	var html_video_footer = '<div id="MultiMedia_Video_Footer"></div>'; //放置视频

	var div = document.createElement('div');

	/**
	 * 图片Id
	 */
	var imageId = 0;

	/**
	 * 多媒体对象
	 * @param {Object} options 配置参数
	 */
	var MultiMedia = function(options) {
		//配置参数
		this.options = $.extend(true, {
			Id: '_MSL_MultiMedia', //整个控件的ID
			Key: 'key', //用户的utid
			MultiMediaId: '', //存放多媒体对象控件的ID
			Picture: false, //是否显示图片图标
			Audio: false, //是否显示音频图标
			Video: false, //是否显示视频图标
			TotalPicture: 0, //图片的个数
			TotalAudio: 0, //音频的个数
			TotalVideo: 0, //视频的个数
		}, options || {});

		//初始化
		this.init();
		this.initData();
		this.initEvent();
	}

	var proto = MultiMedia.prototype; //属性使您有能力向对象添加属性和方法。

	//初始化界面
	proto.init = function() {
		//console.log('MultiMedia-init');
		var options = this.options;
		var str_div_0 = '<div id="MultiMedia_Body" class="multimedia-body"><div id="MultiMedia_Header" class="multimedia-header">'
		var str_pic_0 = ''; //相机按钮
		var str_tuku_0 = ''; //图库按钮
		var str_aud_0 = ''; //音频按钮
		var str_vid_0 = ''; //视频按钮
		var srt_div_1 = '</div><div id="MultiMedia_Footer" class="multimedia-footer">';
		var str_pic_1 = ''; //放置选择的图片
		var str_aud_1 = ''; //放置录制的音频
		var str_vid_1 = ''; //放置录制的视频
		var srt_div_2 = '</div></div>'

		if(this.options.Picture) {
			str_pic_0 = html_picture_header;
			str_pic_1 = html_picture_footer;
			str_tuku_0 = html_tuku_header;
		}
		if(this.options.Audio) {
			str_aud_0 = html_audio_header;
			str_aud_1 = html_audio_footer;
		}
		if(this.options.Video) {
			str_vid_0 = html_video_header;
			str_vid_1 = html_video_footer;
		}
		div.id = this.options.Id;
		div.style.width = '100%';
		div.innerHTML = str_div_0 + str_pic_0 + str_tuku_0 + str_aud_0 + str_vid_0 + srt_div_1 + str_pic_1 + str_aud_1 + str_vid_1 + srt_div_2;

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
		//console.log('MultiMedia-initData');
		this.data = {};
		var options = this.options;
		if(this.options.Picture) {
			this.data.PictureNum = options.TotalPicture; //可以选取图片的剩余数量
			this.data.PictureArray = []; //已选取的图片路径
			this.data.PictureWith = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.2);
			this.data.PictureMarginLeft = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.04);
		}
		if(this.options.Audio) {
			this.data.Audios = options.TotalAudio;
			this.data.AudioArray = [];
		}
		if(this.options.Video) {
			this.data.VideoNum = options.TotalVideo; //可以选取视频的剩余数量
			this.data.VideoArray = [];
			this.data.VideoWith = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.2);
			this.data.VideoMarginLeft = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.04);
		}
	}

	//初始化监听
	proto.initEvent = function() {
		//console.log('MultiMedia-initEvent');
		var self = this;
		var options = this.options;
		//图片
		if(this.options.Picture) {
			//相机
			document.getElementById('MultiMedia_Picture_Header').addEventListener('tap', function() {
				self.initImageEvent(0);
			});
			//图库
			document.getElementById('MultiMedia_Tuku_Header').addEventListener('tap', function() {
				self.initImageEvent(1);
			});

			//显示图片区域，删除按钮的监听
			mui('#MultiMedia_Picture_Footer').on('tap', '.multimedia-picture-delete', function() {
				self.initDelImageEvent(this);
			});
		}

		//音频
		if(this.options.Audio) {
			document.getElementById('MultiMedia_Audio_Header').addEventListener('tap', function() {
				document.activeElement.blur();
				mui.toast('录制语音功能暂未开放');
			});
		}

		//视频
		if(this.options.Video) {
			document.getElementById('MultiMedia_Video_Header').addEventListener('tap', function() {
				self.initVideoEvent();
			});

			//显示视频区域，删除按钮的监听
			mui('#MultiMedia_Video_Footer').on('tap', '.multimedia-picture-delete', function() {
				self.initDelVideoEvent(this);
			});

			//显示视频区域，播放按钮的监听
			mui('#MultiMedia_Video_Footer').on('tap', '.multimedia-video-play', function() {
				self.initPlayVideoEvent(this);
			});
		}
	}

	//初始化图片选择的监听
	proto.initImageEvent = function(type) {
		var self = this;
		var options = this.options;
		document.activeElement.blur();
		//已经录制了视频
		if(options.Video && self.data.VideoNum * 1 < options.TotalVideo) {
			mui.toast('图片与视频不能同时添加');
			return false;
		}
		if(self.data.PictureNum > 0) {
			self.pictureActionSheet(type);
		} else {
			mui.toast('图片数量超出限制');
		}
	}

	//初始化删除选择的图片的监听
	proto.initDelImageEvent = function(element) {
		var self = this;
		var options = this.options;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Picture_Delete_', '');
		var parent = element.parentNode;
		//删除数组
		for(var i = 0; i < self.data.PictureArray.length; i++) {
			if(self.data.PictureArray[i].id == id) {
				self.data.PictureArray.splice(i, 1);
				self.data.PictureNum++;
			}
		}
		//删除界面的图片
		parent.parentNode.removeChild(parent);
		//调整界面高度
		self.changeFooterHeight(0, self.data.PictureArray.length);
		self.imageChangeCallBack();
	}

	//初始化录制视频的监听
	proto.initVideoEvent = function() {
		var self = this;
		var options = this.options;
		document.activeElement.blur();
		//已经选择了图片
		if(options.Picture && self.data.PictureNum * 1 < options.TotalPicture) {
			mui.toast('图片与视频不能同时添加');
			return false;
		}
		if(self.data.VideoNum > 0) {
			RecordVideo.recordVideo({}, function(fpath) {
				var wd = events.showWaiting('处理中...');
				console.log('录制视频成功 ' + fpath);
				self.addVideos(fpath, function() {
					wd.close();
				});
			}, function(err) {
				mui.toast('录制视频失败 ' + JSON.stringify(err));
			});
		} else {
			mui.toast('视频数量超出限制');
		}
	}

	//初始化删除录制的视频的监听
	proto.initDelVideoEvent = function(element) {
		var self = this;
		var options = this.options;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Video_Delete_', '');
		var parent = element.parentNode;
		//删除数组
		for(var i = 0; i < self.data.VideoArray.length; i++) {
			if(self.data.VideoArray[i].id == id) {
				self.data.VideoArray.splice(i, 1);
				self.data.VideoNum++;
			}
		}
		//删除界面的视频
		parent.parentNode.removeChild(parent);
		//调整界面高度
		self.changeFooterHeight(1, self.data.VideoArray.length);
		self.videoChangeCallBack();
	}

	/**
	 * 播放视频的监听
	 * @param {Object} element
	 */
	proto.initPlayVideoEvent = function(element) {
		var self = this;
		var options = this.options;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Video_Play_', '');
		var videoOption;
		for(var i = 0; i < self.data.VideoArray.length; i++) {
			if(self.data.VideoArray[i].id == id) {
				videoOption = self.data.VideoArray[i];
				break;
			}
		}
		self.videoPlayCallBack(videoOption);
	}

	/**
	 * 显示图片的选择方式
	 */
	proto.pictureActionSheet = function(type) {
		//console.log('pictureActionSheet');
		var self = this;
		var NumPick = self.data.PictureNum;
		var type = type || 0;
		if(type == 0) {
			//拍取照片
			self.pictureTake();
		} else {
			//从相册选取照片
			self.picturesPick(NumPick);
		}
	}

	/**
	 * 相机拍取照片
	 */
	proto.pictureTake = function() {
		var self = this;
		var options = this.options;
		mod.cameraTake(function(path) {
			//console.log('pictureTake :' + path);
			var wd = events.showWaiting('处理中...');
			var myDate = new Date();
			var fileName = options.Key + myDate.getTime() + (Math.floor(Math.random() * 10)) + '.png';
			var dst = '_documents/' + imageId + '_' + fileName;
			imageId++;
			compress.compressImageTo_1MB({
				path: path,
				dst: dst
			}, function(event) {
				self.addImages([event.target]);
				wd.close();
			}, function(error) {
				wd.close();
			});
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
		//console.log('picturesPick');
		var self = this;
		var options = this.options;
		mod.galleryPickFalse('image', true, NumPick, function(event) {
			var wd = events.showWaiting('处理中...');
			var files = event.files; // 保存多选的图片或视频文件路径
			var myDate = new Date();
			var num = 0;
			var tempArrary = [];
			for(var i = 0; i < files.length; i++) {
				var fileName = imageId + '_' + i + '_' + options.Key + myDate.getTime() + (Math.floor(Math.random() * 10)) + '.png';
				imageId++;
				var dst = '_documents/' + fileName;
				tempArrary.push({
					fpath: files[i], //文件路径
					dst: dst //压缩后的路径
				});
			}

			for(var i = 0; i < tempArrary.length; i++) {
				compress.compressImageTo_1MB({
					path: tempArrary[i].fpath,
					dst: tempArrary[i].dst
				}, function(event) {
					num++;
					var target = event.target;
					var nameArray = target.split('/');
					var name = nameArray[nameArray.length - 1];
					var id = name.split('_')[1];
					tempArrary[id].target = target;
					if(num == files.length) {
						var tempFiles = [];
						for(var i = 0; i < tempArrary.length; i++) {
							tempFiles.push(tempArrary[i].target);
						}
						self.addImages(tempFiles);
						wd.close();
					}
				}, function(error) {
					wd.close();
				});
			}
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			mui.toast('从相册选取图片失败 ' + '错误编码 ' + code + '描述信息 ' + message);
		});
	}

	/**
	 * 显示选择的图片
	 * @param {Object} path 图片路径
	 */
	proto.addImages = function(paths) {
		var self = this;
		var options = this.options;
		var width = self.data.PictureWith;
		var widthStr = self.data.PictureWith + 'px';
		var marginLeft = self.data.PictureMarginLeft;
		var footer = document.getElementById("MultiMedia_Picture_Footer");
		var group = 'MultiMedia_Picture';
		for(var i = 0; i < paths.length; i++) {
			//console.log('addImages ' + paths[i]);
			var pathArrary = paths[i].split('/');
			var name = pathArrary[pathArrary.length - 1];
			var id = name.split('_')[0];
			var images = {
				id: id, //图片Id
				path: paths[i], //图片路径
				domain: '', //图片地址
				thumb: '' //图片缩略图地址
			};
			self.data.PictureNum--;
			self.data.PictureArray.push(images);
			var element = document.createElement('div');
			element.className = 'multimedia-picture-area';
			//删除按钮
			var html_0 = '<a id="MultiMedia_Picture_Delete_' + images.id + '" class="mui-icon iconfont icon-guanbi multimedia-picture-delete" style="margin-left: ' + parseInt(width + marginLeft / 2) + 'px;margin-top:' + parseInt(marginLeft / 2) + 'px;"></a>'
			//显示图片的区域
			var html_1 = '<div class="multimedia-picture" style="width: ' + width + 'px; height: ' + width + 'px; margin-left: ' + marginLeft + 'px; margin-top: ' + marginLeft + 'px;">'
			//图片
			var html_2 = '<img src="' + paths[i] + '" data-preview-src="' + paths[i] + '" data-preview-group="' + group + '" style="width:100%;visibility: hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + widthStr + '\';this.style.width=\'initial\';this.style.marginLeft=-parseInt((this.offsetWidth-' + width + ')/2)+\'px\';}else{this.style.marginTop=-parseInt((this.offsetHeight-' + width + ')/2)+\'px\';}this.style.visibility=\'visible\';" />';
			var html_3 = '</div>'
			element.innerHTML = html_0 + html_1 + html_2 + html_3;
			footer.appendChild(element);
			self.imageChangeCallBack();
		}
		//console.log(document.getElementById("MultiMedia").innerHTML);
		self.changeFooterHeight(0, self.data.PictureArray.length);
	}

	/**
	 * 调整图片,视频区域的高度
	 * @param {Object} type 元素的类型0图片;1视频
	 * @param {Object} length 元素的数量
	 */
	proto.changeFooterHeight = function(type, length) {
		var self = this;
		var options = this.options;
		var width;
		var marginLeft;
		var footer;
		var type = type || 0;
		if(type == 0) { //图片区域
			width = self.data.PictureWith;
			marginLeft = self.data.PictureMarginLeft;
			footer = document.getElementById("MultiMedia_Picture_Footer");
		} else { //视频
			width = self.data.VideoWith;
			marginLeft = self.data.VideoMarginLeft;
			footer = document.getElementById("MultiMedia_Video_Footer");
		}
		var num = length || 0;
		if(num == 0) { //0张
			footer.style.height = '0px';
		} else if(num > 0 && num < 5) { //1-4张,一行
			footer.style.height = width + marginLeft * 2 + 'px';
		} else if(num > 4 && num < 9) { //5-8张，二行
			footer.style.height = width * 2 + marginLeft * 3 + 'px';
		} else if(num > 8 && num < 13) { //9-12张，三行
			footer.style.height = width * 3 + marginLeft * 4 + 'px';
		} else {
			console.log('### ERROR ### 数量超过 12，放置的区域未设置相应的高度');
		}
	}

	/**
	 * 清空图片选择区域和初始化数据
	 */
	proto.imageRefresh = function() {
		var self = this;
		var options = this.options;
		self.data.PictureNum = options.TotalPicture; //可以选取图片的剩余数量
		self.data.PictureArray = []; //已选取的图片路径
		var footer = document.getElementById("MultiMedia_Picture_Footer");
		footer.innerHTML = '';
		self.changeFooterHeight(0, self.data.PictureArray.length);
	}

	/**
	 * 显示录制的视频
	 * @param {Object} path 视频路径
	 */
	proto.addVideos = function(path, callback) {
		var self = this;
		var options = this.options;
		var width = self.data.VideoWith;
		var marginLeft = self.data.VideoMarginLeft;
		var footer = document.getElementById("MultiMedia_Video_Footer");
		var pathArray = path.split('/');
		//生成缩略图
		var video = document.createElement("video");
		video.src = path;
		video.onloadeddata = function() {
			var canvas = document.createElement('canvas');
			canvas.width = video.videoWidth / 2;
			canvas.height = video.videoHeight / 2;
			console.log('canvas ' + canvas.width + ' ' + canvas.height)
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			var thumb = canvas.toDataURL("image/png");
			//增加视频
			var videos = {
				id: pathArray[pathArray.length - 1], //视频Id
				path: path, //视频路径
				localthumb: thumb, //视频本地的缩略图地址
				domain: '', //视频地址
				thumb: '', //视频缩略图地址
				width: canvas.width, //视频缩略图宽
				height: canvas.height //视频缩略图高
			};
			self.data.VideoNum--;
			self.data.VideoArray.push(videos);
			//显示视频
			var element = document.createElement('div');
			element.className = 'multimedia-picture-area';
			//删除按钮
			var html_0 = '<a id="MultiMedia_Video_Delete_' + videos.id + '" class="mui-icon iconfont icon-guanbi multimedia-picture-delete" style="margin-left: ' + parseInt(width + marginLeft / 2) + 'px;margin-top:' + parseInt(marginLeft / 2) + 'px;"></a>'
			//显示视频缩略图的区域
			var html_1 = '<div class="multimedia-picture" style="width: ' + width + 'px; height: ' + width + 'px; margin-left: ' + marginLeft + 'px; margin-top: ' + marginLeft + 'px;">'
			//播放按钮
			var html_2 = '<img id="MultiMedia_Video_Play_' + videos.id + '" class="multimedia-video-play" src="../../image/utils/playvideo.png" style="width: ' + parseInt(width / 2) + 'px; height: ' + parseInt(width / 2) + 'px;left: ' + parseInt(width / 4) + 'px;top: ' + parseInt(width / 4) + 'px; "/>';
			//视频缩略图
			var html_3 = '<img src="' + videos.localthumb + '" style="width:100%;visibility: hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + width + 'px\';this.style.width=\'initial\';this.style.marginLeft=-parseInt((this.offsetWidth-' + width + ')/2)+\'px\';}else{this.style.marginTop=-parseInt((this.offsetHeight-' + width + ')/2)+\'px\';}this.style.visibility=\'visible\';" />';
			var html_4 = '</div>'
			element.innerHTML = html_0 + html_1 + html_2 + html_3 + html_4;
			footer.appendChild(element);
			self.changeFooterHeight(1, self.data.VideoArray.length);
			self.videoChangeCallBack();
			callback();
		}
	}

	/**
	 * 清空视频区域和初始化数据
	 */
	proto.videoRefresh = function() {
		var self = this;
		var options = this.options;
		self.data.VideoNum = options.TotalVideo; //可以选取图片的剩余数量
		self.data.VideoArray = []; //已选取的图片路径
		var footer = document.getElementById("MultiMedia_Video_Footer");
		footer.innerHTML = '';
		self.changeFooterHeight(1, self.data.VideoArray.length);
	}

	/**
	 * 图片数量变化的回调
	 */
	proto.imageChangeCallBack = function() {}
	/**
	 * 视频数量变化的回调
	 */
	proto.videoChangeCallBack = function() {}
	/**
	 * 播放某个视频的回调
	 */
	proto.videoPlayCallBack = function(data) {}

	var MultiMediaApi = null; //声明一个null的变量，用来存储多媒体对象

	//创建并返回一个多媒体对象
	mod.multiMedia = function(options) {
		//console.log('multiMedia ' + JSON.stringify(options));
		if(!MultiMediaApi) {
			MultiMediaApi = new MultiMedia(options); //new一个多媒体对象
		}
		return MultiMediaApi;
	};

	//返回一个多媒体对象
	mod.getMultiMedia = function() {
		return MultiMediaApi;
	}

	/**
	 * 调使用5+统一相册选择界面选择照片或视频
	 * @param {Object} filter 相册选择文件过滤类型,图片文件（“image”）,视频文件（“video”）,所有文件（“none”）
	 * @param {Object} multiple 是否是多选，多选true
	 * @param {Object} maximum 最多选择的图片数量，单选设置1
	 * @param {Object} successCB 选择照片成功的回调
	 * @param {Object} errorCB 选择照片失败的回调
	 */
	mod.galleryPickFalse = function(filter, multiple, maximum, successCB, errorCB) {
		//console.log('galleryPickFalse | filter ' + filter + ' | multiple ' + multiple + ' | maximum ' + maximum);
		plus.gallery.pick(function(event) {
			successCB(event);
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			if(plus.os.name == 'iOS') { //苹果
				if(code != -2) {
					console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
					errorCB({
						code: code, // 错误编码
						message: 'ios ' + message // 错误描述信息
					});
				} else {
					console.log('未选取图片 ' + JSON.stringify(error));
				}
			} else if(plus.os.name == 'Android') { //安卓
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
					message: plus.os.name + ' ' + message // 错误描述信息
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
	 *  系统自带相册选择控件
	 */
	mod.galleryPickTrue = function(successCB, errorCB) {
		plus.gallery.pick(function(file) {
			//console.log('从相册选取图片成功,图片的路径为：' + file);
			successCB(file) //压缩图片
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			if(plus.os.name == 'iOS') { //苹果
				if(code != -2) {
					console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
					errorCB({
						code: code, // 错误编码
						message: 'ios ' + message // 错误描述信息
					});
				} else {
					console.log('未选取图片 ' + JSON.stringify(error));
				}
			} else if(plus.os.name == 'Android') { //安卓
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
					message: plus.os.name + ' ' + message // 错误描述信息
				});
			}
		});
	}

	/**
	 * 拍照
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.cameraTake = function(successCB, errorCB) {
		//获取设备默认的摄像头对象
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(capturedFile) {
				//将本地URL路径转换成平台绝对路径
				var path = 'file://' + plus.io.convertLocalFileSystemURL(capturedFile);
				//console.log('转换成平台绝对路径,图片的路径为 ' + path);
				successCB(path);
			},
			function(error) {
				// 拍照失败的回调
				var code = error.code; // error.code（Number类型）获取错误编码
				var message = error.message; // error.message（String类型）获取错误描述信息。
				if(plus.os.name == 'iOS') {
					if(code !== 2) {
						errorCB({
							code: code, // 错误编码
							message: 'iOS ' + message // 错误描述信息
						});
						mui.toast('拍照失败！' + '错误编码：' + code + ' 描述信息：' + message, '拍照失败');
						console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else if(plus.os.name == 'Android') {
					if(code !== 11) {
						errorCB({
							code: code, // 错误编码
							message: 'Android ' + message // 错误描述信息
						});
						console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else {
					errorCB({
						code: code, // 错误编码
						message: plus.os.name + ' ' + message // 错误描述信息
					});
				}
			}, {}
		);
	}

	mod.showVideo = function(path, thumb) {

	}

	return mod;

})(mui, window.MultiMedia || {});