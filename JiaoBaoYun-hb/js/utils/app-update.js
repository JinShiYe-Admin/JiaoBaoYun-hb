/**
 * 更新版本模块
 */
var appUpdate = (function(mod) {
	/**
	 * 获取版本信息后，判断是否更新
	 * @param {Object} versionInfo 服务器返回的版本信息
	 */
	mod.getAppVersion = function(versionInfo) {
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				mod.appVersion = getBigVersion(inf.version,plus.runtime.version);
				console.log('应用版本号:'+plus.runtime.version+',资源升级版本号:'+inf.version)
				console.log("当前应用版本：" + mod.appVersion);
				getUpCondition(versionInfo); //判断是否更新
			});
		}
	/**
	 * 获取最大数据
	 * @param {Object} version0
	 * @param {Object} version1
	 */
	var getBigVersion=function(version0,version1){
		var version0Array=version0.split('.');
		var version1Array=version1.split('.');
		for(var i in version0Array){
			if(parseInt(version0Array[i])>parseInt(version1Array[i])){
				return version0;
			}else if(parseInt(version0Array[i])<parseInt(version1Array[i])){
				return version1;
			}
		}
	}
		/**
		 * 判断是否更新
		 * @param {Object} versionInfo
		 */
	var getUpCondition = function(versionInfo) {
		var appVersions = mod.appVersion.split('.');
		var newestVersions = versionInfo.ver.split('.');
		var appVersionMinMax = getMinMax(appVersions);
		var newestVersionMinMax = getMinMax(newestVersions);
		if(appVersionMinMax.max < newestVersionMinMax.max) { //整包更新
			//询问是否更新
			setDialog('教宝云有新版本，是否下载？', function() {
				downApk(versionInfo.baseverurl)
			})
		} else {
			if(appVersionMinMax.min < newestVersionMinMax.min) { //在线更新
//				setDialog('教宝云有新版本，是否下载？', function() {
					downWgt(versionInfo.addverurl);
//				})
			}
		}
	}
	/**
	 * 设置提示对话框
	 * @param {Object} hint 提示语
	 * @param {Object} callback 确认后的回调函数
	 */
	var setDialog = function(hint, callback) {
			var btnArray = ['否', '是'];
			mui.confirm(hint, '教宝云', btnArray, function(e) {
				if(e.index == 1) {
					callback();
				} else {
					mui.toast('您已取消下载新版本！')
				}
			})
		}
		/**
		 * 获取大版本号和小版本号
		 * @param {Object} numArray
		 */
	var getMinMax = function(numArray) {
			var minMax = {};
			var min='';
			for(var i in numArray) {
				if(i == 0) {
					minMax.max = parseInt(numArray[i]);
				} else {
					min+=numArray[i];
				}
			}
			minMax.min=parseInt(min);
			return minMax;
		}
		/**
		 * 下载整包
		 * @param {Object} ApkUrl 整包地址
		 */
	function downApk(ApkUrl) {
		if(plus.os.android) {
			var url = ""; // 下载文件地址
			var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
				if(status == 200) { // 下载成功
					var path = d.filename;
					console.log(d.filename);
					installApk(path);
				} else { //下载失败
					mui.toast("Download failed: " + status);
				}
			});
			dtask.start();
		}
	}
	/**
	 * 下载在线更新的资源
	 * @param {Object} wgtUrl
	 */
	function downWgt(wgtUrl) {
//		plus.nativeUI.showWaiting("下载wgt文件...");
		plus.downloader.createDownload(wgtUrl, {
			filename: "_doc/update/"
		}, function(d, status) {
			if(status == 200) {
				mui.toast("下载wgt成功：" + d.filename);
				installWgt(d.filename); // 安装wgt包
			} else {
				myi.toast("下载wgt失败！");
				plus.nativeUI.alert("下载wgt失败！");
			}
//			plus.nativeUI.closeWaiting();
		}).start();
	}
	/**
	 * 装载正整包
	 * @param {Object} path
	 */
	function installApk(path) {
		if(plus.os.android) {
			plus.runtime.install(path); // 安装下载的apk文件
		} else {
			var url = 'itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8'; // HelloH5应用在appstore的地址
			plus.runtime.openURL(url);
		}
	}
	/**
	 * 加载在线安装包
	 * @param {Object} path
	 */
	function installWgt(path) {
//		plus.nativeUI.showWaiting("安装wgt文件...");
		plus.runtime.install(path, {force:true}, function() {
//			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件成功！");
//			plus.nativeUI.alert("应用资源更新完成！", function() {
//				plus.runtime.restart();
//			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
//			plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
		});
	}
	return mod;
})(appUpdate || {})