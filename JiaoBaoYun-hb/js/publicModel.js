//此js用于保存网络请求后，返回的model


var publicModel = (function($, mod) {
	//握手后，返回公钥
	mod.model_ShakeHand = {
		Exponent:'',//公钥模式
		Modulus:''//公钥值
	};
	
	//注册后，或者登录后，返回用户的信息
	mod.model_personalInfo = {
		utid:'',//用户表ID
		uimg:'',//用户头像地址
		unick:'',//用户昵称
		usex:'',//用户性别
		utxt:'',//用户签名
		token:''//用户令牌
	};
	
	//

	return mod;

})(mui, publicModel || {});