events.initSubPage('qiuzhi-sub.html', '', -(localStorage.getItem('StatusHeightNo') * 1 + 5));
var allChannels; //所有话题
mui.plusReady(function() {
	document.getElementById('subjects-container').innerHTML = '';
	document.getElementById("sliderGroup").innerHTML = '';
	var curPage = plus.webview.currentWebview();
	curPage.addEventListener("show", function(e) {
		//document.getElementById('subjects-container').innerHTML = '';
		mui('#slider_sw').scroll().scrollTo(0, 0, 0);
		requestAllChannels(setChannels);
	});
	setListener();
})
//1.获取所有话题
function requestAllChannels(callback) {
	//所需参数
	var comData = {
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.获取所有话题
	postDataQZPro_getAllChannels(comData, wd, function(data) {
		wd.close();
		console.log('获取所有话题:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var temArr = data.RspData.Data;
			callback(temArr);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 设置频道
 * @param {Object} subjectArr
 */
var setChannels = function(subjectArr) {
	var subjects = document.getElementById('subjects-container');
	document.getElementById("sliderGroup").innerHTML = '';
	console.log('要加载的类别:' + JSON.stringify(subjectArr));
	allChannels = subjectArr;
	var allChannel = {
		TabId: 0, //话题ID
		ChannelCode: 00, //话题编号
		ChannelName: "全部" //话题名称
	}
	subjectArr.splice(0, 0, allChannel);
	events.clearChild(subjects);
	for(var i in subjectArr) {
		var a = document.createElement('a');
		var elementBot = document.createElement('div');
		if(i == 0) {
			a.className = "mui-control-item mui-active";
			elementBot.className = 'mui-slider-item mui-control-content mui-active';
		} else {
			a.className = "mui-control-item";
			elementBot.className = 'mui-slider-item mui-control-content';
		}
		a.innerText = subjectArr[i].ChannelName;
		a.info = subjectArr[i];
		a.href = '#bot_' + subjectArr[i].TabId;
		elementBot.id = 'bot_' + subjectArr[i].TabId;
		//elementBot.innerText = subjectArr[i].ChannelName;
		subjects.appendChild(a);
		document.getElementById("sliderGroup").appendChild(elementBot);
	}
	document.body.querySelector('.main-navigation').style.width = document.body.querySelector('.more-navigation').offsetLeft + 'px';
	mui('#slider').slider();
	events.fireToPageNone('qiuzhi-sub.html', 'channelInfo', { curChannel: subjectArr[0], allChannels: allChannels });
}
var setListener = function() {
	mui('#subjects-container').on('tap', '.mui-control-item', function() {
		var channelInfo = this.info;
		events.fireToPageNone('qiuzhi-sub.html', 'channelInfo', { curChannel: channelInfo, allChannels: allChannels });
	});
}