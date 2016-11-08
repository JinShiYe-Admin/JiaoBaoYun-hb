function testPro(tempdata) {
	//6.用户修改各项用户信息
	//需要加密的数据
	//	var enData = {};
	//	//不需要加密的数据
	//	var comData = {
	//		vtp: 'unick', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件)
	//		vvl: '测试修改昵称', //对应的值
	//	};
	//	// 等待的对话框
	//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//	//发送网络请求，data为网络返回值
	//	postDataEncry(storageKeyName.MAINURL + 'PostReUinf', enData, comData, 1, wd, function(data) {
	//		wd.close();
	//		console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
	//		if(data.RspCode == 0) {
	//
	//		} else {
	//			mui.alert(data.RspTxt, "错误", "OK", null);
	//		}
	//	});

	//7.用户创建群
	//需要加密的数据
	//	var enData = {};
	//	//不需要加密的数据
	//	var comData = {
	//		gname: '测试群名', //群名
	//		gimg: 'jjjjjjj', //群头像
	//	};
	//	// 等待的对话框
	//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//	//发送网络请求，data为网络返回值
	//	postDataEncry(storageKeyName.MAINURL + 'PostCrGrp', enData, comData, 1, wd, function(data) {
	//		wd.close();
	//		console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
	//		if(data.RspCode == 0) {
	//
	//		} else {
	//			mui.alert(data.RspTxt, "错误", "OK", null);
	//		}
	//	});

	//8.用户修改群各项信息
	//需要加密的数据
//	var enData = {};
//	//不需要加密的数据
//	var comData = {
//		vtp: 'gname', //指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名)
//		vvl: '测试修改群名',//要修改成的值
//		rid: '3'//要修改的群id
//	};
//	// 等待的对话框
//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//	//发送网络请求，data为网络返回值
//	postDataEncry(storageKeyName.MAINURL + 'PostReGinfo', enData, comData, 1, wd, function(data) {
//		wd.close();
//		console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//		if(data.RspCode == 0) {
//
//		} else {
//			mui.alert(data.RspTxt, "错误", "OK", null);
//		}
//	});

	//9.获取用户群
	//获取个人信息
//	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//	//需要加密的数据
//	var enData = {};
//	//不需要加密的数据
//	var comData = {
//		vtp: 'cg', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群)
//		vvl: personalUTID, //查询的各项，对应人的utid，可以是查询的任何人
//	};
//	// 等待的对话框
//	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//	//发送网络请求，data为网络返回值
//	postDataEncry(storageKeyName.MAINURL + 'PostGList', enData, comData, 1, wd, function(data) {
//		wd.close();
//		console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//		if(data.RspCode == 0) {
//			
//		} else {
//			mui.alert(data.RspTxt, "错误", "OK", null);
//		}
//	});
	
	//10.Token续订(之前有过相同登陆数据的才能续订成功)
	//获取个人信息
//		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//	//需要加密的数据
//		var enData = {};
//		//不需要加密的数据
//		var comData = {
//			uuid: plus.device.uuid,
//			utid: personalUTID,
//			appid: plus.runtime.appid
//		};
//		// 等待的对话框
//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//		//发送网络请求，data为网络返回值
//		postDataEncry(storageKeyName.MAINURL + 'PostTokenRenew', enData, comData, 0, wd, function(data) {
//			wd.close();
//			console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//			if(data.RspCode == 0) {
//				//修改本地存储中的值
//				 window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token = data.RspData;
//			} else {
//				mui.alert(data.RspTxt, "错误", "OK", null);
//			}
//		});
		
		//11.通过用户账号和手机号搜索用户
		//需要加密的数据
		var enData = {};
		//不需要加密的数据
		var comData = {
			vvl: '111111'//查询的值
		};
		// 等待的对话框
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		//发送网络请求，data为网络返回值
		postDataEncry(storageKeyName.MAINURL + 'PostUList', enData, comData, 1, wd, function(data) {
			wd.close();
			console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//返回值model：model_searchPeople
			} else {
				mui.alert(data.RspTxt, "错误", "OK", null);
			}
		});
}