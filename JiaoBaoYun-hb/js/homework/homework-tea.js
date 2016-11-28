/**
 * @anthor an
 * 教师作业模块
 */
var teaWork = (function(mod) {
		mod.addClasses = function(classes) {
			var tabs = document.getElementById('scroll-class');
			classes.forEach(function(className, i, classes) {
				var a = document.createElement('a')
				a.className = 'mui-control-item';
				a.innerText = className;
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
		})
		//发布作业界面
	events.addTap('iconPublish', function() {
			events.openNewWindow('homework-publish.html')
		})
		//班级数据
	var classes = ['16级1班', '16级2班', '16级3班', '16级4班', '16级5班', '16级6班', '16级7班', '16级8班', '16级9班']
		//控件加载班级
	teaWork.addClasses(classes);
	getClasses();
})
var getClasses = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_GetClassList({
			teacherId: myStorage.getItem(storageKeyName.PERSONALINFO).utid
		}, wd, function(data) {
			wd.close();
			console.log(JSON.stringify(data));
			if(data.RspCode==0){
				
			}else{
				
			}
		})
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