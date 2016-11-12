//本页面存放界面中需要的协议，接口作用、需要传值内容、调用的方法

//本地存储
document.write('<script src="../../js/libs/myStorage/myStorage.js"><\/script>');
document.write('<script src="../../js/storageKeyName.js"><\/script>');
//加密
document.write('<script src="../../js/libs/RSA/Barrett.js"><\/script>');
document.write('<script src="../../js/libs/RSA/BigInt.js"><\/script>');
document.write('<script src="../../js/libs/RSA/RSA.js"><\/script>');
document.write('<script src="../../js/utils/RSAEncrypt.js"><\/script>');
//网络请求
document.write('<script src="../../js/utils/postData.js"><\/script>');
//签名
document.write('<script src="../../js/libs/crypto-js/require.js"><\/script>');
document.write('<script src="../../js/utils/sortSign.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/libs/jquery.js"><\/script>');


var postData=(function(mod){
	//6.用户修改各项用户信息
//调用方法
//var comData = {
//	vtp: 'unick', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件)
//	vvl: '测试修改昵称', //对应的值
//};
//// 等待的对话框
//var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//postData_jiaobaoYunPro_PostReUinf(comData, wd, function(data) {
//	wd.close();
//	console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//	if(data.RspCode == 0) {
//
//	} else {
//		mui.toast(data.RspTxt);
//	}
//});
mod.jiaobaoYunPro={};
mod.jiaobaoYunPro.PostReUinf=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostReUinf', enData, commonData, 1, wd, callback);
}

//7.用户创建群
//	//需要参数
//	var comData = {
//		gname: '测试群名', //群名
//		gimg: 'jjjjjjj', //群头像
//	};
mod.jiaobaoYunPro.PostCrGrp=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostCrGrp', enData, commonData, 1, wd, callback);
}

//8.用户修改群各项信息
//	//需要参数
//	var comData = {
//		vtp: 'gname', //指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名)
//		vvl: '测试修改群名',//要修改成的值
//		rid: '3'//要修改的群id
//	};
mod.jiaobaoYunPro.PostReGinfo=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostReGinfo', enData, commonData, 1, wd, callback);
}

//9.获取用户群
//获取个人信息
//	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//	//需要参数
//	var comData = {
//		vtp: 'cg', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群)
//		vvl: personalUTID, //查询的各项，对应人的utid，可以是查询的任何人
//	};
mod.jiaobaoYunPro.PostGList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostGList', enData, commonData, 1, wd, callback);
}

//10.Token续订(之前有过相同登陆数据的才能续订成功)
//获取个人信息
//		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//		//需要参数
//		var comData = {
//			uuid: plus.device.uuid,
//			utid: personalUTID,
//			appid: plus.runtime.appid
//		};
//修改本地存储中的值，返回值
//window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token = data.RspData;
mod.jiaobaoYunPro.PostTokenRenew=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostTokenRenew', enData, commonData, 0, wd, callback);
}

//11.通过用户账号和手机号搜索用户
//		//需要参数
//		var comData = {
//			vvl: '111111'//查询的值
//		};
//返回值model：model_searchPeople
mod.jiaobaoYunPro.PostUList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostUList', enData, commonData, 1, wd, callback);
}

//12.邀请用户入群
//		//需要参数
//		var comData = {
//			gid: '111111',//群ID
//			beinvutid:'',//被邀请人ID
//			beinvnick:'',//被邀请人昵称
//			invtp:'',//被邀请人类型,0家长,2老师,3学生
//			vtp:''//更改项,0老师邀请家长,1个人申请入群
//		};
mod.jiaobaoYunPro.PostInvGuser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostInvGuser', enData, commonData, 1, wd, callback);
}

//13.通过群ID获取群的正常用户
//		//需要参数
//		var comData = {
//			top: '',//选择条数
//			vvl:'',//群ID，查询的值
//			vvl1:'',//群员类型，0家长,1管理员,2老师,3学生,-1取全部
//			invtp:'',//被邀请人类型,0家长,2老师,3学生
//			vtp:''//更改项,0老师邀请家长,1个人申请入群
//		};
mod.jiaobaoYunPro.PostGusers=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostGusers', enData, commonData, 1, wd, callback);
}

//14.验证Token是否已过期
//获取个人信息
//		var personalToken = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).token;
//		//需要参数
//		var comData = {
//			token: personalToken
//		};
mod.jiaobaoYunPro.PostVerifyToken=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostVerifyToken', enData, commonData, 0, wd, callback);
}

//15.用户添加学生
//		//所需参数
//		var comData = {
//			gid: '',//群ID
//			gname:'',//学生名
//			gimg:''//学生头像
//		};
mod.jiaobaoYunPro.PostGStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostGStu', enData, commonData, 1, wd, callback);
}

