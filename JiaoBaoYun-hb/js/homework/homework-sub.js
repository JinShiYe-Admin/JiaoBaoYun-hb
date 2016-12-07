/**
 * @anthor an
 * 教师作业模块
 */

//加载h5刷新
//h5fresh.addRefresh('list-container');
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
//	requestClassData();

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
		//判断当前的数据身份，是老师0，还是家长、学生1
		if(identityFlag == 0) {
			//找到当前要加载的群
			var tempModel = teacherArray[teacherFlag];
			//所需参数
			var comData = {
				teacherId: personalUTID, //教师Id
				classId: tempModel1.gid, //班级群Id
				pageIndex: tempModel1.index //当前页码，默认1；
			};
			//获取作业列表
			requestData(comData);
		} else {
			//找到当前要加载的群
			var tempModel = studentArray[studentFlag];
			//所需参数
			var comData = {
				studentId: personalUTID, //教师Id
				classId: tempModel1.gid, //班级群Id
				pageIndex: tempModel1.index //当前页码，默认1；
			};
			//获取作业列表
			requestData(comData);
		}
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
		//判断当前的数据身份，是老师0，还是家长、学生1
		if(identityFlag == 0) {
			//找到当前要加载的群
			var tempModel = teacherArray[teacherFlag];
			//所需参数
			var comData = {
				teacherId: personalUTID, //教师Id
				classId: tempModel.gid, //班级群Id
				pageIndex: tempModel.index //当前页码，默认1；
			};
			//获取作业列表
			requestData(comData);
		} else {
			//找到当前要加载的群
			var tempModel = studentArray[studentFlag];
			//所需参数
			var comData1 = {
				studentId: personalUTID, //教师Id
				classId: tempModel.gid, //班级群Id
				pageIndex: tempModel.index //当前页码，默认1；
			};
			//获取作业列表
			requestData(comData);
		}

	}, 1500);
}

var personalUTID;
//判断是加载更多2，还是刷新1
var flag = 1;
//当前显示的，是第几个班级的索引，点击切换群时，需要将此值对应修改
var teacherFlag = 0; //老师
var studentFlag = 0; //家长
//判断当前显示的是老师身份0，还是家长、学生身份1
var identityFlag = 0;
var teacherClasses=[];//老师身份关联班级
var studentClasses=[];//学生身份关联班级
var teacherHash = newHashMap; //老师身份
var studentHash = newHashMap; //家长、学生身份
var request=function(){
			//申请班级中的数据，默认申请第一个班级数据，先判断是否有老师身份，没有的话，获取家长身份
			if(teacherHash.length > 0) {
				//记录当前身份为老师
				identityFlag = 2;
				teacherFlag = 0;
				var tempModel = teacherHash.get(teacherClasses[0].gid);
				//获取数据
				//所需参数
				var comData = {
					teacherId: personalUTID, //教师Id
					classId: tempModel.gid, //班级群Id
					pageIndex: tempModel.index //当前页码，默认1；
				};
				//获取作业列表
				requestData(comData);
			} else { //判断家长、学生身份的数据
				if(studentArray.length > 0) {
					//记录当前身份为家长、学生
					identityFlag = 30;
					studentFlag = 0;
					var tempModel = studentHash.get(studentArray);
					//获取数据
					//所需参数
					var comData = {
						studentId: personalUTID, //教师Id
						classId: tempModel.gid, //班级群Id
						pageIndex: tempModel.index //当前页码，默认1；
					};
					//获取作业列表
					requestData(comData);
				
				} else {
				mui.toast('没有班级');
			}}
}
var addClasses = function(teacherArray) {
	var tabs = document.getElementById('scroll-class');
	teacherArray.forEach(function(classModel, i, teacherArray) {
		var a = document.createElement('a');
		a.className = 'mui-control-item';
		a.innerText = classModel.gname;
		tabs.appendChild(a);
	})
	tabs.firstElementChild.className = "mui-control-item mui-active";
}

//获取老师、家长作业列表
function requestData(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.根据教师Id和班级Id获取作业列表；逻辑：获取有效的、未毕业的、教师Id在群中的角色是老师的群列表；
	postDataPro_GetHomeworkList(comData, wd, function(data) {
		wd.close();
		console.log('作业主界面作业列表：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			changeSavedData(comData,data.RspData.Dates);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
var changeSavedData = function(comData,dates) {
	if(comData.teacherId) {
		if(comData.pageIndex==1){
			teacherHash.get(comData.gid).homeworkArray=dates;
		}else{
			teacherHash.get(comData.gid).homeworkArray = teacherHash.get(comData.gid).homeworkArray.concat(dates)
		}
	} else {
		if(comData.pageIndex==1){
			studentHash.get(comData.gid).homeworkArray=dates;
		}else{
			studentHash.get(comData.gid).homeworkArray = studentHash.get(comData.gid).homeworkArray.concat(dates)
		}
	
	}
}
var newHashMap = function() {
	var HashMap = {
		put: function(key, value) {
			this[key] = value
		},
		get: function(key) {
			return this[key]
		},
		contains: function(key) {
			return this.Get(key) == null ? false : true
		},
		remove: function(key) {
			delete this[key]
		},
		length: function() {
			return Object.getOwnPropertyNames(this).length - 5;
		}
	}
	return HashMap;
}

/**
 * 创建innerHTML
 * @param {Object} cell
 */
//var createInner = function(cell) {
//	return '<div>' +
//		'<p>' + cell.time + '</p>' +
//		'<div>' +
//		'<img src="' + cell.imgUrl + '"/>' +
//		'<h4 class="title">' + cell.title + '</h4>' +
//		'<p class="">' + cell.words + '</p>' +
//		'</div>' +
//		'<div>' +
//		'<p>未改数(' + cell.weigaiNo + ')</p>' +
//		'<p>已上传数(' + cell.chuanNo + ')</p>' +
//		'</div>' +
//		'<div>' +
//		cell.imgs +
//		'</div>' +
//		'<p>已上传试卷人数(' + cell.stuWorkNo + ')</p>' +
//		'</div>'
//}