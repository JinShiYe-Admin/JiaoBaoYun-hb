var MultiMedia = (function($, mod) {

	mod.pictureNumPick = 9; //图片限制
	mod.MultiMediaType = 0; //0未选择，1图片，2视频，3音频

	/**
	 * 设置上传图片，视频，音频区域
	 * @param {Object} element
	 */
	mod.addElement = function(element) {
		var html_yuyin = ''; //语音图标
		var html_xiangji = ''; //相机图标
		//html_yuyin = '<span id="MultiMedia_yuyin" class="mui-icon iconfont icon-yuyin"></span>';
		html_xiangji = '<span id="MultiMedia_xiangji" class="mui-icon iconfont icon-xiangji"></span>';
		element.innerHTML = html_yuyin + html_xiangji;
		//		document.getElementById('MultiMedia_yuyin').addEventListener('tap', function() {
		//			mui.toast('语音');
		//		});

		document.getElementById('MultiMedia_xiangji').addEventListener('tap', function() {
			var btnArray = null;
			switch(mod.MultiMediaType) {
				case 0:
					btnArray = [{
						title: "拍取照片"
					}, {
						title: "录制视频(20M)"
					}, {
						title: "从相册选取照片"
					}, {
						title: "从相册选取视频(20M)"
					}];
					break;
				case 1:
					btnArray = [{
						title: "拍取照片"
					}, {
						title: "从相册选取照片"
					}];
					break;
				default:
					console.log('MultiMediaType:' + mod.MultiMediaType);
					break;

			}
			plus.nativeUI.actionSheet({
				title: '选择文件的方式',
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				if(mod.MultiMediaType == 0) { //未选择
					switch(index) {
						case 1: //拍取照片
							break;
						case 2: //录制视频(20M)
							break;
						case 3: //从相册选取照片
							mod.addPictures();
							break;
						case 4: //从相册选取视频(20M)
							break;
						default:
							console.log('选择文件的方式:' + index);
							break;
					}
				} else if(mod.MultiMediaType == 1) { //选择图片
					switch(index) {
						case 1: //拍取照片
							break;
						case 2: //从相册选取照片
							mod.addPictures();
							break;
						default:
							console.log('选择文件的方式:' + index);
							break;
					}
				} else {
					console.log('actionSheet|MultiMediaType:' + mod.MultiMediaType);
				}
			});
		});
	}

	/**
	 * 相册选择图片
	 * @param {Object} multiple
	 * @param {Object} num
	 */
	mod.addPictures = function() {
		console.log('addPicture:' + mod.pictureNumPick);
		if(mod.pictureNumPick == 0) {
			mui.toast('图片已选取9张');
		} else {
			mod.galleryPick('image', true, mod.pictureNumPick, function(event) {
				mod.MultiMediaType = 1;
				var files = event.files; // 保存多选的图片或视频文件路径
				mui.each(files, function(index, element) {
					console.log(index + '|' + element);
				});
				mod.pictureNumPick = mod.pictureNumPick - files.length
				console.log('pictureNumPick:' + mod.pictureNumPick);
			});
		}
	}

	/**
	 * 调用系统方法相册选择照片或视频
	 * @param {Object} filter 相册选择文件过滤类型,图片文件（“image”）,视频文件（“video”）,所有文件（“none”）
	 * @param {Object} multiple 是否是多选，多选true
	 * @param {Object} maximum 最多选择的图片数量，单选设置1
	 * @param {Object} successCB 选择照片成功的回调
	 * @param {Object} errorCB 选择照片失败的回调
	 */
	mod.galleryPick = function(filter, multiple, maximum, successCB, errorCB) {
		console.log('galleryPick|filter:' + filter + '|multiple:' + multiple + '|maximum:' + maximum);
		plus.gallery.pick(function(event) {
			successCB(event);
		}, function(error) {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			if(mui.os.ios) {
				if(code != -2) {
					mui.toast('从相册选取图片失败:' + '错误编码：' + code + '描述信息：' + message);
					console.log('从相册选取图片失败:' + JSON.stringify(error));
				} else {
					console.log('未选取图片:' + JSON.stringify(error));
				}
			} else if(mui.os.android) {
				if(code != 12) {
					mui.toast('从相册选取图片失败:' + '错误编码：' + code + '描述信息：' + message);
					console.log('从相册选取图片失败:' + JSON.stringify(error));
				} else {
					console.log('未选取图片:' + JSON.stringify(error));
				}
			}
		}, {
			filter: filter,
			maximum: maximum,
			multiple: multiple,
			onmaxed: function() {
				mui.toast('最多只能选择' + maximum + '张图片');
			},
			system: false //多选必须设置的参数
		});
	}

	return mod;
})(mui, window.MultiMedia || {});