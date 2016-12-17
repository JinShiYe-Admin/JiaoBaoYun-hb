/**
 *  作者：444811716@qq.com
 *	时间：2016-10-20
 *  描述：云盘
 */
var cloud = (function($, mod) {

	/**
	 * 通过文件名后缀将文件分类(七牛用)
	 * @param {Object} filename 文件名
	 */
	mod.classify = function(filename) {
		//console.log('classify:' + filename);
		//把一个字符串分割成字符串数组
		var nameList = filename.split(".");
		//获取文件后缀
		var type = nameList[nameList.length - 1];
		//转换为小写
		type = type.toLowerCase(); //转换为小写
		switch(type) {
			case 'doc': //文档类型
			case 'docx':
				return 'icon-word';
				break;
			case 'xls': //文档类型
			case 'xlsx':
				return 'icon-excel';
				break;
			case 'txt': //文档类型
				return 'icon-txt';
				break;
			case 'zip': //压缩包类型
				return 'icon-zip';
				break;
			case 'rar': //压缩包类型
			case 'cab':
			case 'iso':
			case 'jar':
			case 'ace':
			case '7z':
			case 'tar':
			case 'gz':
			case 'arj':
			case 'lzh':
			case 'uue':
			case 'bz2':
			case 'z':
				return 'icon-yasuobao';
				break;
			case 'pdf': //文档类型
				return 'icon-pdf';
				break;
			case 'avi': //七牛能生成片缩略图的视频类型
			case 'mp4':
			case 'flv':
			case 'swf':
			case '3gp':
			case 'rm':
				return '';
				break;
			case 'wma': //视频格式
			case 'asf':
			case 'wmv':
			case 'rmvb':
				return 'icon-video';
				break;
			case 'psd': //七牛能生成缩略图的图片类型
			case 'jpeg':
			case 'jpg':
			case 'png':
			case 'gif':
			case 'webp':
			case 'tiff':
			case 'bmp':
				return '';
				break;
			case 'cda': //音频类型
			case 'wav':
			case 'cda':
			case 'aif':
			case 'aiff':
			case 'au':
			case 'mp1':
			case 'mp2':
			case 'mp3':
			case 'ra':
			case 'rm':
			case 'ram':
			case 'mid':
			case 'Rmi':
				return 'icon-mp3';
				break;
			default:
				return 'icon-file'; //未识别的文件类型
				break;
		}
	}

	/**
	 * 通过文件名后缀将文件分类
	 * @param {Object} filename 文件名
	 */
	mod.classify2 = function(filename) {
		//把一个字符串分割成字符串数组
		var nameList = filename.split(".");
		//获取文件后缀
		var type = nameList[nameList.length - 1];
		//转换为小写
		type = type.toLowerCase(); //转换为小写
		switch(type) {
			case 'doc': //文档类型
			case 'docx':
				return 'icon-word';
				break;
			case 'xls': //文档类型
			case 'xlsx':
				return 'icon-excel';
				break;
			case 'txt': //文档类型
				return 'icon-txt';
				break;
			case 'zip': //压缩包类型
				return 'icon-zip';
				break;
			case 'rar': //压缩包类型
			case 'cab':
			case 'iso':
			case 'jar':
			case 'ace':
			case '7z':
			case 'tar':
			case 'gz':
			case 'arj':
			case 'lzh':
			case 'uue':
			case 'bz2':
			case 'z':
				return 'icon-yasuobao';
				break;
			case 'pdf': //文档类型
				return 'icon-pdf';
				break;
			case 'avi': //视频类型
			case 'mp4':
			case 'flv':
			case 'swf':
			case '3gp':
			case 'rm':
			case 'wma':
			case 'asf':
			case 'wmv':
			case 'rmvb':
				return 'icon-video';
				break;
			case 'psd': //图片类型
			case 'jpeg':
			case 'jpg':
			case 'png':
			case 'gif':
			case 'webp':
			case 'tiff':
			case 'bmp':
				return 'icon-imge';
				break;
			case 'cda': //音频类型
			case 'wav':
			case 'cda':
			case 'aif':
			case 'aiff':
			case 'au':
			case 'mp1':
			case 'mp2':
			case 'mp3':
			case 'ra':
			case 'rm':
			case 'ram':
			case 'mid':
			case 'Rmi':
				return 'icon-mp3';
				break;
			default:
				return 'icon-file'; //未识别的文件类型
				break;
		}
	}

	/**
	 * 通过文件地址获取文件名
	 * @param {Object} filename 文件名
	 */
	mod.getFileName = function(fileurl) {
		//console.log('getFileName:' + fileurl);
		//把一个字符串分割成字符串数组
		var fileNameList = fileurl.split("/");
		//获得带后缀的文件名
		var fileNameList2 = fileNameList[fileNameList.length - 1];
		//获得没有后缀的文件名
		var fileName = fileNameList2.split('.')[0];
		return fileName;
	}

	return mod;
})(mui, window.cloud || {})