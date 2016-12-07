/**
 *  作者：444811716@qq.com
 *	时间：2016-10-20
 *  描述：云盘
 */
var cloud = (function($, mod) {

	/**
	 * 增加文件夹
	 * @param {Object} table 父元素
	 * @param {Object} data [FolderInfoList] 文件夹数组
	 * FolderInfoList:[FolderInfo] 文件夹信息数组
	 * FolderInfo：[FolderName,FolderUrl]
	 * FolderName 文件夹名字
	 * FolderUrl 文件夹路径
	 */
	mod.addFolders = function(table, data) {
		$.each(data, function(index, item) {
			var html = '';
			//右侧向右图标
			var html1 = '<a><span class="mui-navigate-right mui-media-object mui-pull-right"></span>';
			//左侧文件夹图片
			var html2 = '<img class="mui-media-object mui-pull-left" src="../../image/cloud/cloud_folder.png">';
			//文件夹名字
			var html3 = '<div class="mui-media-body"><p class="mui-ellipsis">' + item[0] + '</p></div></a>';

			html = html1 + html2 + html3;
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			li.id = item[1];
			li.setAttribute("data-name", item[0]);
			li.innerHTML = html;
			table.appendChild(li);
		});
	}

	/**
	 * 增加文件
	 * @param {Object} table 父元素
	 * @param {Object} data [FilesInfoList] 文件数组
	 * FilesInfoList:[FilesInfo] 文件夹信息数组
	 * FilesInfo：[FilesName,FilesUrl]
	 * FilesName 文件名字
	 * FilesUrl 文件路径
	 */
	mod.addFiles = function(table, data) {
		$.each(data, function(index, item) {
			var classify = mod.classify(item[0]);
			var html = '';
			//文件标识
			var html1 = '<a><img class="mui-media-object mui-pull-left" src="../../image/cloud/cloud_' + classify + '.png">';
			//右侧删除图标
			var html2 = '<span class="mui-icon mui-icon-trash mui-media-object mui-pull-right"></span>';
			//右侧下载图标
			var html3 = '<span class="mui-icon mui-icon-download mui-media-object mui-pull-right"></span>';
			//文件名
			var html4 = '<div class="mui-media-body"><p class="mui-ellipsis">' + item[0] + '</p></div></a>';
			html = html1 + html2 + html3 + html4;
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell mui-media';
			li.setAttribute('data-name', item[0]); //记录文件名字
			li.id = item[1]; //记录文件路径
			li.innerHTML = html;
			table.appendChild(li);
		});
	}

	/**
	 * 通过文件名后缀将文件分类
	 * @param {Object} filename 文件名
	 */
	mod.classify = function(filename) {
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
	 * 通过文件地址获取文件名
	 * @param {Object} filename 文件名
	 */
	mod.getFileName = function(fileurl) {
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