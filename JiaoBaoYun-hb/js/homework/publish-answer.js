var personalUTID; //个人id
var role; //角色
var imgIds; //图片数据
var stuSubmitAnswer; //true学生提交答案||FALSE学生修改答案
var answerResultId; //学生答案id
mui.init();
mui.plusReady(function() {
		events.preload('homework-commented.html', 200);
		mui.previewImage();
		personalUTID = parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid);
		window.addEventListener('roleInfo', function(e) {
			imgIds = [];
			document.getElementById('checkResult').style.display = 'none'
			console.log('上传答案||作业界面获取的上级页面传过来的信息：' + JSON.stringify(e.detail));
			var data = e.detail.data;
			role = data.role;
			var studentClasses = data.studentClasses;
			setCondition(role, studentClasses);
		})

		/**
		 * 通过系统相机获取图片
		 * 并显示在界面上
		 */
		events.addTap('getAnswer', function() {
			//				camera.getPic(camera.getCamera(), function(picPath) {
			//					files.getFileByPath(picPath, function(fileStream) {
			//						uploadFile(picPath, fileStream);
			//					})
			//
			//				})
			gallery.getSinglePic(function(picPath) {
				files.getFileByPath(picPath, function(fileStream) {
					uploadFile(picPath, fileStream);
				});
			});
		});
		events.addTap('checkResult', function() {
				events.fireToPageWithData('homework-commented.html', 'checkResult', answerResultId);
			})
			//删除图标的点击事件
		mui('#pictures').on('tap', '.icon-guanbi', function() {
				imgIds.splice(imgIds.indexOf(this.parentElement.imgId), 1);
				//删除图片
				pictures.removeChild(this.parentElement)
			})
			//上传路径
		var server = "http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
		//上传按钮点击事件
		events.addTap('post-imgs', function() {

			if(imgIds.length > 0) {
				//选择的科目id
				var selectSubjectID = jQuery('#publish-subjects').val();
				//判断当前显示的是老师身份0，还是家长、学生身份1
				if(role == 2) {
					//14.发布答案,只能上传图片；
					//所需参数
					var comData = {
						teacherId: personalUTID, //教师Id
						subjectId: selectSubjectID, //科目Id， 见（一）.17. GetSubjectList()；
						fileIds: imgIds.toString() //上传文件的id串，例如“1,2”；
					};
					requestPublishAnswer(comData);
				} else {
					var teachers_container = document.getElementById('receive-teachers'); //selectid
					var teaInfo = teachers_container.options[teachers_container.selectedIndex].teaInfo;
					//判断是要学生提交答案0，还是修改答案1
					if(stuSubmitAnswer) {
						//6.	提交答案结果
						//所需参数
						var comData = {
							userId: personalUTID, //学生/家长id，
							classId: teaInfo.utid, //班级id
							studentId: personalUTID, //学生Id；
							fileIds: imgIds.toString(), //文件id数组；
							teacherId: teaInfo.utid, //老师Id；
							teacherName: teaInfo.ugnick + '-' + teaInfo.gname //老师名字；
						};
						requestSubmitAnswer(comData);
					} else {
						//8.修改答案结果；
						//所需参数
						var comData = {
							userId: personalUTID, //学生/家长id，
							studentId: personalUTID, //学生Id；
							answerResultId: answerResultId, //要修改的答案id；
							fileIds: imgIds, //文件id数组；
							teacherId: teaInfo.utid, //老师Id；
							teacherName: teaInfo.ugnick + '-' + teaInfo.gname //老师名字；
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
	 * 
	 * @param {Object} picPath
	 * @param {Object} fileStream
	 */
var uploadFile = function(picPath, fileStream) {
		var comData = {
			fileType: 1, //文件类型，1：图片；2：音频；3：视频；
			fileName: picPath.split('/')[1], //文件名，带后缀；
			fileStream: fileStream, //base64格式文件流；
			displayOrder: imgIds ? imgIds.length : 0 //图片顺序；
		};
		if(role == 2) {
			comData.teacherId = personalUTID;
			uploadFileTeacher(picPath, comData, setPic);
		} else {
			comData.userId = personalUTID;
			uploadFileStudent(picPath, comData, setPic)
		}
	}
	/**
	 * 
	 * @param {Object} picPath 
	 * //“FileId”：1，       //附件id
		//“FileName”：”xxx.png”,       //附件名
		//“FileType”：1,       //附件类型
		//“Url”：“xxx/xxx.png”       //附件url
		//“ThumbUrl”：”xxxxxxxx/xxx.png”，    //缩略图url
		//“DisplayOrder”：1                //显示顺序
	 */
var setPic = function(picPath, img) {
		imgIds.push(img.FileId);
		//	picPath=camero.getAbsolutePath(picPath);
		var pictures = document.getElementById('pictures');
		var div = document.createElement('div');
		div.imgId = img.FileId;
		div.className = 'img-div';
		div.innerHTML = '<img src="' + camera.getAbsolutePath(picPath) + '" data-preview-src="" data-preview-group="1"/>' +
			'<a class="mui-icon iconfont icon-guanbi"></a>'
		pictures.appendChild(div);
	}
	/**
	 * 设置界面
	 * @param {Object} role
	 */
var setCondition = function(role, stuClasses) {
	var btn_post = document.getElementById('post-imgs');
	var title = document.getElementById('title');
	var pictures = document.getElementById('pictures');
	if(role == 2) {
		document.querySelector('.subjects-container').style.display = 'block';
		document.querySelector('.teachers-container').style.display = 'none';
		//		btn_post.innerText = '上传答案';
		title.innerText = '上传答案';
		pictures.className = 'img-container temWork-teaHint';
		requestSubjectList();
	} else {
		stuSubmitAnswer = true;
		document.querySelector('.subjects-container').style.display = 'none';
		document.querySelector('.teachers-container').style.display = 'block';
		//		btn_post.innerText = '上传作业';
		title.innerText = '上传作业';
		pictures.className = 'img-container temWork-stuHint';
		//循环遍历老师数组，将群和老师身份的拼接
		requestClassTeacherInfo(stuClasses);
	}
}

//17.获取所有科目列表
function requestSubjectList() {
	//所需参数
	var comData = {};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//17.获取所有科目列表
	postDataPro_GetSubjectList(comData, wd, function(data) {
		wd.close();
		console.log('上传作业||答案界面获取的科目列表：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//给科目数组赋值
			subjectArray = data.RspData.List;
			var subjects = document.getElementById('publish-subjects');
			//清空数据
			events.clearChild(subjects);
			//加载选项
			subjectArray.forEach(function(subject, i) {
					var op = document.createElement('option');
					op.value = subject.Value;
					op.innerText = subject.Text;
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
	var count = 0;
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	for(var i in stuClasses) {
		//		var tempModel = stuClasses[i];
		//所需参数
		var comData = {
			top: -1, //选择条数,-1为全部
			vvl: stuClasses[i].gid, //群ID,查询的值
			vvl1: -1 //类型,0家长,1管理员,2老师,3学生,-1全部
		};
		//13.通过群ID获取群对象资料【model_groupStus】
		postDataPro_PostGusers(comData, wd, function(data) {
			console.log('上传答案||作业界面获取的资料数据：' + JSON.stringify(data))
			wd.close();
			if(data.RspCode == 0) {
				count++;
				var tempArray = data.RspData; //[{"stuid":19,"gid":14,"stuname":"10群学1","stuimg":"","mstype":3}]
				//循环得到的资料数组，
				for(var m in tempArray) {
					//找到当前的老师
					if(tempArray[m].mstype == 2) {
						//将班级信息，添加到老师model
						for(var n in stuClasses) {
							//群号相同
							if(tempArray[m].gid == stuClasses[n].gid) {
								//将群名添加到群资料model中
								tempArray[m].gname = stuClasses[n].gname;
								if(classTeacherArray.indexOf(tempArray[m]) < 0) {
									//添加到数组中
									classTeacherArray.push(tempArray[m]);
								}
								break;
							}
						}
					}
				}
				if(count == stuClasses.length) {
					setTeachers(classTeacherArray);
				}
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}

}
var setTeachers = function(teaInfos) {
	console.log('上传答案||作业界面要放置的老师资料：' + JSON.stringify(teaInfos))
	var teaContainer = document.getElementById('receive-teachers');
	events.clearChild(teaContainer);
	teaInfos.forEach(function(teaInfo, i) {
		var op = document.createElement('option');
		op.teaInfo = teaInfo;
		op.innerHTML = '<p><span  class="receiver-name">' + teaInfo.ugnick + '</span><span class="recerver-">-</span><span class="receiver-class">' + teaInfo.gname + '</span></p>';
		teaContainer.appendChild(op);
	})
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
function uploadFileTeacher(picPath, comData, callback) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadAnswerFile(comData, wd, function(data) {
		wd.close();
		console.log('发布答案||作业界面老师上传答案返回值' + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(picPath, data.RspData);
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
function uploadFileStudent(picPath, comData, callback) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadAnswerFileStu(comData, wd, function(data) {
		wd.close();
		console.log('发布答案||作业界面学生上传作业返回值' + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(picPath, data.RspData);
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
		console.log('发布答案||作业界面老师发布答案返回值：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			mui.toast('上传成功')
			events.clearChild(document.getElementById('pictures'));
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
		console.log('提交答案||作业界面学生提交作业返回值：' + JSON.stringify(data))
		if(data.RspCode == 0) {
			stuSubmitAnswer = false;
			answerResultId = data.RspData.AnswerResultId
			document.getElementById('checkResult').style.display = 'block'
			document.getElementById('post-imgs').innerText = '修改答案';
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
			if(data.RspData.r) {
				mui.toast("修改答案成功！")
			} else {
				mui.toast('修改答案失败！')
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}