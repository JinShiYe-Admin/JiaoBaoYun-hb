//本页面存放界面中需要的协议，接口作用、需要传值内容、调用的方法---作业模块

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
//document.write('<script src="../../js/utils/sortSign.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/libs/jquery.js"><\/script>');


//--------------------------------------------教师---------------------------------------------


//1.获取教师所属班级列表；逻辑：获取有效的、未毕业的、教师Id在群中的角色是老师的群列表；
//所需参数
//		var comData = {
//			teacherId: ''//教师Id
//		};
var postDataPro_GetClassList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetClassList', enData, commonData, 2, wd, callback);
}


//2.获取教师发布作业列表,逻辑：获取当前教师在当前班级的作业列表，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			pageIndex: ''//当前页码，默认1；
//		};
var postDataPro_GetHomeworkList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomeworkList', enData, commonData, 2, wd, callback);
}


//3.获取教师发布作业详情；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomework', enData, commonData, 2, wd, callback);
}


//4.	获取作业对应学生列表
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetStudentList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetStudentList', enData, commonData, 2, wd, callback);
}


//5.	获取学生上传答案列表
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			date:''//查看的日期，不带时间；
//		};
var postDataPro_GetAnswerResultList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetAnswerResultList', enData, commonData, 2, wd, callback);
}


//6.	 获取学生上传作业详情
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			StudentId: '',//学生Id；
//			classId:'',//班级群Id；
//			classId:''//作业id；
//		};
var postDataPro_GetHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomeworkResult', enData, commonData, 2, wd, callback);
}


//7.	 获取学生上传答案详情
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			StudentId: '',//学生Id；
//			classId:'',//班级群Id；
//			answerResultId:''//作业id；
//		};
var postDataPro_GetAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetAnswerResult', enData, commonData, 2, wd, callback);
}


//8.	 获取老师上传答案详情,逻辑：根据学生上传答案匹配出来的老师答案，不仅限于当前老师上传的答案；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			answerResultId:''//学生上传答案id；
//		};
var postDataPro_GetAnswer=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetAnswer', enData, commonData, 2, wd, callback);
}


//9.	评价学生上传作业
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			studentId: '',//学生Id；
//			classId:'',//班级群Id；
//			homeworkId:'',//作业id；
//			comment:''//评价
//		};
//返回值：{“r”：true}
var postDataPro_CommentHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'CommentHomeworkResult', enData, commonData, 2, wd, callback);
}


//10.评价学生上传答案
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			studentId: '',//学生Id；
//			classId:'',//班级群Id；
//			homeworkId:'',//作业id；
//			comment:''//评价
//		};
//返回值：{“r”：true}
var postDataPro_CommentAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'CommentAnswerResult', enData, commonData, 2, wd, callback);
}

//11.作业提交提醒
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			homeworkId:''//作业id；
//		};
//{“r”：true}
var postDataPro_HomeworkAlert=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'HomeworkAlert', enData, commonData, 2, wd, callback);
}


//12.上传文件；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			fileType: '',//文件类型，1：图片；2：音频；3：视频；
//			filename: '',//文件名，带后缀；
//			fileStream:''//文件流；
//		};
var postDataPro_UploadFile=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'UploadFile', enData, commonData, 2, wd, callback);
}


//13.发布作业,逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			subjectId: '',//科目Id， 见（一）.1. GetSubjectList()；
//			classeIds: '',//班级群Id数组；
//			content: '',//作业内容
//			submitOnLine: '',//是否需要在线提交；
//			fileIds:''//上传文件的id数组；
//		};
//返回值：{“HomeworkId”：22   //0:保存失败 ，>0：保存成功        }
var postDataPro_PublishHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'PublishHomework', enData, commonData, 2, wd, callback);
}


//14.修改作业，逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkId: '',//要修改的作业id；
//			subjectId: '',//科目Id， 见（一）.1. GetSubjectList()；
//			classeIds: '',//班级群Id数组；
//			content: '',//作业内容
//			submitOnLine: '',//是否需要在线提交；
//			fileIds:''//上传文件的id数组；
//		};
//{“r”：true       }
var postDataPro_ModifyHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyHomework', enData, commonData, 2, wd, callback);
}


//15.发布答案,只能上传图片；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			subjectId: '',//科目Id， 见（一）.1. GetSubjectList()；
//			fileIds:''//上传文件的id数组；
//		};
//{“AnswerId”：22   //0:保存失败 ，>0：保存成功        }
var postDataPro_PublishAnswer=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'PublishAnswer', enData, commonData, 2, wd, callback);
}


//16.修改作业评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkResultId: '',//要修改的作业评价id；
//			studentId: '',//学生Id；
//			classId: '',//班级群Id；
//			homeworkId: '',//作业id；
//			comment:''//评价；
//		};
//{“r”：true}
var postDataPro_ModifyHomeworkResultComment=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyHomeworkResultComment', enData, commonData, 2, wd, callback);
}


