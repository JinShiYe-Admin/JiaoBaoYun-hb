var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var role = 2;
//加载子页面
events.initSubPage('homework-tea-sub.html');
mui.plusReady(function() {
	//预加载发布作业界面
	events.preload('publish-answer.html', 200);
	mui('.mui-scrollbar-horizontal').scroll();
	var btn_published = document.getElementById('btn-published');
	var btn_homework = document.getElementById('btn-homework');
	var btn_more=document.getElementById('more');
	window.addEventListener('postClasses', function(e) {
			var data = e.detail.data;
			console.log('作业主界面获取信息：' + JSON.stringify(e.detail.data));
			studentClasses = data.studentClasses;
			teacherClasses = data.teacherClasses;
			setChoices(btn_published, btn_homework,btn_more);
		})
		//三道杠的点击事件
	events.addTap('more', function() {
			//通知子页面，显示、关闭菜单 
			events.fireToPageNone('homework-tea-sub.html', 'togglePop');
		})
		//相机点击事件
	events.addTap('icon-camero', function() {
		events.fireToPageWithData('publish-answer.html', 'roleInfo', {
				role: role,
				studentClasses: studentClasses,
				teacherClasses: teacherClasses
		})
	})

	btn_published.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green'
		btn_homework.className = 'mui-btn mui-btn-green mui-btn-outlined'
		btn_more.style.display='none';
		role = 2;
		events.fireToPageNone('homework-tea-sub.html', 'roleChanged', role)
	});
	btn_homework.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green mui-btn-outlined';
		btn_homework.className = 'mui-btn mui-btn-green';
		btn_more.style.display='block';
		role = 30;
		events.fireToPageNone('homework-tea-sub.html', 'roleChanged', role)
	})
})
var sendMsgToSub = function() {
	events.fireToPageNone("homework-tea-sub.html", 'workContent', {
		role: role,
		studentClasses: studentClasses,
		teacherClasses: teacherClasses
	});
}
var setChoices = function(btn_p, btn_h,btn_m) {
	if(teacherClasses.length > 0 && studentClasses.length > 0) {
		btn_p.style.display = 'inline-block';
		btn_h.style.display = 'inline-block';
		btn_p.className = 'mui-btn mui-btn-green';
		btn_h.className = 'mui-btn mui-btn-green mui-btn-outlined';
		role = 2;
		btn_m.style.display='none';
	} else if(teacherClasses.length > 0) {
		btn_p.style.display = 'inline-block';
		btn_h.style.display = 'none';
		role = 2;
		btn_m.style.display='none';
	} else if(studentClasses.length > 0) {
		btn_h.className = 'mui-btn mui-btn-green';
		btn_h.style.display = 'inline-block';
		btn_p.style.display = 'none';
		btn_m.style.display='block'
		role = 30;
	}
	sendMsgToSub();
}