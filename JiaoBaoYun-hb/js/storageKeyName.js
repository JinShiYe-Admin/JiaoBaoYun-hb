//此js用于保存本地存储时，用到的key值


var storageKeyName = (function($, mod) {
	mod.storage_personalInfo = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.storage_ShakeHand = 'ShakeHand'; //公钥，登录时，返回的握手信息，
//	{"UTID":"2","Token":"5zZFcClE0zBJlQlSwBGD8hhghAM=","UserPhone":"111111","UserName":"test70C72521-2CD6-45DD-AF6E-375654EB734A","UserNick":"","UserSex":"0","UserTxt":"","UserImg":""}
	mod.storage_tempModel000 = {
		UTID:'',
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