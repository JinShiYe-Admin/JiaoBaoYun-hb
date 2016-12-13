var personalUTID ;
var role;
mui.init({
	//手势事件配置
	gestureConfig: {
		longtap: true //长按事件 可监听
	}
})
mui.plusReady(function() {
	mui.previewImage();
	personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	window.addEventListener('roleInfo',function(e){
		console.log('上传答案||作业界面获取的上级页面传过来的信息：'+JSON.stringify(e.detail));
		var data=e.detail.data;
		role=data.role;
		var studentClasses=data.studentClasses;
		setCondition(role,studentClasses);
	})
	
	/**
	 * 通过系统相机获取图片
	 * 并显示在界面上
	 */
	events.addTap('getAnswer', function() {
			var pictures = document.getElementById('pictures');
			camera.getPic(camera.getCamera(), function(picPath) {
				var div = document.createElement('div');
				div.className = 'img-div';
				div.innerHTML = '<img src="' + picPath + '" data-preview-src="" data-preview-group="1"/>' +
					'<a class="mui-icon iconfont icon-guanbi"></a>'
				pictures.appendChild(div);
			})
	})
	//图片长按事件
	mui('#pictures').on('longtap', '.img-div', function() {
			mui.each(document.querySelectorAll('.icon-guanbi'), function(index, item) {
				//显示图标
				item.style.display = 'block';
			})
		})
		//删除图标的点击事件
	mui('#pictures').on('tap', '.icon-guanbi', function() {
			//删除图片
			pictures.removeChild(this.parentElement)
				//获取路径
			var path = this.parentElement.querySelector('img').src;
			//在数组中删除图片路径
			camera.filePaths.splice(camera.filePaths.indexOf(path));
		})
		//上传路径
	var server = "http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
	//上传按钮点击事件
	events.addTap('post-imgs', function() {
		if(camera.filePaths.length > 0) {
			//						load.createUpload(server, camera.filePaths);

			//判断当前显示的是老师身份0，还是家长、学生身份1
			if(identityFlag == 0) {
				//14.发布答案,只能上传图片；
				//所需参数
				var comData = {
					teacherId: personalUTID, //教师Id
					subjectId: selectSubjectID, //科目Id， 见（一）.17. GetSubjectList()；
					fileIds: '' //上传文件的id串，例如“1,2”；
				};
				requestPublishAnswer(comData);
			} else {
				//判断是要学生提交答案0，还是修改答案1
				if(uploadFalg == 0) {
					//6.	提交答案结果
					//所需参数
					var comData = {
						userId: personalUTID, //学生/家长id，
						classId: uploadTeacherModel.gid, //班级id
						studentId: personalUTID, //学生Id；
						fileIds: '', //文件id数组；
						teacherId: uploadTeacherModel.stuid, //老师Id；
						teacherName: uploadTeacherModel.stuname //老师名字；
					};
					requestSubmitAnswer(comData);
				} else {
					//8.修改答案结果；
					//所需参数
					var comData = {
						userId: personalUTID, //学生/家长id，
						studentId: personalUTID, //学生Id；
						answerResultId: '', //要修改的答案id；
						fileIds: '', //文件id数组；
						teacherId: uploadTeacherModel.stuid, //老师Id；
						teacherName: uploadTeacherModel.stuname //老师名字；
					};
					requestModifyAnswer(comData);
				}
			}
		} else {
			mui.toast('请拍照后上传');
		}
	})
})
/**
 * 设置界面
 * @param {Object} role
 */
var setCondition=function(role,stuClasses){
	var btn_post=document.getElementById('post-imgs');
	var title=document.getElementById('title');
	if(role==2){
		document.querySelector('.subjects-container').style.display='block';
		document.querySelector('.teachers-container').style.display='none';
		btn_post.innerText='上传答案';
		title.innerText='上传答案';
		requestSubjectList();
	}else{
		document.querySelector('.subjects-container').style.display='none';
		document.querySelector('.teachers-container').style.display='block';
		btn_post.innerText='上传作业';
		title.innerText='上传作业';
		//循环遍历老师数组，将群和老师身份的拼接
		requestClassTeacherInfo(stuClasses);
	}
}

//个人id

//科目数组
var subjectArray = [];
//选择的科目id
var selectSubjectID = 0;
//判断当前显示的是老师身份0，还是家长、学生身份1
var identityFlag = 0;
//判断是要学生提交答案0，还是修改答案1
var uploadFalg = 0;
//将主界面的老师数组传到此界面
var teacherArray = [];
//学生身份时，选择要发送答案给老师的model
var uploadTeacherModel;

