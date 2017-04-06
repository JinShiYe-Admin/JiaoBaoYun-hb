var SciEduHomeItem = (function(mod) {

	var itemId = 0;
	var placeholder = '../../' + window.storageKeyName.DEFAULTIMAGELOAD;
	//var placeholder = '';

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
		var html_style = '';
		if(data.seHistory) {
			html_style = 'color:darkgray;';
		}
		li.innerHTML = '<div id="mediaBody_' + li.id + '" class="mui-media-body secedu-body">' +
			'<img id="image_' + li.id + '" class="mui-pull-right" style="width:30%" src="' + placeholder + '" data-lazyload="' + data.timgs[0] + '">' +
			'<div id="title_' + li.id + '" class="secedu-title" style="' + html_style + '">' + data.title + '</div>' +
			'<div id="from_' + li.id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image = document.getElementById("image_" + li.id);
		image.style.height = parseInt(image.parentNode.offsetWidth * 0.3 * (2 / 3)) + 'px';
		image.style.marginTop = parseInt((image.parentNode.offsetHeight - image.offsetHeight) / 2 - 6) + 'px';
		callBack();
	}

	//三张图片
	function addItem_3(element, data, li, callBack) {
		var html_style = '';
		if(data.seHistory) {
			html_style = 'color:darkgray;';
		}
		li.innerHTML = '<div id="mediaBody_' + li.id + '" class="mui-media-body secedu-body">' +
			'<div id="title_' + li.id + '" class="secedu-title" style="' + html_style + '">' + data.title + '</div>' +
			'<div class="mui-row"><div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_0_' + li.id + '" src="' + placeholder + '" data-lazyload="' + data.timgs[0] + '">' +
			'</div><div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_1_' + li.id + '" src="' + placeholder + '" data-lazyload="' + data.timgs[1] + '">' +
			'</div><div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_2_' + li.id + '" src="' + placeholder + '" data-lazyload="' + data.timgs[2] + '">' +
			'</div></div><div id="from_' + li.id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image_3_0 = document.getElementById("image_3_0_" + li.id);
		var parentNode = image_3_0.parentNode;
		image_3_0.style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("image_3_1_" + li.id).style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("image_3_2_" + li.id).style.height = parseInt(parentNode.offsetWidth * (2 / 3)) + 'px';
		callBack();
	}

	return mod;
})(window.SciEduHomeItem || {});