//16.通过群ID获取群学生
//所需参数
//		var comData = {
//			top: '',//选择条数,-1为全部
//			vvl:''//群ID,查询的值
//		};
mod.jiaobaoYunPro.PostGStus=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINURL + 'PostGStus', enData, commonData, 1, wd, callback);
}


//家校圈接口


//1.（点到记事）获取用户未读点到记事条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
mod.jiaobaoYunPro.getNoReadNotesCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesCntByUser', enData, commonData, 2, wd, callback);
}

//2.（点到记事）获取用户未读点到记事列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNoReadNotesByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesByUser', enData, commonData, 2, wd, callback);
}

//3.（点到记事）获取用户针对某学生未读点到记事条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			studentId:''//学生ID
//		};
mod.jiaobaoYunPro.getNoReadNotesCntByUserForStudent=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesCntByUserForStudent', enData, commonData, 2, wd, callback);
}

//4.（点到记事）获取用户针对某学生未读点到记事列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			studentId:'',//学生ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNoReadNotesByUserForStudent=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesByUserForStudent', enData, commonData, 2, wd, callback);
}

//5.（点到记事）获取某学生点到记事条数
//所需参数
//		var comData = {
//			studentId: ''//学生ID
//		};
mod.jiaobaoYunPro.getNotesCntByStudent=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesCntByStudent', enData, commonData, 2, wd, callback);
}

//6.（点到记事）获取某学生点到记事列表
//所需参数
//		var comData = {
//			studentId:'',//学生ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNotesByStudent=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesByStudent', enData, commonData, 2, wd, callback);
}

//7.（点到记事）获取某条点到记事信息
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNoteById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/getNoteById', enData, commonData, 2, wd, callback);
}

//8.（点到记事）新增某学生点到记事信息
//所需参数
//		var comData = {
//			studentId: ''//用户ID
//			msgContent: '',//记事内容
//			encType: '',//附件类型,1图片2音视频
//			encAddr: '',//附件地址
//			encImg: '',//附件缩略图地址
//			teacherId: '',//发布教师ID
//			noteType: '',//点到记事类型1点到2记事
//			checkType: ''//点到类型,1 正常2 旷课3 迟到4 早退5 其他
//		};
mod.jiaobaoYunPro.addNote=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/addNote', enData, commonData, 2, wd, callback);
}

//9.（点到记事）推送给某用户的某点到记事
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			noteId:''//点到记事ID
//		};
mod.jiaobaoYunPro.addNoteForUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/addNoteForUser', enData, commonData, 2, wd, callback);
}

//10.（点到记事）修改某用户某点到记事阅读状态为已读
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			noteId:''//点到记事ID
//		};
mod.jiaobaoYunPro.setNoteReadByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/setNoteReadByUser', enData, commonData, 2, wd, callback);
}

//11.（点到记事）屏蔽某学生某点到记事信息
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
function postData_jiaobaoYunPro_setOffNoteById(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/setOffNoteById', enData, commonData, 2, wd, callback);
}

//12.（点到记事）删除某点到记事
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
mod.jiaobaoYunPro.delNoteById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'note/delNoteById', enData, commonData, 2, wd, callback);
}

//13.（班级空间）获取用户未读班级空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
mod.jiaobaoYunPro.getNoReadClassSpacesCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesCntByUser', enData, commonData, 2, wd, callback);
}

//14.（班级空间）获取用户未读班级空间列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
mod.jiaobaoYunPro.getNoReadClassSpacesByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesByUser', enData, commonData, 2, wd, callback);
}

//15.（班级空间）获取用户未读某班级空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			classId:''//班级ID
//		};
mod.jiaobaoYunPro.getNoReadClassSpacesCntByUserForClass=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesCntByUserForClass', enData, commonData, 2, wd, callback);
}

//16.（班级空间）获取用户未读某班级空间列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			classId:'',//班级ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
mod.jiaobaoYunPro.getNoReadClassSpacesByUserForClass=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesByUserForClass', enData, commonData, 2, wd, callback);
}

//17.（班级空间）获取某班级空间条数
//所需参数
//		var comData = {
//			classId: ''//班级ID
//		};
mod.jiaobaoYunPro.getClassSpacesCntByClass=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesCntByClass', enData, commonData, 2, wd, callback);
}

//18.（班级空间）获取某班级空间列表
//所需参数
//		var comData = {
//			classId:'',//班级ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
mod.jiaobaoYunPro.getClassSpacesByClass=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesByClass', enData, commonData, 2, wd, callback);
}

