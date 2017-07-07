Vue.component('detail-img', {
	props: ['imgs'],
	template: '<div v-if="imgs&&imgs.length>0"><div v-for="img of imgs"></div></div>',
	methods: {

	}
})

var commentList = new Vue({
	el: '#show-detail',
	data: {
		showDetail: {
			Comments: []
		}
	},
	created: function() {

	},
	methods: {
		getImgs: function(showDetail) {
			var imgs = [];
			switch(showDetail.EncTypeStr) {
				case 1: //图片
				case 2: //视频
					imgs = commentList.getImgs(showDetail, showDetail.EncTypeStr);
					break;
				case 3: //文字
					break;
				case 4: //音频
					break;
				case 5: //图文混排
					imgs = commentList.getImgs(showDetail, showDetail.EncTypeStr);
					break;
				default:
					break;
			}
			console.log("获取的图片地址："+JSON.stringify(imgs));
			return imgs;
		},
		splitImgs: function(showDetail, type) {
			var imgs = [];
			var encImgs = showDetail.EncImgAddr.split('|');
			var encAddrs = showDetail.EncAddr.split('|');
			for(var i in encImgs) {
				if(i == 0) {
					type = commentList.getFileType(encImgs[0]);
				}
				imgs.push({
					encImg: encImgs[i],
					encAddr: encAddrs[i],
					type: type
				});
			}
			return imgs;
		},
		getFileType: function(addr) {
			var type = 0;
			var suffix = addr.split('.')[addr.split('.').length - 1];
			switch(suffix) {
				case 'mp4':
				case 'MP4':
					type = 2; //视频
					break;
				case 'mp3':
				case 'MP3':
					type = 4; //音频
					break;
				default:
					type = 1; //图片
					break;
			}
			return type;
		}
	}
})