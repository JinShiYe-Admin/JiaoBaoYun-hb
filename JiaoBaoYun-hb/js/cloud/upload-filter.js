/**
 * 
 */
Vue.component("filter-item", {
	props: ['option'],
	template: '<li v-on:click="option.func">' +
		'<img v-bind:src="option.icon"  />' +
		'<p>{{option.title}}</p>' +
		'</li>'
});
var filter = new Vue({
	el: "#filter",
	data: {
		fileNo: 0,
		options: [{
			icon: "../../image/cloud/up_image.png",
			title: "上传图片",
			func: function() {
				if(filter.fileNo >= 30) {
					mui.toast("上传文件不得超过30个！");
					filter.isShow = false;
					return;
				}
				gallery.getMultiplePic(30 - filter.fileNo, function(paths) {
					console.log("要传递的数据：" + JSON.stringify(paths));
					filter.fireData(paths);
				});
			},
			type: 2 //2为android&&ios
		}, {
			icon: "../../image/cloud/up_video.png",
			title: "上传视频",
			func: function() {
				if(filter.fileNo >= 30) {
					mui.toast("上传文件不得超过30个！");
					filter.isShow = false;
					return;
				}
				Gallery.pickVideo(function(videoInfo) {
					JSON.stringify("要传递的视频信息：" + JSON.stringify(videoInfo));
					videoInfo.wd.close();
					filter.fireData([videoInfo.path]);
				})
			},
			type: 2
		}, {
			icon: "../../image/cloud/up_local.png",
			title: "本地上传",
			func: function() {
				events.openNewWindow("storage_upload.html");
			},
			type: 1 //1为安卓
		}],
		isShow: false,
		filterContainer: {
			position: "fixed",
			top: "0px",
			bottom: "0px",
			left: "0px",
			width: "100%",
			zIndex: 999,
			backgroundColor: "white"
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
			console.log("放置数据")
			var div = document.getElementById("filter");
			var ul = document.createElement("ul");
			ul.innerHTML = '<filter-item v-for="item of options" v-bind:option="item" v-if="cellIsShow(item)" ></filter-item>';
			div.appendChild(ul);
		},
		fireData: function(fileArr) {
			if(plus.webview.currentWebview().id !== "storage_upload_choose.html") {
				events.fireToPageWithData("storage_upload_choose.html", "chose-files", fileArr);
			} else {
				events.fireToPageNone("storage_upload_choose.html", "chose-files", fileArr);
			}
			this.isShow = false;
		},
		cellIsShow: function(cell) {
			switch(cell.type) {
				case 0:
					if(mui.os.ios) {
						return true;
					}
					return false;
				case 1:
					if(mui.os.android) {
						return true;
					}
					return false;
				case 2:
					if(mui.os.ios || mui.os.android) {
						return true;
					}
					return false;
				default:
					return false;
			}
		}
	}
})