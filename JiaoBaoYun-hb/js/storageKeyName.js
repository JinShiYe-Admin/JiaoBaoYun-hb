//此js用于保存本地存储时，用到的key值


var storageKeyName = (function($, mod) {
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.MAINURL = 'http://192.168.0.224:8511/api/CloudApi/';//主url
	mod.WAITING = '加载中...';//加载提示
	mod.SIGNKEY = 'jsy309';//签名密钥
//	{"UTID":"2","Token":"5zZFcClE0zBJlQlSwBGD8hhghAM=","UserPhone":"111111","UserName":"test70C72521-2CD6-45DD-AF6E-375654EB734A","UserNick":"","UserSex":"0","UserTxt":"","UserImg":""}
	mod.storage_tempModel000 = {
		UTID:'',//
		Token:'',
		UserPhone:'',
		UserName:'',
		UserNick:'',
		UserSex:'',
		UserTxt:'',
		UserImg:''
	};

	return mod;

})(mui, storageKeyName || {});