/**
 * 
 */
var filter = new Vue({
	el: "#filter",
	data: {
		options: [{
			icon: "../../image/cloud/up_image.png",
			title: "上传图片",
			func: camero.getPic,
			type: 2 //2为android&&ios
		}, {
			icon: "../../image/cloud/up_video.png",
			title: "上传视频",
			func: video.recordVideo,
			type: 2
		}, {
			icon: "../../image/cloud/up_local.png",
			title: "本地上传",
			func: ,
			type: 1 //1为安卓
		}],
		isShow: false,
		filterContainer:{
			position:"fixed",
			top:"0px",
			bottom:"0px",
			left:"0px",
			width:"100%"
		}
	},
	methods: {
		setIsShow: function(isShow) {
			this.isShow = isShow;
		},
		setOptions: function(optionArr) {
			this.options = optionArr;
		},
		setData: function() {
			var body = document.body;
			var div=document.createElement("div")
			div.id="filter";
			div.setAttribute("v-bind:style",this.filterContainer);
			div.setAttribute("v-if", this.isShow);
			var ul = document.createElement("ul");
			ul.innerHTML = '<li v-for="option of options" v-if="cellIsShow(option)" v-on:click="option:func">' +
				'<img src="option.icon"/><p>option.title</p>' +
				'</li>';
			body.appendChild(ul);
		},
		cellIsShow: function(cell) {
			switch(cell.type) {
				case 0:
					if(plus.os.name == "iOS") {
						return true;
					}
					return false;
				case 1:
					if(plus.os.name == "Android") {
						return true;
					}
					return false;
				case 2:
					if(plus.os.name == "iOS" || plus.os.name == "Android") {
						return true;
					}
					return false;
				default:
					return false;
			}
		}
	}
})