//19.（班级空间）获取某条班级空间信息
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//返回model：model_userNoteInfo
mod.jiaobaoYunPro.getClassSpaceById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpaceById', enData, commonData, 2, wd, callback);
}

//20.（班级空间）新增某班级空间信息
//所需参数
//		var comData = {
//			classId: '',//班级ID
//			msgContent: '',//记事内容
//			encType: '',//附件类型,1图片2音视频
//			encAddr: '',//附件地址
//			encImg: '',//附件缩略图地址
//			teacherId: ''//发布教师ID
//		};
mod.jiaobaoYunPro.addClassSpace=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/addClassSpace', enData, commonData, 2, wd, callback);
}

//21.（班级空间）推送给某用户的某班级空间
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			classSpaceId:''//班级空间ID
//		};
mod.jiaobaoYunPro.addClassSpaceForUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/addClassSpaceForUser', enData, commonData, 2, wd, callback);
}

//22.（班级空间）修改某用户某班级空间阅读状态为已读
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			classSpaceId:''//班级空间ID
//		};
mod.jiaobaoYunPro.setClassSpaceReadByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/setClassSpaceReadByUser', enData, commonData, 2, wd, callback);
}

//23.（班级空间）屏蔽某班级空间信息
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
mod.jiaobaoYunPro.setOffClassSpaceById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/setOffClassSpaceById', enData, commonData, 2, wd, callback);
}

//24.（班级空间）删除某班级空间
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
mod.jiaobaoYunPro.delClassSpaceById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'classSpace/delClassSpaceById', enData, commonData, 2, wd, callback);
}

//25.（用户空间）获取用户未读用户空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
mod.jiaobaoYunPro.getNoReadUserSpacesCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesCntByUser', enData, commonData, 2, wd, callback);
}

//26.（用户空间）获取用户未读用户空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNoReadUserSpacesByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesByUser', enData, commonData, 2, wd, callback);
}

//27.（用户空间）获取用户未读某用户空间条数
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherId:''//发布用户ID
//		};
mod.jiaobaoYunPro.getNoReadUserSpacesCntByUserForPublisher=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesCntByUserForPublisher', enData, commonData, 2, wd, callback);
}

//28.（用户空间）获取用户未读某用户空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherId:'',//发布用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
mod.jiaobaoYunPro.getNoReadUserSpacesByUserForPublisher=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesByUserForPublisher', enData, commonData, 2, wd, callback);
}

//29.（用户空间）获取用户某条用户空间是否点赞
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			publisherId:''//发布用户ID
//		};
//data:非0为已点赞
mod.jiaobaoYunPro.getIsLikeUserSpaceByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getIsLikeUserSpaceByUser', enData, commonData, 2, wd, callback);
}

//30.（用户空间）获取用户空间所有评论条数
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
mod.jiaobaoYunPro.getUserSpaceCommentsCntById-=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentsCntById', enData, commonData, 2, wd, callback);
}

//31.（用户空间）获取用户空间所有评论
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userSpaceInfo
mod.jiaobaoYunPro.getUserSpaceCommentsById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentsById', enData, commonData, 2, wd, callback);
}

//32.（用户空间）获取用户空间所有点赞用户
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//返回值：数组、UserId--用户ID
mod.jiaobaoYunPro.getIsLikeUsersById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getIsLikeUsersById', enData, commonData, 2, wd, callback);
}

//33.（用户空间）获取用户用户空间所有未读评论回复条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
mod.jiaobaoYunPro.getUserSpaceCommentReplysCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentReplysCntByUser', enData, commonData, 2, wd, callback);
}

//34.（用户空间）获取用户用户空间所有未读评论回复列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
mod.jiaobaoYunPro.getUserSpaceCommentReplysByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentReplysByUser', enData, commonData, 2, wd, callback);
}

//35.（用户空间）获取某用户空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
mod.jiaobaoYunPro.getUserSpacesCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesCntByUser', enData, commonData, 2, wd, callback);
}

//36.（用户空间）获取某用户空间列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
mod.jiaobaoYunPro.getUserSpacesByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesByUser', enData, commonData, 2, wd, callback);
}

//37.（用户空间）获取某条用户空间信息
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
mod.jiaobaoYunPro.getUserSpaceByIdr=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceById', enData, commonData, 2, wd, callback);
}

//38.（用户空间）新增某用户空间信息
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			msgContent:'',//记事内容
//			encType:''//附件类型，1图片2音视频
//			encAddr:'',//附件地址
//			encImg:''//附件缩略图地址
//			encIntro:'',//附件简介
//		};
mod.jiaobaoYunPro.addUserSpace=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpace', enData, commonData, 2, wd, callback);
}

