//此js用于保存本地存储时，用到的key值


var storageKeyName = (function($, mod) {
	mod.storage_personalInfo = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.storage_ShakeHand = 'ShakeHand'; //公钥，登录时，返回的握手信息，

	return mod;

})(mui, storageKeyName || {});