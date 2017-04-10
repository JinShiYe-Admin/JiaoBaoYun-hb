var SciEduHomeItem = (function(mod) {

	var itemId = 0;

	/**
	 * 增加每一项数据
	 * @param {Object} element 界面容器元素即<ul class="mui-table-view">元素
	 * @param {Object} data 数据
	 * @param {Object} callBack 加载成功的回调
	 * data={
	 * title:'',//标题
	 * tips:'',//作者等信息
	 * timgs:[],//图片数组
	 * turl:''//原文url
	 * }
	 */
	mod.addItem = function(element, data, callBack) {
		var tempImgs = [];

		for(var i = 0; i < data.timgs.length; i++) {
			if(data.timgs[i] != '' && data.timgs[i] != 'null') {
				var tempStr = data.timgs[i];
				//返回大于等于0的整数值，若不包含""则返回"-1。
				if(tempStr.indexOf("~") >= 0) {
					data.timgs[i] = data.timgs[i].replace("~/", "");
					data.timgs[i] = storageKeyName.MAINEDU + data.timgs[i];
				}
				tempImgs.push(data.timgs[i]);
			}
		}
		data.timgs = tempImgs;
		var num_imges = 0;
		if(data.timgs != undefined) {
			num_imges = data.timgs.length;
		}
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-tabid', data.tabid);
		li.setAttribute('data-turl', data.turl);
		li.setAttribute('data-seHistory', data.seHistory);
		li.id = itemId;
		itemId++;
		if(num_imges == 0) { //没有图片
			addItem_0(element, data, li, callBack);
		} else if(num_imges >= 1 && num_imges < 3) { //1-2
			addItem_1(element, data, li, callBack);
		} else if(num_imges >= 3) {
			addItem_3(element, data, li, callBack);
		}
	}

	//没有图片
	function addItem_0(element, data, li, callBack) {
		var html_style = '';
		if(data.seHistory) {
			html_style = 'color:darkgray;';
		}
		li.innerHTML = '<div id="mediaBody_' + li.id + '" class="mui-media-body secedu-body">' +
			'<div id="title_' + li.id + '" class="secedu-title" style="' + html_style + '">' + data.title + '</div>' +
			'<div id="from_' + li.id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		callBack();
	}

	//一张图片
	function addItem_1(element, data, li, callBack) {
		//data.timgs[0] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491818983269&di=143c55562264268bbf346f456842f5a1&imgtype=0&src=http%3A%2F%2Fpic14.nipic.com%2F20110516%2F3101644_221206899369_2.jpg';
		var html_style = '';
		if(data.seHistory) {
			html_style = 'color:darkgray;';
		}
		li.innerHTML = '<div id="mediaBody_' + li.id + '" class="mui-media-body secedu-body">' +
			'<div id="show_' + li.id + '" class="mui-pull-right show-picture" style="width: 30%;">' +
			'<img id="image_' + li.id + '" data-lazyload="' + data.timgs[0] + '" onload="if(this.offsetHeight<=this.offsetWidth){if(this.offsetHeight<(this.parentNode.offsetHeight)){this.style.height=this.parentNode.offsetHeight+\'px\';this.style.width=\'initial\';}this.style.marginLeft=-parseInt((this.offsetWidth-(this.parentNode.offsetWidth))/2)+\'px\';}else{this.style.marginTop=-parseInt((this.offsetHeight-(this.parentNode.offsetHeight))/2)+\'px\';}"></div>' +
			'<div id="title_' + li.id + '" class="secedu-title" style="' + html_style + '">' + data.title + '</div>' +
			'<div id="from_' + li.id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var show = document.getElementById("show_" + li.id);
		show.style.height = parseInt(show.parentNode.offsetWidth * 0.3 * (2 / 3)) + 'px';
		show.style.marginTop = parseInt((show.parentNode.offsetHeight - show.offsetHeight - 10) / 2) + 'px';
		callBack();
	}

	//三张图片
	function addItem_3(element, data, li, callBack) {
		var html_style = '';
		//data.timgs[0] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491818983269&di=143c55562264268bbf346f456842f5a1&imgtype=0&src=http%3A%2F%2Fpic14.nipic.com%2F20110516%2F3101644_221206899369_2.jpg';
		//data.timgs[1] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491818983269&di=143c55562264268bbf346f456842f5a1&imgtype=0&src=http%3A%2F%2Fpic14.nipic.com%2F20110516%2F3101644_221206899369_2.jpg';
		//data.timgs[2] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491818983269&di=143c55562264268bbf346f456842f5a1&imgtype=0&src=http%3A%2F%2Fpic14.nipic.com%2F20110516%2F3101644_221206899369_2.jpg';
		if(data.seHistory) {
			html_style = 'color:darkgray;';
		}
		li.innerHTML = '<div id="mediaBody_' + li.id + '" class="mui-media-body secedu-body">' +
			'<div id="title_' + li.id + '" class="secedu-title" style="' + html_style + '">' + data.title + '</div>' +
			'<div class="mui-row"><div class="mui-col-xs-4 mui-col-sm-4"><div id="show_3_0_' + li.id + '" class="show-picture">' +
			'<img id="image_3_0_' + li.id + '" data-lazyload="' + data.timgs[0] + '"></div>' +
			'</div><div class="mui-col-xs-4 mui-col-sm-4"><div id="show_3_1_' + li.id + '" class="show-picture">' +
			'<img id="image_3_1_' + li.id + '" data-lazyload="' + data.timgs[1] + '"></div>' +
			'</div><div class="mui-col-xs-4 mui-col-sm-4"><div id="show_3_2_' + li.id + '" class="show-picture">' +
			'<img id="image_3_2_' + li.id + '" data-lazyload="' + data.timgs[2] + '"></div>' +
			'</div></div><div id="from_' + li.id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var show_3_0 = document.getElementById("show_3_0_" + li.id);
		var parentNode = show_3_0.parentNode;
		show_3_0.style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("show_3_1_" + li.id).style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("show_3_2_" + li.id).style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		callBack();
	}

	return mod;
})(window.SciEduHomeItem || {});