//39.（用户空间）推送给某用户的某用户空间
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			userSpaceId:'',//用户空间ID
//		};
mod.jiaobaoYunPro.addUserSpaceForUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceForUser', enData, commonData, 2, wd, callback);
}

//40.（用户空间）新增某用户某用户空间评论
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			userSpaceId:'',//用户空间ID
//			commentContent:''//评论内容
//		};
mod.jiaobaoYunPro.addUserSpaceComment=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceComment', enData, commonData, 2, wd, callback);
}

//41.（用户空间）新增某用户某用户空间评论回复
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			upperId:'',//上级评论ID
//			replyUserId:''//回复ID
//			userSpaceId:'',//用户空间ID
//			commentContent:''//回复内容
//		};
mod.jiaobaoYunPro.addUserSpaceCommentReply=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceCommentReply', enData, commonData, 2, wd, callback);
}

//42.（用户空间）修改某用户某用户空间阅读状态为已读
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			userSpaceId:'',//用户空间ID
//		};
mod.jiaobaoYunPro.setUserSpaceReadByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceReadByUser', enData, commonData, 2, wd, callback);
}

//43.（用户空间）修改某用户某用户空间点赞状态为点赞
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			userSpaceId:'',//用户空间ID
//		};
mod.jiaobaoYunPro.setUserSpaceLikeByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceLikeByUser', enData, commonData, 2, wd, callback);
}

//44.（用户空间）修改某用户空间评论回复查看状态
//所需参数
//		var comData = {
//			userSpaceCommentId: ''//用户空间评论ID
//		};
mod.jiaobaoYunPro.setUserSpaceCommentReplyById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceCommentReplyById', enData, commonData, 2, wd, callback);
}

//45.（用户空间）屏蔽某用户空间信息
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
mod.jiaobaoYunPro.setOffUserSpaceById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setOffUserSpaceById', enData, commonData, 2, wd, callback);
}

//46.（用户空间）删除某用户空间
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
mod.jiaobaoYunPro.delUserSpaceById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceById', enData, commonData, 2, wd, callback);
}

//47.（用户空间）删除某条用户空间评论
//所需参数
//		var comData = {
//			userSpaceCommentId: ''//用户空间评论ID
//		};
mod.jiaobaoYunPro.delUserSpaceCommentById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceCommentById', enData, commonData, 2, wd, callback);
}

//48.（用户空间）获取用户空间所有留言条数
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
mod.jiaobaoYunPro.getUserSpaceMsgsCntById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgsCntById', enData, commonData, 2, wd, callback);
}

//49.（用户空间）获取用户空间所有留言
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
mod.jiaobaoYunPro.getUserSpaceMsgsById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgsById', enData, commonData, 2, wd, callback);
}

//50.（用户空间）获取用户用户空间所有未读留言回复条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//返回：未读回复条数
mod.jiaobaoYunPro.getUserSpaceMsgReplysCntByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgReplysCntByUser', enData, commonData, 2, wd, callback);
}

//51.（用户空间）获取用户用户空间所有未读留言回复列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
mod.jiaobaoYunPro.getUserSpaceMsgReplysByUser=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgReplysByUser', enData, commonData, 2, wd, callback);
}

//52.（用户空间）新增某用户某用户空间留言
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			userSpaceId:'',//用户空间ID
//			msgContent:''//留言内容
//		};
mod.jiaobaoYunPro.addUserSpaceMsg=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceMsg', enData, commonData, 2, wd, callback);
}

//53.（用户空间）新增某用户某用户空间留言回复
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			upperId:'',//上级留言ID
//			replyUserId:''//回复ID
//			userSpaceId:'',//用户空间ID
//			msgContent:''//回复内容
//		};
mod.jiaobaoYunPro.addUserSpaceMsgReply=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceMsgReply', enData, commonData, 2, wd, callback);
}

//54.（用户空间）修改某用户空间留言回复查看状态
//所需参数
//		var comData = {
//			userSpaceMsgId: ''//用户空间留言ID
//		};
mod.jiaobaoYunPro.setUserSpaceMsgReplyById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceMsgReplyById', enData, commonData, 2, wd, callback);
}

//55.（用户空间）删除某条用户空间留言
//所需参数
//		var comData = {
//			userSpaceMsgId: ''//用户空间留言ID
//		};
mod.jiaobaoYunPro.delUserSpaceMsgById=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceMsgById', enData, commonData, 2, wd, callback);
}

//56.（用户空间）获取与我相关
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceAboutMe
mod.jiaobaoYunPro.getAboutMe=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getAboutMe', enData, commonData, 2, wd, callback);
	}
return mod;
})(postData||{})
