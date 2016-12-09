//此js用于保存本地存储时，用到的key值


var storageKeyName = (function(mod) {
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.AUTOLOGIN = 'autoLogin'; //登录信息
//	mod.MAINURL = 'http://192.168.0.44:8511/api/CloudApi/';//主url
	mod.MAINURL = 'http://192.168.0.178:8511/api/CloudApi/';//主url
//	mod.MAINJIAOXIAOURL = 'http://192.168.0.100:8081/JiaoBaoCloudService/';//家校圈url
	mod.MAINJIAOXIAOURL = 'http://192.168.0.178:8080/JiaoBaoCloudService/';//家校圈url
	mod.MAINHOMEWORKURLTEACHER = 'http://192.168.0.207:802/TeacherService.svc/';//老师作业url
	mod.MAINHOMEWORKURLSTUDENT = 'http://192.168.0.207:802/StudentService.svc/';//学生作业url
	mod.WAITING = '加载中...';//加载提示
	mod.SIGNKEY = 'jsy309';//签名密钥
	return mod;

})(storageKeyName || {});
