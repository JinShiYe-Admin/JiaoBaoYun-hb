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
				//console.log(data.timgs[i] + '|' + data.title);
				tempImgs.push(data.timgs[i]);
			}
		}
		data.timgs = tempImgs;
		var num_imges = 0;
		if(data.timgs != undefined) {
			num_imges = data.timgs.length;
		}
		if(num_imges == 0) { //没有图片
			addItem_0(element, data, itemId, callBack);
		} else if(num_imges >= 1 && num_imges < 3) { //1-2
			addItem_1(element, data, itemId, callBack);
		} else if(num_imges >= 3) {
			addItem_3(element, data, itemId, callBack);
		}
		itemId++;
	}

	function addItem_0(element, data, id, callBack) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + id + '" class="mui-media-body secedu-body">' +
			'<div id="title_' + id + '" class="secedu-title">' + data.title + '</div>' +
			'<div id="from_' + id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		callBack();
	}

	function addItem_1(element, data, id, callBack) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + id + '" class="mui-media-body secedu-body">' +
			'<img id="image_' + id + '" class="mui-pull-right" style="width:30%" data-lazyload="' + data.timgs[0] + '">' +
			'<div id="title_' + id + '" class="secedu-title">' + data.title + '</div>' +
			'<div id="from_' + id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image = document.getElementById("image_" + id);
		image.style.height = (image.parentNode.offsetWidth * 0.3 * (2 / 3)) + 'px';
		image.style.marginTop = ((image.parentNode.offsetHeight - image.offsetHeight) / 2 - 6) + 'px';
		callBack();
	}

	function addItem_3(element, data, id, callBack) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + id + '" class="mui-media-body secedu-body">' +
			'<div id="title_' + id + '" class="secedu-title">' + data.title + '</div>' +
			'<div class="mui-row">' +
			'<div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_0_' + id + '" data-lazyload="' + data.timgs[0] + '">' +
			'</div>' +
			'<div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_1_' + id + '" data-lazyload="' + data.timgs[1] + '">' +
			'</div>' +
			'<div class="mui-col-xs-4 mui-col-sm-4">' +
			'<img id="image_3_2_' + id + '" data-lazyload="' + data.timgs[2] + '">' +
			'</div></div><div id="from_' + id + '" class="secedu-from">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image_3_0 = document.getElementById("image_3_0_" + id);
		var parentNode = image_3_0.parentNode;
		image_3_0.style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("image_3_1_" + id).style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
		document.getElementById("image_3_2_" + id).style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
		callBack();
	}

	return mod;
})(window.SciEduHomeItem || {});