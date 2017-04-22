/**
 * 更新版本模块
 */
var appUpdate = (function(mod) {
	mod.fileSize;
	mod.updateApp = function() {
		//版本升级模块
		//47.获取APP版本号
		console.log('plus.os.name:' + plus.os.name);
		var tempVVL = 'android';
		if(plus.os.name == 'iOS'){
			tempVVL="ios";
		}
		//所需参数
		var comData9 = {
			uuid: plus.device.uuid, //用户设备号
			appid: plus.runtime.appid, //应用ID
			vvl: tempVVL //安卓：android,苹果：ios
		};
		// 等待的对话框
		var wd_0 = events.showWaiting();
		postDataPro_PostVerInfo(comData9, wd_0, function(data) {
			wd_0.close();
			console.log('获取APP版本号0:' + JSON.stringify(data));
			if(data.RspCode == 0) {
				mod.getAppVersion(JSON.parse(data.RspData));
				console.log('获取APP版本号:' + JSON.stringify(data.RspData));
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}
	/**
	 * 获取版本信息后，判断是否更新
	 * @param {Object} versionInfo 服务器返回的版本信息
	 */
	mod.getAppVersion = function(versionInfo) {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			mod.appVersion = getBigVersion(inf.version, plus.runtime.version);
			console.log('应用版本号:' + plus.runtime.version + ',资源升级版本号:' + inf.version)
			console.log("当前应用版本：" + mod.appVersion);
			console.log("服务端应用版本：" + JSON.stringify(versionInfo))
			getUpCondition(versionInfo); //判断是否更新
		});
	}
	/**
	 * 获取最大数据
	 * @param {Object} version0
	 * @param {Object} version1
	 */
	var getBigVersion = function(version0, version1) {
		var version0Array = version0.split('.');
		var version1Array = version1.split('.');
		for(var i in version0Array) {
			if(parseInt(version0Array[i]) > parseInt(version1Array[i])) {
				return version0;
			} else if(parseInt(version0Array[i]) < parseInt(version1Array[i])) {
				return version1;
			}
		}
		return version0;
	}
	/**
	 * 判断是否更新
	 * @param {Object} versionInfo
	 */
	var getUpCondition = function(version) {
		console.log("服务器版本信息：" + JSON.stringify(version))
		var appVersions = mod.appVersion.split('.');
		var newestVersions = version.ver.split('.');
		console.log("当前版本号和服务端版本号：" + JSON.stringify(appVersions) + JSON.stringify(newestVersions))
		var appVersionMinMax = getMinMax(appVersions);
		var newestVersionMinMax = getMinMax(newestVersions);
		if(appVersionMinMax.max < newestVersionMinMax.max) { //整包更新
			//询问是否更新
			setDialog('教宝云有新版本，是否下载？', function() {
				console.log("下载APK路径：" + version.baseverurl)
				if(plus.os.android){
					resolveFile(version.baseverurl, 1);
				}else{
					
				}
				
				//				downApk(version.baseverurl);
			})
		} else if(appVersionMinMax.max == newestVersionMinMax.max) {
			if(appVersionMinMax.min < newestVersionMinMax.min) { //在线更新
				if(plus.os.android){
					resolveFile(version.addverurl, 0);
				}else{
					setDialog('教宝云有新版本，是否下载？',function(){
						
					});
				}
				
			}
		} else {

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
		console.log(JSON.stringify(numArray))
		var min = '';
		for(var i in numArray) {
			if(i == 0) {
				minMax.max = parseInt(numArray[i]);
			} else if(i < 3) {
				min += numArray[i];
			} else {
				break;
			}
		}
		minMax.min = parseInt(min);
		return minMax;
	}
	/**
	 * 下载整包
	 * @param {Object} ApkUrl 整包地址
	 */
	function downApk(ApkUrl) {
		console.log(plus.os.name);
		if(plus.os.name == "Android") {
			console.log("下载APK路径：" + ApkUrl)
			var url = "_doc/update/"; // 下载文件地址
			var dtask = plus.downloader.createDownload(ApkUrl, {
				filename: "_doc/update/"
			}, function(d, status) {
				console.log("下载状态：" + status);
				if(status == 200) { // 下载成功
					var path = d.filename;
					console.log(d.filename);
					setDialog("新版app文件已下载，是否安装？", function() {
						installApk(path);
					})
				} else { //下载失败
					mui.toast("Download failed: " + status);
				}
			});
			dtask.addEventListener("statechanged", onStateChanged, false);
			dtask.start();
			console.log("开始下载!")
		}
	}
	/**
	 * 下载在线更新的资源
	 * @param {Object} wgtUrl
	 */
	function downWgt(wgtUrl) {
		//		plus.nativeUI.showWaiting("下载wgt文件...");
		var dtask = plus.downloader.createDownload(wgtUrl, {
			filename: "_doc/update/"
		}, function(d, status) {
			console.log("当前下载状态：" + status);
			if(status == 200) {
				console.log("下载wgt成功：" + d.filename);
				installWgt(d.filename); // 安装wgt包
			} else {
				console.log("下载wgt失败！");
				//				plus.nativeUI.alert("下载wgt失败！");
			}
		});
		dtask.addEventListener("statechanged", onStateChanged, false);
		dtask.start();
	}
	var onStateChanged = function(download, status) {
		//		console.log("当前下载状态：" + download.state + ":" + status + ":" + download.totalSize)
		if(download.state == 3) {
			if(!myStorage.getItem("loadFileSize") || myStorage.getItem("loadFileSize") != download.totalSize) {
				myStorage.setItem("loadFileSize", download.totalSize);
			}
		}
	}
	/**
	 * 装载正整包
	 * @param {Object} path
	 */
	function installApk(path) {
		if(plus.os.name == "Android") {
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
		plus.runtime.install(path, {
			force: true
		}, function() {
			console.log("安装wgt文件成功！");
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
		});
	}
	/**
	 * 
	 * @param {Object} fileUrl
	 * @param {Object} type 0升级包 1apk整包
	 */
	var resolveFile = function(fileUrl, type) {
		var filePath = "_doc/update/" + fileUrl.split('/')[fileUrl.split('/').length - 1]
		plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
			// 可通过entry对象操作test.html文件 
			console.log('存在文件！' + entry.isFile);
			entry.getMetadata(function(metadata) {
				if(myStorage.getItem("loadFileSize") == metadata.size) {
					console.log("Remove succeeded");
					if(type) {
						setDialog("新版app文件已下载，是否安装？", function() {
							installApk(filePath);
						})
					} else {
						installWgt(filePath);
					}
				} else {
					entry.remove(function(entry) {
						if(type) {
							downApk(fileUrl);
						} else {
							downWgt(fileUrl);
						}
					}, function(e) {
						alert(e.message);
					});

				}
			}, function() {
				console.log("文件错误");
			});
		}, function(e) {
			if(type) {
				downApk(fileUrl);
			} else {
				downWgt(fileUrl)
			}
		});
	}
	return mod;
})(appUpdate || {})