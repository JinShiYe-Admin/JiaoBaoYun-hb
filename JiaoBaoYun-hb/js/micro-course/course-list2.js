Vue.component('course-list', {
	template: '<ul v-bind:class="[\'mui-table-view\']">' +
		'<li v-for="(li,index) of listData" v-bind:class="[\'mui-table-view-cell\']" v-on:tap="jumpToPage(li)" v-bind:id="li.TabId" v-bind:value="index">' +
		'<div v-bind:class="[\'course-container\']">' +
		'<div v-bind:class="[\'img-container\']">' +
		'<img v-bind:class="[\'course-img\']" v-bind:src="li.CoursePic" />' +
		'<span  v-bind:class="[\'red-circle\',{\'display-none\':li.IsUpdate==0}]"></span>' +
		'</div>' +
		'<div v-bind:class="[\'course-detail\']">' +
		'<div v-bind:class="[\'courseName-button\']">' +
		'<p v-bind:class="[\'course-name\',\'single-line\']">{{li.CourseName}}</p>' +
		'<button  type="button"  v-bind:class="[\'input-btn\',{\'btn-focused\':li.IsFocus},{\'btn-unfocus\':!li.IsFocus}]" v-on:tap.stop="toggleFocus(li)">{{li.IsFocus?"已关注":"关注"}}</button>' +
		'</div>' +
		'<p v-bind:class="[\'course-info\',\'double-line\']">{{li.SecName}}</p>' +
		'</div>' +
		'</div>' +
		'</li>' +
		'</ul>',
	data: function() {
		return {
			listData: [],
			courseInfo: {
				type: this.$route.params.id,
				pageIndex: 1,
				totalPage: 0
			}
		}
	},
	created: function() {
		console.log("当前route的params的id:" + this.$route.params.id);
		this.requestData();
	},
	watch: {
		'$route' (to, from) {
			console.log("当前route的params的id:" + this.$route.params.id);
			this.courseInfo.pageIndex = 1;
			this.requestData();
		}
	},
	methods: {
		jumpToPage: function(item) {

		},
		toggleFocus: function(item) {

		},
		requestData: function() {
			var com = this;
			this.courseInfo.pageIndex = 1;
			course_list.getData(courseInfo, function(data) {
				console.log("#############全部课程刷新##########")
				com.addData(data);
				//				mui(".mui-content").pullRefresh().endPulldown();
				//				mui(".mui-content").pullRefresh().refresh(true);
			}, function(err) {
				//				mui(".mui-content").pullRefresh().endPulldown();
				//				mui(".mui-content").pullRefresh().refresh(true);
			})
		},
		addData: function(data) {
			var com = this;
			data = data.map(function(course, index, data) {
				return com.isFocus(course);
			});
			console.log("微课加载的课程：", data);
			if(com.courseInfo.pageIndex === 1) {
				com.listData = [];
			}
			com.listData = com.listData.concat(data);
			com.courseInfo.pageIndex++;
		},
		isFocus: function(course) {
			var isFocused = false;
			if(events.getUtid()) {
				isFocused = Boolean(course.IsFocus);
			} else {
				console.log("保存的数组：", myStorage.getItem(storageKeyName.FOCUSECOURSES))
				console.log("events的判断", events.isExistInStorageArray(storageKeyName.FOCUSECOURSES, parseInt(course.TabId))[1])
				isFocused = (parseInt(events.isExistInStorageArray(storageKeyName.FOCUSECOURSES, parseInt(course.TabId))[1]) >= 0);
				this.isUpdate(course);
			}
			course.IsFocus = isFocused;
			console.log("获取的课程关注信息:", course);
			return course;
		},
		isUpdate: function(course) {
			var courseTime = events.isExistInStorageMap(storageKeyName.COURSELASTTIME, course.TabId);
			//console.log("获取的更新时间：" + JSON.stringify(courseTime));
			if(courseTime) {
				if(courseTime < Date.parse(course.UpdateTime)) {
					course.IsUpdate = 1;
				} else {
					course.IsUpdate = 0;
				}
			} else {
				course.IsUpdate = 1;
			}
		},
	}
})