/**
 * 
 */
var upload_filter = (function(mod) {
	mod.filterOptions = [{
		icon: "",
		title: "上传图片",
		func: ,
		type: 2 //2为android&&ios
	}, {
		icon: "",
		title: "上传视频",
		func: ,
		type: 2
	}, {
		icon: "",
		title: "本地上传",
		func: ,
		type: 1 //1为安卓
	}]
	/**
	 * 
	 */
	mod.createFragment = function() {
		var fragment = document.createDocumentFragment();
		var div = document.createElement("div");
		div.className="";
		for(var i in mod.filterOptions) {
			var filterOption = mod.filterOptions[i];
			var subDiv=document.createElement("div");
			subDiv.className="";
			subDiv.innerHTML=mod.getInnerByType(filterOption);
			div.appendChild(subDiv);
		}
		
	}
	/**
	 * 
	 * @param {Object} option
	 */
	mod.getInnerByType = function(option) {
		switch(option.type) {
			case 0:
				break;
			case 1:
				break;
			case 2:
				break
			default:
				break;
		}
	}
	/**
	 * 显示
	 */
	mod.show=function(){
		
	}
	/**
	 * 隐藏
	 */
	mod.hide=function(){
		
	}
	/**
	 * 设置监听
	 */
	mod.setListener=function(){
		
	}
	return mod;
})(upload_filter || {});