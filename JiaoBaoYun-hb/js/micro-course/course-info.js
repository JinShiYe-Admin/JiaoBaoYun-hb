var courseInfo = new Vue({
	el: "#course-info",
	data: {
		courseInfo: {

		},
		isFocused: 0
	},
	methods: {
		getCourseInfo: function() {

		},
		toggleFocus: function() {
			if(events.getUtid()) {
				courseInfo.setCourseFocus(function() {
					courseInfo.isFocused = courseInfo.isFocused ? 0 : 1;
				});
			} else {
				events.toggleStorageArray(storageKeyName.FOCUSECOURSES, this.courseInfo.TabId, this.isFocused);
				this.isFocused = this.isFocused ? 0 : 1;
				events.fireToPageNone('course-all.html', 't-focus');
				events.fireToPageNone('course-attended.html', 't-focus');
			}
		},
		setCourseFocus: function(callback) {
			//6.设置对某个课程关注
			//所需参数
			var comData = {
				userId: events.getUtid(), //用户ID,登录用户
				courseId: this.courseInfo.TabId, //课程ID
				status: this.isFocused ? 0 : 1 //关注状态，0 不关注，1 关注
			};
			//返回值：1为正确
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			postDataMCPro_setCourseFocus(comData, wd, function(data) {
				wd.close();
				//console.log('6.设置对某个课程关注:' + JSON.stringify(data));
				//console.log("是否已关注："+this.isFocused);
				if(data.RspCode == 0) {
					events.fireToPageNone('course-all.html', 't-focus');
					events.fireToPageNone('course-attended.html', 't-focus');
					callback();
				} else {
					mui.toast(data.RspTxt);
				}
			});
		},
		jumpToPage: function(courseInfo) {
			events.singleWebviewInPeriod(undefined, 'history-records.html', courseInfo);
		}
	}
})