/**
 * 播放视频
 */
var playutil = (function(mod) {

	/**
	 * 检测是否支持video标签
	 * true,支持
	 */
	mod.checkVideo = function() {
		if(!!document.createElement('video').canPlayType) {
			var vidTest = document.createElement("video");
			oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
			if(!oggTest) {
				h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
				if(!h264Test) {
					return false;
				} else {
					if(h264Test == "probably") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				if(oggTest == "probably") {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	/**
	 * 安卓播放视频
	 * @param {Object} videoUrl
	 */
	mod.playVideoAndroid = function(videoUrl) {
		if(plus.os.name == 'Android') {
			//注意事项，Android上使用video标签播放视频时，务必打开硬件加速，否则只有声音没有画面。
			//因为在Android5的部分rom上是默认关闭硬件加速的，此时需强制打开硬件加速。创建webview时style里有个hardwareAccelerated参数，设置为true。
			if(!plus.webview.defaultHardwareAccelerated()) {
				var webview = plus.webview.currentWebview(); //获取当前窗体对象
				webview.style.hardwareAccelerated = true; //安卓必须开启硬件加速
			}
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var activity = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(videoUrl);
			intent.setDataAndType(uri, "video/*");
			activity.startActivity(intent);
		} else {
			console.log('### ERROR ### ' + plus.os.name);
		}
	}

	return mod;
})(window.playutil || {});