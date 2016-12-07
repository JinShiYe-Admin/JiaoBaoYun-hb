var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var role = 2;
//加载子页面
events.initSubPage('homework-tea-sub.html')
mui.plusReady(function() {
	mui('.mui-scrollbar-horizontal').scroll();
	var btn_published = document.getElementById('btn-published');
	var btn_homework = document.getElementById('btn-homework');
	window.addEventListener('postClasses',function(e){
		var data=e.detail.data;
		studentClasses=data.studentClasses;
		teacherClasses=data.teacherClasses;
		setChoices(btn_published,btn_homework);
	})
	//三道杠的点击事件
	events.addTap('more', function() {
		//通知子页面，显示、关闭菜单 
		events.fireToPageNone('homework-tea-sub.html', 'togglePop');
	})
	events.addTap('icon-camero', function() {
		events.openNewWindow('publish-answer.html');
	})
	
	btn_published.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green'
		btn_homework.className = 'mui-btn mui-btn-green mui-btn-outlined'
		role=2;
		events.fireToPageNone("homework-tea-sub.html",'canPublish',role);
	});
	btn_homework.addEventListener('tap', function() {
		btn_published.className = 'mui-btn mui-btn-green mui-btn-outlined';
		btn_homework.className = 'mui-btn mui-btn-green';
		role=30;
		events.fireToPageNone("homework-tea-sub.html",'canPublish',role);
	})
})
var setChoices=function(btn_p, btn_h) {
	if(teacherClasses.length > 0&&studentClasses.length > 0) {
		btn_p.style.display = 'inline-block';
		btn_h.style.display = 'inline-block';
		role=2;
	} else if(teacherClasses.length > 0) {
		btn_p.style.display = 'inline-block';
		btn_h.style.display = 'none';
		role=2;
	}else if(studentClasses.length > 0){
		btn_h.className = 'mui-btn mui-btn-green';
		btn_h.style.display = 'inline-block';
		btn_p.style.display = 'none';
		role=30;
	}
	events.fireToPageNone("homework-tea-sub.html",'canPublish',role);
}