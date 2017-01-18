var SenEduHomeItem = (function(mod) {

	var itemId = 0;

	/**
	 * 增加每一项数据
	 * @param {Object} element 界面容器元素即<ul class="mui-table-view">元素
	 * @param {Object} data 数据
	 * data={
	 * title:'',//标题
	 * tips:'',//作者等信息
	 * timgs:[],//图片数组
	 * turl:''//原文url
	 * }
	 */
	mod.addItem = function(element, data) {
		var num_imges = 0;
		if(data.timgs != undefined) {
			num_imges = data.timgs.length;
		}
		if(num_imges == 0) { //没有图片
			addItem_0(element, data, itemId);
		} else if(num_imges >= 1 && num_imges < 3) { //1-2
			addItem_1(element, data, itemId);
		} else if(num_imges >= 3) {
			addItem_3(element, data, itemId);
		}
		itemId++;
	}

	function addItem_0(element, data, id) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + itemId + '" class="mui-media-body" style="padding-top: 5px;padding-bottom: 3px;">' +
			'<b id="title_' + itemId + '" style="word-break: break-all;font-size: 20px;">' + data.title + '</b>' +
			'<div id="from_' + itemId + '" style="word-break: break-all;margin-top: 5px;">' + data.tips + '</div></div>';
		element.appendChild(li);
	}

	function addItem_1(element, data, id) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + id + '" class="mui-media-body" style="padding-top: 5px;padding-bottom: 3px;">' +
			'<img id="image_' + id + '" class="mui-pull-right" style="width: 30%;" src="' + data.timgs[0] + '">' +
			'<b id="title_' + id + '" style="word-break: break-all;font-size: 20px;">' + data.title + '</b>' +
			'<div id="from_' + id + '" style="word-break: break-all;margin-top: 5px;">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image = document.getElementById("image_" + id);
		var parentNode = image.parentNode;
		image.style.height = (parentNode.offsetWidth * 0.3 * (2 / 3)) + 'px';
		image.style.marginTop = (parentNode.offsetHeight - image.offsetHeight) / 2 + 'px';
	}

	function addItem_3(element, data, id) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute('data-turl', data.turl);
		li.id = id;
		li.innerHTML = '<div id="mediaBody_' + id + '" class="mui-media-body" style="padding-top: 5px;padding-bottom: 3px;">' +
			'<b id="title_' + id + '" style="word-break: break-all;font-size: 20px;">' + data.title + '</b>' +
			'<div class="mui-row" style="margin-top: 3px;">' +
			'<div class="mui-col-xs-4 mui-col-sm-4" style="padding: 2px;">' +
			'<img id="image_3_0_' + id + '" style="width: 100%;" src="' + data.timgs[0] + '">' +
			'</div>' +
			'<div class="mui-col-xs-4 mui-col-sm-4" style="padding: 2px;">' +
			'<img id="image_3_1_' + id + '" style="width: 100%;" src="' + data.timgs[1] + '">' +
			'</div>' +
			'<div class="mui-col-xs-4 mui-col-sm-4" style="padding: 2px;">' +
			'<img id="image_3_2_' + id + '" style="width: 100%;" src="' + data.timgs[2] + '">' +
			'</div></div><div id="from_' + id + '" style="word-break: break-all;margin-top: 5px;">' + data.tips + '</div></div>';
		element.appendChild(li);
		var image_3_0 = document.getElementById("image_3_0_" + id);
		var image_3_1 = document.getElementById("image_3_1_" + id);
		var image_3_2 = document.getElementById("image_3_2_" + id);
		var parentNode = image_3_0.parentNode;
		image_3_0.style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
		image_3_1.style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
		image_3_2.style.height = (parentNode.offsetWidth * (2 / 3)) + 'px';
	}

	return mod;
})(window.SenEduHomeItem || {});