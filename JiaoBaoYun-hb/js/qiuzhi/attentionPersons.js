mui.init();
var pageIndex = 1;
mui.plusReady(function() {
	var options = {
		style: 'circle',
		offset: '50px'
	}
	h5fresh.addRefresh(function() {
		pageIndex=1;
		requireData()
	}, options);
	window.addEventListener('expertInfo', function(e) {
		pageIndex = 1;
		var expertInfo = e.detail.data;
		expertId = expertInfo.UserId;
		requireData();
		console.log('获取的专家信息：' + JSON.stringify(expertInfo));
	})
})
var requireData = function() {
	var wd = events.showWaiting();
	if(pageIndex==1){
		events.clearChild(document.getElementById('list-container'));
	}
	postDataQZPro_getIsFocusedByUser({
		userId: expertId,
		pageIndex: pageIndex,
		pageSize: 10
	}, wd, function(data) {
		console.log('获取的关注此专家的人：' + JSON.stringify(data));
		wd.close();
		if(data.RspCode == 0) {
			var persons = data.RspData.Data;
			var personIds = [];
			for(var i in persons) {
				personIds.push(persons[i].UserId);
			}
			requirePersonInfo(personIds, persons);
		} else {

		}
	})
}
var requirePersonInfo = function(personIds, persons) {
	var wd=events.showWaiting();
	postDataPro_PostUinf({
			vtp: 'g',
			vvl: personIds.toString()
		},
		wd,
		function(data) {
			console.log('通过用户id获取的用户资料数据：'+JSON.stringify(data));
			events.closeWaiting();
			if(data.RspCode==0){
				var personsData=data.RspData;
				for(var i in persons){
					for(var j in personsData){
						if(persons[i].UserId==personsData[j].utid){
							jQuery.extend(persons[i],personsData[j]);
							break;
						}
					}
				}
				
			}else{
				mui.toast(data.RspTxt);
			}
			setData(persons);
		})
}
var setData=function(persons){
	var list=document.getElementById('list-container');
	for(var i in persons){
		var li=document.createElement('li');
		li.className='mui-table-view-cell';
		li.innerHTML=createInner(persons[i]);
		list.appendChild(li);
	}
}
var createInner=function(person){
	var inner='<a><div class="li-container"><div class="head-img display-inlineBlock"><img class="head-portrait" src="'+updateHeadImg(person.uimg,2)+'"/></div>'+
	'<div class="info-container display-inlineBlock"><h5 class="person-name single-line">'+person.unick+'</h5>'+
	'<p class="person-info single-line">'+events.ifHaveInfo(person.UserNote)+'</p></div>'+
	'<input type="button" class="mui-btn  mui-btn-outlined attention-btn" value="'+
	setButtonContent(person)+'"></input></div></a>'
	return inner;
}

var setButtonContent=function(person){
	return '暂无信息';
}
