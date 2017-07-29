/**
 * 微课获取课程列表功能模块
 */
var course_list = (function(mod) {
	/**
	 * 
	 * @param {Object} model
	 * @param {Object} callback
	 */
	mod.getData = function(model, callback, errBack) {
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid, //用户ID,登录用户
			pageIndex: model.pageIndex, //当前页数
			pageSize: 10 //每页记录数,传入0，获取总记录数
		};
		// 等待的对话框
		var wd = null;
		if(model.type) { //关注0，全部1
			//1.获取所有课程
			postDataMCPro_getAllCourses(comData, wd, function(data) {
				//console.log('1.获取所有课程:' + JSON.stringify(data));
				if(data.RspCode == 0) {
					//总页数
					model.totalPage = data.RspData.totalPage;
					if(model.pageIndex === comData.pageIndex) {
						callback(data.RspData.Data);
					}
				} else {
					errBack(data);
				}
			});
		} else { //关注0，全部1
			//游客
			if(!events.getUtid()) {
				//游客关注的课程
				var focuseTemp = window.myStorage.getItem(window.storageKeyName.FOCUSECOURSES);
				if(focuseTemp == null || focuseTemp.length == 0) {
					if(plus.webview.currentWebview().isVisible()) {
						mui.toast('暂时还没有关注的课程');
					}
					return;
				}
				//所需参数
				var comData = {
					userId: personal.utid, //用户ID，登录用户
					courseIds: arrayToStr(focuseTemp), //课程ID，例如[1,2,3]
					pageIndex: model.pageIndex, //当前页数
					pageSize: 0 //每页记录数，传入0，获取总记录数
				};
				//13.根据课程列表获取所有关注的课程
				postDataMCPro_getAllFocusCoursesByIds(comData, wd, function(data) {
					//console.log('13.根据课程列表获取所有关注的课程:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
					if(data.RspCode == 0) {
						//总页数
						model.totalPage = data.RspData.totalPage;
						if(comData.pageIndex === model.pageIndex) {
							callback(data.RspData.Data);
						}
					} else {
						errBack(data);
					}
				});
				return;
			}
			var comData1 = {
				userId: personal.utid, //用户ID,登录用户
				pageIndex: model.pageIndex, //当前页数
				pageSize: 10 //每页记录数,传入0，获取总记录数
			};
			//2.获取所有关注的课程
			postDataMCPro_getAllFocusCourses(comData1, wd, function(data) {
				//console.log('2.获取所有关注的课程:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
				if(data.RspCode == 0) {
					//总页数
					model.totalPage = data.RspData.totalPage;
					callback(data.RspData.Data);
				} else {
					errBack(data);
				}
			});
		}
	};
	return mod;
})(course_list || {})