/**
 * 账户信息js
 */
mui.init();
mui.plusReady(function() {
	//获取个人信息
	var pInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
	//展示个人信息
	changeInfo(pInfo);
	//获取性别控件
	var usex = document.getElementById('sex');
	document.getElementById('sex-container').addEventListener('tap', function() {
		//		console.log( "User pressed: "+e.index );
		plus.nativeUI.actionSheet({
			title: "请选择性别",
			cancel: "取消",
			buttons: [{
				title: "男"
			}, {
				title: "女"
			}]
		}, function(e) {
			console.log("User pressed: " + e.index);
			if(e.index > 0) {
				postSex(e.index, function(data) { //回调函数
					pInfo.usex = e.index;
					myStorage.setItem(storageKeyName.PERSONALINFO, pInfo);
					if(e.index == 1) {
						usex.innerText = '男';
					} else {
						usex.innerText = '女';
					}

				})
			}

		});
	})

	/**
	 * 拍照
	 */
	//		events.addTap('take-pic',function(){
	//			camera.getPic(camera.getCamera(),function(picPath){
	//				console.log(picPath);
	//				getFileByPath(picPath)
	//			})
	//		})
	/**
	 * 打开相册
	 */
	//		events.addTap('open-album',function(){
	//			gallery.getSinglePic(function(picPath){
	//				getFileByPath(picPath)
	//			})
	//		})

	//监听事件 传值 打开新页面
	mui('.mui-table-view').on('tap', '.open-newPage', function() {
		if(!(parseInt(this.getAttribute('pos')) == 10 && pInfo.uname && pInfo.uname != null)) {
			events.openNewWindowWithData('edit-info.html', parseInt(this.getAttribute('pos')));
		}
	});
	window.addEventListener('infoChanged', function() {
		pInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
		changeInfo(pInfo);
	});

	//---七牛上传头像---start---
	//个人头像修改
	var img = document.getElementById("img");
	UploadHeadImage.addListener(img, 0, {
		id: window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid, //utid
		//name: data.studentName //资料名称
	}, function(successCB) {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING, {
			back: 'none'
		});
		console.log('上传并修改个人头像，成功的回调' + JSON.stringify(successCB));
		mui.toast('个人头像成功');
		setTimeout(function() {
			pInfo.uimg = successCB;
			myStorage.setItem(storageKeyName.PERSONALINFO, pInfo);
			document.getElementById("img").src = successCB;
			events.fireToPageNone('mine.html', 'infoChanged');
			events.fireToPageNone('../index/index.html', 'infoChanged');
			events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
			events.fireToPageNone('classSpace-sub.html', 'infoChanged');
			//events.fireToPageNone('../cloud/cloud_home.html', 'personChanged');
			wd.close();
		}, 2000);
	}, function(errorCB) {
		console.log('上传并修改个人头像，失败的回调' + JSON.stringify(errorCB));
		mui.toast(data.RspTxt);
	});

});

var postSex = function(index, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostReUinf({
		vtp: "usex",
		vvl: index + ''
	}, wd, function(data) {
		wd.close()
		console.log(JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(data);
		} else {
			mui.toast(data.RspTxt)
		}
	})
}

/**
 * 界面显示个人信息
 * @param {Object} pInfo
 */
var changeInfo = function(pInfo) {
	var account = document.getElementById('account')
	var uimg = document.getElementById('img');
	var unick = document.getElementById('nick');
	var utxt = document.getElementById('txt');
	var uemail = document.getElementById('email');
	var uname = document.getElementById('uname');
	var usex = document.getElementById('sex');
	uimg.src = pInfo.uimg ? pInfo.uimg : "../../image/utils/default_personalimage.png";

	if(pInfo.uid) {
		account.innerText = pInfo.uid;
	}
	if(pInfo.unick) {
		unick.innerText = pInfo.unick;
	}
	if(pInfo.usex == 0) {
		usex.innerText = '未定';
	} else if(pInfo.usex == 1) {
		usex.innerText = '男';
	} else {
		usex.innerText = '女';
	}
	if(pInfo.utxt) {
		utxt.innerText = pInfo.utxt;
	}
	if(pInfo.uemail) {
		uemail.innerText = pInfo.uemail;
	}
	if(pInfo.uname) {
		uname.innerText = pInfo.uname;
	}

}