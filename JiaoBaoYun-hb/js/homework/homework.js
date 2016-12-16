var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var role = 2;
//加载子页面
events.initSubPage('homework-tea-sub.html');
mui.plusReady(function() {
	//预加载发布作业界面
	events.preload('publish-answer.html', 200);
	mui('.mui-scrollbar-horizontal').scroll();
	var title = document.getElementById('workPage-title');
	var roles = document.getElementById('workPage-roles');
	var btn_more = document.getElementById('more');
	window.addEventListener('postClasses', function(e) {
			var data = e.detail.data;
			console.log('作业主界面获取信息：' + JSON.stringify(e.detail.data));
			studentClasses = data.studentClasses;
			teacherClasses = data.teacherClasses;
			setChoices(title, roles, btn_more);
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
	roles.addEventListener("toggle", function(event) {
		if(event.detail.isActive) {
			console.log("你启动了开关");
			role=30;
		} else {
			role=2;
			console.log("你关闭了开关");
		}
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
var setChoices = function(title, roles, btn_m) {
	if(teacherClasses.length > 0 && studentClasses.length > 0) {
		if(roles.classList.contains("mui-active")){
			mui('#workPage-roles').switch().toggle();
		}
		title.style.display = 'none';
		roles.style.display = 'inline-block';
		btn_m.style.display = 'none';
		role = 2;

	} else if(teacherClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '我发布的';
		role = 2;
		btn_m.style.display = 'none';
	} else if(studentClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '学生作业'
		btn_m.style.display = 'block'
		role = 30;
	}
	sendMsgToSub();
}