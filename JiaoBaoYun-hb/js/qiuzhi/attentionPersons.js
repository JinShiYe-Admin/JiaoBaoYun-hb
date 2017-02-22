mui.init();
var pageIndex = 1;//页码
var selfId;//本人id
var totalPageCount=0;
mui.plusReady(function() {
	var options = {
		style: 'circle',
		offset: '50px'
	}
	//加载h5刷新
	h5fresh.addRefresh(function() {
		pageIndex = 1;
		requireData()
	}, options);
	window.addEventListener('expertInfo', function(e) {
		selfId = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		pageIndex = 1;
		var expertInfo = e.detail.data;
		expertId = expertInfo.UserId;
		requireData();
		console.log('获取的专家信息：' + JSON.stringify(expertInfo));
	})
})
/**
 * 获取关注人数据
 */
var requireData = function() {
	var wd = events.showWaiting();
	if(pageIndex == 1) {
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
			totalPageCount=data.RspData.TotalPage;//获取总页数
			var persons = data.RspData.Data;//关注人数据
			var personIds = [];
			//遍历获取关注人id数组
			for(var i in persons) {
				personIds.push(persons[i].UserId);
			}
			//通过id数组，获取人员资料，并重组
			requirePersonInfo(personIds, persons);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 获取个人信息 并重组数据
 * @param {Object} personIds
 * @param {Object} persons
 */
var requirePersonInfo = function(personIds, persons) {
	var wd = events.showWaiting();
	postDataPro_PostUinf({
			vtp: 'g',
			vvl: personIds.toString()
		},
		wd,
		function(data) {
			console.log('通过用户id获取的用户资料数据：' + JSON.stringify(data));
			events.closeWaiting();
			if(data.RspCode == 0) {
				var personsData = data.RspData;
				for(var i in persons) {
					for(var j in personsData) {
						if(persons[i].UserId == personsData[j].utid) {
							jQuery.extend(persons[i], personsData[j]);
							break;
						}
					}
				}

			} else {
				mui.toast(data.RspTxt);
			}
			//放置数据
			setData(persons);
		})
}
/**
 * 根据获取的专家关注人信息放置数据
 * @param {Object} persons 
 */
var setData = function(persons) {
	var list = document.getElementById('list-container');
	for(var i in persons) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = createInner(persons[i]);
		list.appendChild(li);
	}
}
/**
 * 放置关注人数据
 * @param {Object} person 关注人信息
 */
var createInner = function(person) {
	var inner = '<a><div class="li-container"><div class="head-img display-inlineBlock"><img class="head-portrait" src="' + updateHeadImg(person.uimg, 2) + '"/></div>' +
		'<div class="info-container display-inlineBlock"><h5 class="person-name single-line">' + person.unick + '</h5>' +
		'<p class="person-info single-line">' + events.ifHaveInfo(person.UserNote) + '</p></div>' +
		'<button type="button" class="mui-btn mui-btn-outlined attention-btn" value="' +
		setButtonContent(person) + '">'+setButtonContent(person)+'</button></div></a>'
	return inner;
}
/**
 * 根据信息，设置关注状况
 * @param {Object} person 专家关注人信息
 */
var setButtonContent = function(person) {
	return '暂无信息';
}
/**
 * 设置关注状态
 * @param {Object} focusId 被关注人的id
 * @param {Object} type 关注状态,0 不关注,1 关注
 */
var setFocus = function(focusId,type) {
	var wd = events.showWaiting();
	postDataQZPro_setUserFocus({
		userId: selfId, //用户ID
		focusUserId: focusId, //关注用户ID
		status: type//关注状态,0 不关注,1 关注
	}, wd, function(data) {
		console.log('获取的关注结果：' + JSON.stringify(data));
		wd.close();
		if(data.RspCode==0&&data.RspData.Result==1){
			if(type){
				mui.toast('关注成功！')
			}else{
				mui.toast('取消关注成功！')
			}
			
		}
	})
}