//17.修改答案评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			answerResultId: '',//要修改的答案评价的id；
//			studentId: '',//学生Id；
//			classId: '',//班级群Id；
//			homeworkId: '',//作业id；
//			comment:''//评价；
//		};
//{“r”：true}
var postDataPro_ModifyAnswerResultComment=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyAnswerResultComment', enData, commonData, 2, wd, callback);
}


//18.获取所有科目列表
//所需参数
//		var comData = {
//		};
var postDataPro_GetSubjectList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetSubjectList', enData, commonData, 2, wd, callback);
}

//19.修改提醒查看信息；逻辑：不保存是谁看的，保留最后查看时间；
//所需参数
//		var comData = {
//			homeworkId:'',//作业Id；
//			checkTime:''//查看提醒时间；
//		};
//{“r”:true}
var postDataPro_ModifyAlertCheck=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyAlertCheck', enData, commonData, 2, wd, callback);
}


//-------------------------------------------------------------学生、家长-----------------------------------------------------------


//1.	获取学生列表，逻辑：获取有效的、未毕业的、家长Id在群中的角色是家长，且在这个群中有角色为学生的用户将家长账号关联到当前家长id的群列表；
//所需参数
//		var comData = {
//			parentId:''//家长Id
//		};
var postDataPro_GetChildrenList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetChildrenList', enData, commonData, 2, wd, callback);
}


//2.	获取班级；逻辑：获取有效的、未毕业的、学生Id在群中的角色是学生的群列表；
//所需参数
//		var comData = {
//			studentId:''//学生Id；
//		};
var postDataPro_GetClassList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetClassList', enData, commonData, 2, wd, callback);
}


//3.	获取学生作业列表，逻辑：获取当前学生在当前班级的作业列表，默认近1周数据，每次多加载1
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			pageIndex:''//当前页码，默认1；
//		};
var postDataPro_GetHomeworkList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomeworkList', enData, commonData, 2, wd, callback);
}


//4.	获取教师发布作业详情，不包括学生提交的答案；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomework', enData, commonData, 2, wd, callback);
}


//5.	获取作业结果；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomeworkResult', enData, commonData, 2, wd, callback);
}


//6.	获取答案结果
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级Id；
//			answerResultId:''//答案结果id；
//		};
var postDataPro_GetAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetAnswerResult', enData, commonData, 2, wd, callback);
}

//7.	上传文件；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长Id；
//			fileType: '',//文件类型，1：图片；2：音频；3：视频；
//			filename: '',//文件名，带后缀；
//			fileStream:''//文件流；
//		};
var postDataPro_UploadFile=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'UploadFile', enData, commonData, 2, wd, callback);
}


//8.	提交答案结果
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			fileIds: '',//文件id数组；
//			teacherId: '',//老师Id；
//			teacherName:''//老师名字；
//		};
//{“AnswerResultId”：3}
var postDataPro_SubmitAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'SubmitAnswerResult', enData, commonData, 2, wd, callback);
}


//9.	提交作业结果；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			homeworkId: '',//作业id；
//			content: '',//文本答案；
//			fileIds:''//文件id数组；
//		};
//{“HomeworkResultId”：3}
var postDataPro_SubmitHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'SubmitHomeworkResult', enData, commonData, 2, wd, callback);
}


//10.修改答案结果；
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			answerResultId: '',//要修改的答案id；
//			fileIds: '',//文件id数组；
//			teacherId: '',//老师Id；
//			teacherName:''//老师名字；
//		};
//{“r”：true}
var postDataPro_ModifyAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyAnswerResult', enData, commonData, 2, wd, callback);
}


//11.修改作业结果；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			homeworkResultId: '',//要修改的作业结果id；
//			content: '',//文本答案；
//			fileIds:''//文件id数组；
//		};
//{“r”：true}
var postDataPro_ModifyHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'ModifyHomeworkResult', enData, commonData, 2, wd, callback);
}


//12.获取老师上传答案详情；逻辑：根据学生上传答案匹配出来的老师答案，不仅限于当前老师上传的答案；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			answerResultId:''//学生上传答案id；
//		};
var postDataPro_GetAnswer=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetAnswer', enData, commonData, 2, wd, callback);
}


//13.获取错题列表；
//所需参数
//		var comData = {
//			studentId:''//学生Id；
//		};
var postDataPro_GetErrorList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetErrorList', enData, commonData, 2, wd, callback);
}


//14.获取错题详情；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			errorId:''//错题id；
//		};
var postDataPro_GetError=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetError', enData, commonData, 2, wd, callback);
}


//15.获取作业记录；逻辑：不区分班级，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			studentId:''//学生Id
//		};
var postDataPro_GetHomeworkRecord=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURL + 'GetHomeworkRecord', enData, commonData, 2, wd, callback);
}