//17.获取所有科目列表
function requestSubjectList() {
	//所需参数
	var comData = {};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//17.获取所有科目列表
	postDataPro_GetSubjectList(comData, wd, function(data) {
		wd.close();
		console.log('上传作业||答案界面获取的科目列表：'+JSON.stringify(data));
		if(data.RspCode == 0) {
			//给科目数组赋值
			subjectArray = data.RspData.List;
			var subjects=document.getElementById('publish-subjects');
			//清空数据
			events.clearChild(subjects);
			//加载选项
			subjectArray.forEach(function(subject,i){
				var op=document.createElement('option');
				op.value=subject.Value;
				op.innerText=subject.Text;
				subjects.appendChild(op);
			})
			//给选择的科目id取第一个值
			selectSubjectID = subjectArray[0].Value;
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//循环遍历老师数组，将群和老师身份的拼接
function requestClassTeacherInfo(stuClasses) {
	//学生身份时，存储班级里的老师数组
	var classTeacherArray = [];
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	for(var i in stuClasses) {
//		var tempModel = stuClasses[i];
		//所需参数
		var comData = {
			vtp: '0', //获取类型,0普通资料获取,1邀请排除(主老师用)
			top: '-1', //选择条数,-1为全部
			vvl: stuClasses[i].gid, //群ID,查询的值
			vvl1: '2' //类型,0家长,1管理员,2老师,3学生,-1全部
		};
		//16.通过群ID获取群对象资料【model_groupStus】
		postDataPro_PostGUInf(comData, wd, function(data) {
			console.log('上传答案||作业界面获取的资料数据：'+JSON.stringify(data))
			wd.close();
			if(data.RspCode == 0) {
				var tempArray = data.RspData; //[{"stuid":19,"gid":14,"stuname":"10群学1","stuimg":"","mstype":3}]
				//循环得到的资料数组，
				for(var m in tempArray) {
					//找到当前的老师
					if(tempArray[m].mstype == 1 ||tempArray[m].mstype == 2) {
						//将班级信息，添加到老师model
						for(var n in stuClasses) {
							//群号相同
							if(tempArray[m].gid == stuClasses[n].gid) {
								//将群名添加到群资料model中
								tempArray[m].gname = stuClasses[n].gname;
								if(classTeacherArray.indexOf(tempArray[m])<0){
									//添加到数组中
									classTeacherArray.push(tempArray[m]);
								}
								break;
							}
						}
					}
				}
				setTeachers(classTeacherArray);
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}
}
var setTeachers=function(teaInfos){
	var teaContainer=document.getElementById('receive-teachers');
	events.clearChild(teaContainer);
	teaInfos.forEach(function(teaInfo,i){
		var op=document.createElement('option');
		op.teaInfo=teaInfo;
		op.innerText=teaInfo.stuname+'-'+teaInfo.gname;
		teaContainer.appendChild(op);
	})
//	for(var i in teaInfos){
//		
//	}
}

//所需参数
//				var comData = {
//					teacherId: personalUTID, //教师Id，如果为学生，userId: personalUTID,
//					fileType: '1', //文件类型，1：图片；2：音频；3：视频；
//					filename: '', //文件名，带后缀；
//					fileStream: '', //base64格式文件流；
//					displayOrder: '' //图片顺序；
//				};

//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
function requestUploadFileTeacher(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadFile(comData, wd, function(data) {
		wd.close();
		console.log('11.postDataPro_UploadFile:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//						“FileId”：1，       //文件id
			//						“FileName”：”xxx.png”,       //文件名
			//						“FileType”：1,       //文件类型
			//						“Url”：“xxx/xxx.png”       //文件url
			//						“ThumbUrl”：”xxxxxxxx/xxx.png”，    //缩略图url
			//						“DisplayOrder”：1                //显示顺序
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//所需参数
//				var comData = {
//					userId: personalUTID, //学生ID
//					fileType: '1', //文件类型，1：图片；2：音频；3：视频；
//					filename: '', //文件名，带后缀；
//					fileStream: '', //base64格式文件流；
//					displayOrder: '' //图片顺序；
//				};

//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图，学生
function requestUploadFileStudent(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadFileStu(comData, wd, function(data) {
		wd.close();
		console.log('5.postDataPro_UploadFileStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//						“FileId”：1，       //文件id
			//						“FileName”：”xxx.png”,       //文件名
			//						“FileType”：1,       //文件类型
			//						“Url”：“xxx/xxx.png”       //文件url
			//						“ThumbUrl”：”xxxxxxxx/xxx.png”，    //缩略图url
			//						“DisplayOrder”：1                //显示顺序
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//14.发布答案,只能上传图片；老师
function requestPublishAnswer(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//14.发布答案,只能上传图片；
	postDataPro_PublishAnswer(comData, wd, function(data) {
		wd.close();
		console.log('14.postDataPro_PublishAnswer:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {

		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//6.	提交答案结果，学生
function requestSubmitAnswer(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//6.	提交答案结果
	postDataPro_SubmitAnswerResult(comData, wd, function(data) {
		wd.close();
		console.log('6.postDataPro_SubmitAnswerResult:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {

		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//8.修改答案结果；学生
function requestModifyAnswer(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//8.修改答案结果；
	postDataPro_ModifyAnswerResult(comData, wd, function(data) {
		wd.close();
		console.log('8.postDataPro_ModifyAnswerResult:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {

		} else {
			mui.toast(data.RspTxt);
		}
	});
}