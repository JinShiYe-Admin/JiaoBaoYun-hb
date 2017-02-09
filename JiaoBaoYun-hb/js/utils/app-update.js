var appUpdate = (function(mod) {
	mod.getAppVersion = function(versionInfo) {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			mod.appVersion = inf.version;
			console.log("当前应用版本：" + mod.appVersion);
			getUpCondition(versionInfo);
		});
	}
	var getUpCondition = function(versionInfo) {
		var appVersions = mod.appVersion.split('.');
		var newestVersions = versionInfo.ver.split('.');
		var appVersionMinMax = getMinMax(appVersions);
		var newestVersionMinMax = getMinMax(newestVersions);
		if(appVersionMinMax.max < newestVersionMinMax.max) {
			downApk(versionInfo.baseverurl);
		} else {
			if(appVersionMinMax.min<newestVersionMinMax.min){
				downWgt(versionInfo.addverurl);
			}
		}
	}
	var getMinMax = function(numArray) {
		var minMax = {};
		for(var i in numArray) {
			if(i ==0) {
				minMax.max = parseInt(numArray[i]);
			} else {
				minMax.min += parseInt(numArray[i]);
			}
		}
		return minMax;
	}

	function downApk(ApkUrl) {
		if(plus.os.android) {
			var url = ""; // 下载文件地址
			var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
				if(status == 200) { // 下载成功
					var path = d.filename;
					console.log(d.filename);
					installApk(path);
				} else { //下载失败
					alert("Download failed: " + status);
				}
			});
			dtask.start();
		}
	}

	function downWgt(wgtUrl) {
		plus.nativeUI.showWaiting("下载wgt文件...");
		plus.downloader.createDownload(wgtUrl, {
			filename: "_doc/update/"
		}, function(d, status) {
			if(status == 200) {
				console.log("下载wgt成功：" + d.filename);
				installWgt(d.filename); // 安装wgt包
			} else {
				console.log("下载wgt失败！");
				plus.nativeUI.alert("下载wgt失败！");
			}
			plus.nativeUI.closeWaiting();
		}).start();
	}

	function installApk(path) {
		if(plus.os.android) {
			plus.runtime.install(path); // 安装下载的apk文件
		} else {
			var url = 'itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8'; // HelloH5应用在appstore的地址
			plus.runtime.openURL(url);
		}
	}
	// 更新应用资源
	function installWgt(path) {
		plus.nativeUI.showWaiting("安装wgt文件...");
		plus.runtime.install(path, {}, function() {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件成功！");
			plus.nativeUI.alert("应用资源更新完成！", function() {
				plus.runtime.restart();
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
			plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
		});
	}
})(appUpdate || {})