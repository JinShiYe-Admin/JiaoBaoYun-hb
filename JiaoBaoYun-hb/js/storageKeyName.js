//此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.AUTOLOGIN = 'autoLogin'; //登录信息
//	mod.MAINURL = 'http://192.168.0.44:8511/api/CloudApi/'; //主url
		mod.MAINURL = 'http://192.168.0.178:8511/api/CloudApi/';//主url
//	mod.MAINJIAOXIAOURL = 'http://192.168.0.100:8081/JiaoBaoCloudService/'; //家校圈url
		mod.MAINJIAOXIAOURL = 'http://192.168.0.178:8080/JiaoBaoCloudService/';//家校圈url
	mod.MAINHOMEWORKURL = 'http://192.168.0.211:802/' //作业主url
	mod.MAINHOMEWORKURLTEACHER = mod.MAINHOMEWORKURL + 'TeacherService.svc/'; //老师作业url
	mod.MAINHOMEWORKURLSTUDENT = mod.MAINHOMEWORKURL + 'StudentService.svc/'; //学生作业url
	mod.WAITING = '加载中...'; //加载提示
	mod.SIGNKEY = 'jsy309'; //签名密钥
	mod.QNFILEDOMAIN = 'http://oigrn7z7d.bkt.clouddn.com/'; //存放在七牛的文件（云存储的文件）的域名，私有的,jiaobaoyun-file
	mod.QNFILEIMGEDOMAIN = 'http://oigrmug2o.bkt.clouddn.com/'; //存放在七牛的文件（云存储的图片，视频文件）的缩略图域名，公开的,jiaobaoyun-filethumbnail
	mod.QNHEADIMGEDOMAIN = 'http://oigr7qsvz.bkt.clouddn.com/'; //存放在七牛的个人头像，群头像，资料头像的域名，公开的，jiaobaoyun-headimage
	mod.QNGETUPTOKENHEADIMGE = 'http://192.168.0.178:8517/GetTokenProfilePhoto.ashx'; //获取上传个人头像，群头像，资料头像到七牛的token的url
	mod.QNGETUPTOKENFILE = 'http://192.168.0.178:8517/QiuToken.ashx'; //获取上传文件（云存储）到七牛的token的url
	mod.QNGETDOWNTOKENFILE = 'http://192.168.0.178:8517/GetToken.ashx?geturl='; //获取下载文件（云存储）的token的url，url+七牛文件url
	mod.QNGETTOKENDELETE = 'http://192.168.0.178:8517/BatchDelete.ashx'; //获取批量（或者一个）删除七牛文件的token的url
	mod.DOCUMENTSPATH = 'DOCUMENTSPATH'; //记录document的地址
	return mod;

})(storageKeyName || {});