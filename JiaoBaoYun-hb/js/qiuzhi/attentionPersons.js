mui.init();
var pageIndex = 1; //页码
var selfId; //本人id
var totalPageCount = 0;
mui.plusReady(function() {
	window.addEventListener('expertInfo', function(e) {
		selfId = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		pageIndex = 1;
		var expertInfo = e.detail.data;
		expertId = expertInfo.UserId;
		requireData();
		console.log('获取的专家信息：' + JSON.stringify(expertInfo));
	})
	setListener();

	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				var self = this;
				console.log("下拉刷新");
				pageIndex = 1;
				flagRef = 0;
				//获取关注人数据
				requireData();
				self.endPullDownToRefresh();
			}
		},
		up: {
			callback: function() {
				var self = this;
				console.log("上拉加载更多");
				flagRef = 1;
				if(pageIndex <= totalPageCount) {
					//获取关注人数据
					requireData();
				} else {
					mui.toast('没有更多了');
				}
				self.endPullUpToRefresh();
			}
		}
	});
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
		userId: selfId,
		focusId: expertId,
		pageIndex: pageIndex,
		pageSize: 10
	}, wd, function(data) {
		console.log('获取的关注此专家的人：' + JSON.stringify(data));
		wd.close();
		if(data.RspCode == 0) {
			totalPageCount = data.RspData.TotalPage; //获取总页数
			pageIndex++;
			var persons = data.RspData.Data; //关注人数据
			var personIds = [];
			//遍历获取关注人id数组
			for(var i in persons) {
				personIds.push(persons[i].UserId);
			}
			//通过id数组，获取人员资料，并重组
			if(personIds.length > 0) {
				requirePersonInfo(personIds, persons);
			}
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
	console.log("要放置的个人数据：" + JSON.stringify(persons));
	var list = document.getElementById('list-container');
	for(var i in persons) {
		var li = document.createElement('li');
		li.setAttribute('data-info', JSON.stringify(persons[i]));
		li.className = 'mui-table-view-cell';
		li.innerHTML = createInner(persons[i]);
		list.appendChild(li);
		li.querySelector('.mui-btn').personInfo = persons[i];
	}
}
/**
 * 放置关注人数据
 * @param {Object} person 关注人信息
 */
var createInner = function(person) {
	var inner = '<a><div class="li-container"><div class="head-img display-inlineBlock"><img class="person-info head-portrait" src="' +
		updateHeadImg(person.uimg, 2) + '"/></div>' +
		'<div class="info-container display-inlineBlock"><h5 class="person-name single-line person-info">' +
		person.unick + '</h5>' +
		'<p class="person-info single-line">' + events.ifHaveInfo(person.UserNote) +
		'</p></div>' +
		'<p  class="mui-btn mui-btn-outlined ' + getButtonContent(person.FocusType).classInfo + ' " >' + getButtonContent(person.FocusType).inner + '</p></div></a>'
	return inner;
}
/**
 * 根据信息，设置关注状况
 * @param {Object} focusType 
 * 0 未关注
	1 已关注
	2 相互关注
	3 无法关注（自己）
 */
var getButtonContent = function(focusType) {
	var buttonInfo = {};
	switch(focusType) {
		case 0:
		case 2:
			buttonInfo.classInfo = 'attention-btn';
			buttonInfo.inner = '+关注';
			break;
		case 1:
			buttonInfo.classInfo = 'attentioned-btn';
			buttonInfo.inner = '已关注';
			break;
		case 3:
			buttonInfo.classInfo = 'attentioned-btn';
			buttonInfo.inner = '<span class="iconfont icon-huxiangguanzhu"></span>关注';
			break;
		case 5:
			buttonInfo.classInfo = 'display-none';
			buttonInfo.inner = '自己'
		default:
			break;
	}
	return buttonInfo;
}
/**
 * 设置关注状态
 * @param {Object} focusId 被关注人的id
 * @param {Object} type 关注状态,0 不关注,1 关注
 */
var setFocus = function(item, type) {
	console.log(JSON.stringify(item.personInfo));
	var wd = events.showWaiting();
	postDataQZPro_setUserFocus({
		userId: selfId, //用户ID
		focusUserId: item.personInfo.UserId, //关注用户ID
		status: type //关注状态,0 不关注,1 关注
	}, wd, function(data) {
		console.log('获取的关注结果：' + JSON.stringify(data));
		wd.close();
		if(data.RspCode == 0 && data.RspData.Result == 1) {
			if(type) {
				mui.toast('关注成功！')
			} else {
				mui.toast('取消关注成功！')
			}
			setButtonInfoType(item);
			var buttonInfo = getButtonContent(item.personInfo.FocusType);
			item.innerHTML = buttonInfo.inner;
			item.className = 'mui-btn mui-btn-outlined ' + buttonInfo.classInfo;
		}
	})
}
/**
 *	关注状态关注的
 * @param {Object} item
 */
var setButtonInfoType = function(item) {
	switch(item.personInfo.FocusType) {
		case 0:
			item.personInfo.FocusType = 1;
			break;
		case 1:
			item.personInfo.FocusType = 0;
			break;
		case 2:
			item.personInfo.FocusType = 3;
			break;
		case 3:
			item.personInfo.FocusType = 2;
			break;
		default:
			break;
	}
}

var setListener = function() {
	mui('.mui-table-view').on('tap', '.mui-btn', function() {
		var focusType;
		switch(this.personInfo.FocusType) {
			case 0:
			case 2:
				focusType = 1;
				break;
			case 1:
			case 3:
				focusType = 0;
				break;
			default:
				break;
		}
		setFocus(this, focusType);
	});

	//点击头像、昵称、简介进入专家主页
	mui('.mui-table-view').on('tap', '.person-info', function() {
		//获取到当前控件的父节点
		var parent = this.parentNode.parentNode.parentNode.parentNode;
		//得到父节点的值
		var info = JSON.parse(parent.getAttribute('data-info'));
		console.log('dianji 关注他的人：' + JSON.stringify(info));
		events.openNewWindowWithData('expert-detail.html', JSON.stringify(info));
		events.fireToPageWithData('expert-detail.html', 'expert-detail', info);
	});
}
///**
// * 上拉加载的实现方法
// */
//var pullUpFresh = function() {
//	document.addEventListener("plusscrollbottom", function() {
//		console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPageCount);
//		if(pageIndex < totalPageCount) {
//			pageIndex++;
//			requestData();
//		} else {
//			mui.toast('没有更多了');
//		}
//	}, false);
//}