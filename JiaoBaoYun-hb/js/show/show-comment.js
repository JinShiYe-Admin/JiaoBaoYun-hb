Vue.component('detail-img', {
	props: ['imgs'],
	template: '<div v-if="imgs.length>0"><div v-for="img of imgs"></div></div>',
	methods: {

	}
})
Vue.component('comment-reply', {
	props: ['replies'],
	template: '<div><div v-for="(reply,index) of replies" v-on:longTap="delete(index)"><p><span>reply.name<span></p></div></div>',
	//	data: getData() {
	//		return {
	//
	//		}
	//	},
	methods: {
		deleteReply: function(index) {
			events.showActionSheet([{
				title: "删除",
				dia: 1
			}], [function() {
				this.replies.splice(index, 1);
			}])
		}
	}
})
Vue.component('comment-list', {
	props: ['comments'],
	template: '<div v-if="comments&&comments.length>0"><div v-for="(comment,index) of comments"><slot v-on:relies="comment.replies"></slot></div></div>',
	methods: {
		togglePraise: function() {

		},
		deleteComment: function(index) {
			events.showActionSheet([{
				title: "删除",
				dia: 1
			}], [function() {
				this.comments.splice(index, 1);
			}])
		}
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