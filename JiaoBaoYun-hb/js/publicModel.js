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
	
	//11.通过用户账号和手机号搜索用户
	mod.model_searchPeople = {
		utid:'',//用户表ID
		uid:'',//用户手机号
		uname:'',//用户名
		unick:'',//用户昵称
		usex:'',//性别
		utxt:'',//签名
		uimg:''//用户头像地址
	}
	
	//16.通过群ID获取群学生
	mod.model_groupStus = {
		gid:'',//群ID
		stuid:'',//学生资料id
		stuname:'',//学生名称
		stuimg:''//学生头像
	}

	return mod;

})(mui, publicModel || {});