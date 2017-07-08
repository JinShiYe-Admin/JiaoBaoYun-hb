//课程详情列表的公共方法
var courseDetails = (function(mod) {
	/**
	 * 课程列表中的图片加载成功
	 * @param {Object} img 图片元素
	 */
	mod.onImageLoad = function(img) {
		img.parentNode.style.height = parseInt(img.parentNode.offsetWidth * (4 / 5)) + "px";
		if(img.offsetWidth > img.offsetHeight) { //宽的图片
			img.style.height = img.parentNode.offsetHeight + "px";
			img.style.width = "initial";
			img.style.marginLeft = parseInt(img.offsetWidth * 0.5 - img.parentNode.offsetWidth * 0.5) * (-1) + 'px';
		} else { //高的图片
			img.style.marginTop = parseInt(img.offsetHeight * 0.5 - img.parentNode.offsetHeight * 0.5) * (-1) + 'px';
		}
		img.style.visibility = "visible";
	}

	/**
	 * 音视频显示的时间
	 * @param {Object} time
	 */
	mod.getAudioTime = function(time) {
		time = time || 0;
		var strTime = "";
		var hour = Math.floor(time / 3600);

		if(hour > 0) {
			if(hour < 10) {
				strTime = "0" + hour + ':';
			} else {
				strTime = hour + ':';
			}
		}
		var min = Math.floor((time - 3600 * hour) / 60);
		if(min < 10) {
			strTime = strTime + "0" + min + ':';
		} else {
			strTime = strTime + min + ':';
		}
		var sec = time - 3600 * hour - 60 * min;
		if(sec < 10) {
			strTime = strTime + "0" + sec;
		} else {
			strTime = strTime + sec;
		}
		return strTime;
	}

	/**
	 * 课程列表中的图片加载失败
	 * @param {Object} img
	 */
	mod.onImageError = function(img) {
		img.style.visibility = "visible";
		img.src = "../../image/utils/load-img-error.png"
	}

	/**
	 * 视频播放按钮加载失败
	 * @param {Object} img
	 */
	mod.onPlayError = function(img) {
		img.parentNode.style.visibility = "visible";
	}

	/**
	 * 视频播放按钮加载成功
	 * @param {Object} img
	 */
	mod.onPlayLoad = function(img) {
		img.parentNode.parentNode.style.height = parseInt(img.parentNode.parentNode.offsetWidth * (3 / 4)) + "px";
		var width = img.parentNode.parentNode.offsetWidth;
		var height = parseInt(width * (4 / 5));
		img.parentNode.style.width = width + "px";
		img.parentNode.style.height = height + "px";
		img.parentNode.style.visibility = "visible";
		img.style.marginLeft = parseInt((width - 40) / 2) + "px";
		img.style.marginTop = parseInt((height - 40) / 2) + "px";
	}

	/**
	 * 音频的外框
	 * @param {Object} width
	 */
	mod.getAudioBorderPath = function(width) {
		if(!width) {
			width = width || plus.screen.resolutionWidth;
			width = parseInt(width * 3 / 5);
		}
		var pathD = "M8 45 C13 40 15 38 15 25 L15 21 Q15 1 36 1 L" + width + " 1 Q" + (width + 20) + " 1 " + (width + 20) + " 21 Q" + (width + 20) + " 41 " + width + " 41 L30 41 Q15 41 12 43 L8 45 Z"
		return pathD;
	}
	return mod;
})(window.courseDetails || {})