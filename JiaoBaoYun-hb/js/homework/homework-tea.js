/**
 * @anthor an
 * 教师作业模块
 */
var teaWork = (function(mod) {
		mod.addClasses = function(teacherArray) {
			var tabs = document.getElementById('scroll-class');
			teacherArray.forEach(function(classModel, i, teacherArray) {
				var a = document.createElement('a')
				a.className = 'mui-control-item';
				a.innerText = classModel.gname;
				tabs.appendChild(a);
			})
			tabs.firstElementChild.className = "mui-control-item mui-active";
		}
		return mod;
	})(teaWork || {})
	//加载h5刷新
h5fresh.addRefresh('list-container');
//加载mui
mui.init();
//mui的plusready监听
mui.plusReady(function() {

	/**监听父页面的图标事件*/
	window.addEventListener('togglePop', function(e) {
		mui("#popover").popover('toggle');
	});
	//发布作业界面
	events.addTap('iconPublish', function() {
		events.openNewWindow('homework-publish.html')
	});

	events.addTap('tempDetail', function() {
		events.openNewWindow('workdetail-tea.html')
	});


	//获取当前账号，所在的群
	//需要参数
	var comData = {
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: personalUTID //查询的各项，对应人的utid，可以是查询的任何人
	};
	requestClassData(comData);

	//	getClasses();
	//获取老师所在班级

})

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		//判断是加载更多2，还是刷新1
		flag = 1;
		//找到当前要加载的群
		var tempModel1 = teacherArray[classFlag];
		//所需参数
		var comData1 = {
			teacherId: personalUTID, //教师Id
			classId: tempModel1.gid, //班级群Id
			pageIndex: tempModel1.index //当前页码，默认1；
		};
		//获取作业列表
		requestData(comData1);
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);

}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
		//判断是加载更多2，还是刷新1
		flag = 2;
		//找到当前要加载的群
		var tempModel1 = teacherArray[classFlag];
		//所需参数
		var comData1 = {
			teacherId: personalUTID, //教师Id
			classId: tempModel1.gid, //班级群Id
			pageIndex: tempModel1.index //当前页码，默认1；
		};
		//获取作业列表
		requestData(comData1);
	}, 1500);
}

var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
//判断是加载更多2，还是刷新1
var flag = 1;
//当前显示的，是第几个班级的索引，点击切换群时，需要将此值对应修改
var classFlag = 0;
//判断当前显示的是老师身份0，还是家长、学生身份1
var identityFlag = 0;
//页码请求到要显示的数据，array[model_groupList，]
var teacherArray = []; //老师身份
var studentArray = []; //家长、学生身份

//请求班级数据
function requestClassData() {
	//获取当前账号，所在的群
	//需要参数
	var comData = {
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: personalUTID //查询的各项，对应人的utid，可以是查询的任何人
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//9.获取用户群
	postDataPro_PostGList(comData, wd, function(data) {
		wd.close();
		console.log('作业主界面获取的群信息：'+JSON.stringify(data) );
		if(data.RspCode == 0) {
//			var tempModel = data.RspData;
			//			gid:'14',//群ID
			//			gname:'10群',//群名
			//			gimg:'',//群头像,群头像的链接
			//			mstype:'2'//用户角色,0家长,1管理员,2老师,3学生
			//然后检索身份为老师的

			for(var i in data.RspData) {
				var tempModel = data.RspData[i];
				//2老师
				if(tempModel.mstype == 2) {
					//作业列表
					tempModel.homeworkArray = [];
					tempModel.index = 1;
					teacherArray.push(tempModel1);
				}
				//家长
				if(tempModel.mstype == 0) {
					//作业列表
					tempModel.homeworkArray = [];
					tempModel.index = 1;
					studentArray.push(tempModel);
					return;
				}
				//学生
				if(tempModel.mstype == 3) {
					//作业列表
					tempModel.homeworkArray = [];
					tempModel.index = 1;
					studentArray.push(tempModel);
				}
			}
			//控件加载班级，根据数组里面是否有数据，做界面显示
//			teaWork.addClasses(teacherArray);
			//申请班级中的数据，默认申请第一个班级数据，先判断是否有老师身份，没有的话，获取家长身份
			if(teacherArray.length > 0) {
				//记录当前身份为老师
				identityFlag = 0;
				var tempModel1 = teacherArray[0];
				//获取数据
				//所需参数
				var comData = {
					teacherId: personalUTID, //教师Id
					classId: tempModel.gid, //班级群Id
					pageIndex: tempModel.index //当前页码，默认1；
				};
				//获取作业列表

				requestData(comData1);
			} else { //判断家长、学生身份的数据
				if(studentArray.length > 0) {
					//记录当前身份为家长、学生
					identityFlag = 1;
					var tempModel1 = studentArray[0];
					//获取数据
					//所需参数
					var comData1 = {
						studentId: personalUTID, //教师Id
						classId: tempModel1.gid, //班级群Id
						pageIndex: tempModel1.index //当前页码，默认1；
					};
					//获取作业列表
					requestData(comData1);
				}
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//获取老师作业列表
function requestData() {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.根据教师Id和班级Id获取作业列表；逻辑：获取有效的、未毕业的、教师Id在群中的角色是老师的群列表；
	postDataPro_GetHomeworkList(comData, wd, function(data) {
		wd.close();
		console.log('1.postDataPro_GetHomeworkList:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//用于循环所要的数据，存不同身份数据
			var tempArray = [];
			//判断当前的数据身份，是老师0，还是家长、学生1
			if (identityFlag == 0) {
				tempArray = teacherArray;
			} else{
				tempArray = studentArray;
			}
			//先判断是哪个群的数据
			for(var i in tempArray) {
				//当前群
				var classModel = tempArray[i];
				//找到和返回作业列表一直的群号
				if(classModel.gid == data.RspData.ClassId) {
					//判断是刷新还是加载更多
					if(flag == 1) { //刷新
						//将群里面的加载索引加1
						classModel.index = 1;
						//赋值
						classModel.homeworkArray = data.RspData.Dates;
					} else { //加载更多2
						//将群里面的加载索引加1
						classModel.index++;
						//合并作业列表
						classModel.homeworkArray = classModel.homeworkArray.concat(data.RspData.Dates);
					}
				}
			}
			//刷新界面显示

		} else {
			mui.toast(data.RspTxt);
		}
	});
}

/**
 * 创建innerHTML
 * @param {Object} cell
 */
var createInner = function(cell) {
	return '<div>' +
		'<p>' + cell.time + '</p>' +
		'<div>' +
		'<img src="' + cell.imgUrl + '"/>' +
		'<h4 class="title">' + cell.title + '</h4>' +
		'<p class="">' + cell.words + '</p>' +
		'</div>' +
		'<div>' +
		'<p>未改数(' + cell.weigaiNo + ')</p>' +
		'<p>已上传数(' + cell.chuanNo + ')</p>' +
		'</div>' +
		'<div>' +
		cell.imgs +
		'</div>' +
		'<p>已上传试卷人数(' + cell.stuWorkNo + ')</p>' +
		'</div>'
}