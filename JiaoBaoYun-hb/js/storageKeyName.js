//此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {
	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.AUTOLOGIN = 'autoLogin'; //登录信息
	mod.SEHISTORY = 'seHistory'; //科教历史记录

	//---开发---start---
//	mod.MAINEDU = 'http://192.168.0.44:8511/'; //科教图片url
//		mod.MAINURL = 'http://192.168.0.44:8511/api/CloudApi/'; //主url
//		mod.MAINJIAOXIAOURL = 'http://192.168.0.200:8081/JiaoBaoCloudService/'; //家校圈url
//		mod.MAINHOMEWORKURL = 'http://192.168.0.44:8513/'; //作业主url
//		mod.MAINQIUZHI = 'http://192.168.0.200:8081/JiaoBaoCloudService/'; //求知主url
	//---开发---end---

	//---测试---start---
//	mod.MAINEDU = 'http://192.168.0.178:8511/'; //科教图片url
//	mod.MAINURL = 'http://192.168.0.178:8511/api/CloudApi/'; //主url
//	mod.MAINJIAOXIAOURL = 'http://192.168.0.178:8080/JiaoBaoCloudService/'; //家校圈url
//	mod.MAINHOMEWORKURL = 'http://192.168.0.178:8088/'; //作业主url
//	mod.MAINQIUZHI = 'http://192.168.0.178:8080/JiaoBaoCloudService/'; //求知主url
//	//---测试---end---


	//---外网---start---
		mod.MAINEDU = 'http://114.215.222.186:8002/'; //科教图片url
		mod.MAINURL = 'http://114.215.222.186:8002/api/CloudApi/'; //主url
		mod.MAINJIAOXIAOURL = 'http://114.215.222.194:8080/JiaoBaoCloudService/'; //家校圈url
		mod.MAINHOMEWORKURL = 'http://114.215.222.186:8001/'; //作业主url
		mod.MAINQIUZHI = 'http://114.215.222.194:8080/JiaoBaoCloudService/'; //求知主url
	//---外网---end---

	mod.MAINHOMEWORKURLTEACHER = mod.MAINHOMEWORKURL + 'TeacherService.svc/'; //老师作业url
	mod.MAINHOMEWORKURLSTUDENT = mod.MAINHOMEWORKURL + 'StudentService.svc/'; //学生作业url
	mod.WAITING = '加载中...'; //
	mod.UPLOADING = '上传中...';
	mod.SIGNKEY = 'jsy309'; //签名密钥
	//---七牛---start---
	//mod.QNDEFAULTIMAGEDOMAIN = 'http://oixh9lre3.bkt.clouddn.com/'; //存放在七牛的默认图片的域名，公开的

	//七牛存储子空间（文件二级文件名）
	mod.QNPUBSPACE = "pb"; //七牛公开空间
	mod.QNPRISPACE = "pv"; //七牛私有空间
	mod.TEAPICBUCKET = 'TeaAnswersPic/'; //老师临时作业答案存储空间
	mod.TEATHUMBPICBUCKET = 'TeaAnThumbPic/Thumb/'; //老师临时作业答案缩略图存储空间
	mod.STUPICBUCKET = 'StuAnswerPic/'; //学生临时作业答案存储空间
	mod.STUTHUMBPICBUCKET = 'StuAnThumbPic/Thumb/'; //学生临时作业缩略图存储空间
	mod.PERSONALSPACE = 'PersonalSpace/'; //个人空间、原图
	mod.PERSONALSPACETHUMB = 'PersonalSpace/Thumb/'; //个人空间、缩略图
	mod.CLASSSPACE = 'ClassSpace/'; //班级空间、原图
	mod.CLASSSPACETHUMB = 'ClassSpace/Thumb/'; //班级空间、缩略图
	mod.NOTE = 'Note/'; //笔记、原图
	mod.NOTETHUMB = 'Note/Thumb/'; //笔记、缩略图
	mod.RECORD = 'Record/'; //记事、原图
	mod.RECORDTHUMB = 'Record/Thumb/'; //记事、缩略图
	mod.KNOWLEDGE = 'Knowledge/'; //求知、原图
	mod.KNOWLEDGETHUMB = 'Knowledge/Thumb/'; //求知、缩略图
	mod.HEADIMAGE = 'HeadImage/'; //个人头像，资料头像，群头像
	mod.HEADIMAGETHUMB = 'HeadImage/Thumb/'; //个人头像，资料头像，群头像
	mod.CLOUDSTORAGE = 'CloudStorage/'; //云存储的文件
	mod.CLOUDSTORAGETHUMB = 'CloudStorage/Thumb/'; //云存储的文件缩略图

	//---七牛空间和接口---开发---start---
//		mod.QNPB = 'http://qn-kfpb.jiaobaowang.net/'; //公开空间域名
//		mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen';
//		mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
//		mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
//		mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8004/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
//		mod.QNGETTOKENDELETE = 'http://114.215.222.186:8004/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
	//	---七牛空间和接口---开发---end---

	//---七牛空间和接口---测试---start---
//	mod.QNPB = 'http://qn-cspb.jiaobaowang.net/'; //公开空间域名
//	mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen';
//	mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
//	mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
//	mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
//	mod.QNGETTOKENDELETE = 'http://114.215.222.186:8005/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
	//---七牛空间和接口---测试---end---

	//---外网---start---
			mod.QNPB='http://qn-educds. .net/';//公开空间域名
			mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8003/GetTokenProfilePhoto.ashx'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8003/QiuToken.ashx'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8003/GetToken.ashx?geturl='; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8003/BatchDelete.ashx'; //获取批量（或者一个）删除七牛文件的token的url
	//---外网---end---
	//---七牛---end---
	mod.DOCUMENTSPATH = 'DOCUMENTSPATH'; //记录document的地址

	//---默认图片---start---
	mod.DEFAULTPERSONALHEADIMAGE = '../../image/utils/default_personalimage.png'; //默认的个人头像
	mod.DEFAULTSCIEDUIMAGELOAD = '/image/utils/default_load_2.gif'; //科教首页，懒加载显示加载中的图片
	mod.DEFAULTIMAGELOAD = '/image/utils/default_load_2_1.gif'; //压缩后的懒加载默认的图片
	//---默认图片---end---

	//---Activity的code---start---
	mod.CODERECORDVIDEO = 0; //录像
	//---Activity的code---end---

	return mod;

})(storageKeyName || {});