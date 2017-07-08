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
			IsFocused: 0, //是否关注
			IsLike: 0, //是否点赞
			Comments: [] //评论列表
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
			console.log("获取的图片地址：" + JSON.stringify(imgs));
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
		},
		getSimpleDate: function(date) {
			return events.shortForDate(date);
		},
		//是否已关注
		toggleFocus: function() {
			if(events.getUtid()) {
				console.log("获取当前状态：" + this.showDetail.IsFocused);
				var wd = events.showWaiting();
				var showDetail = this.showDetail;
				postDataPro_setUserFocus({
					userId: events.getUtid(),
					focusId: showDetail.PublisherId,
					status: showDetail.IsFocused ? 0 : 1
				}, wd, function(data) {
					wd.close();
					console.log("设置关注返回值：" + JSON.stringify(data));
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							events.fireToPageWithData('show-home1.html', "focus");
							console.log("改变的值：" + JSON.stringify(showDetail));
							if(showDetail.IsFocused) {
								showDetail.IsFocused = 0;
							} else {
								showDetail.IsFocused = 1;
							}
						}
					} else {
						mui.toast(data.RspTxt);
					}
				});
			} else { //游客
				events.toggleStorageArray(storageKeyName.SHOWFOCUSEPERSEN, this.showDetail.PublisherId, this.showDetail.IsFocused);
				this.showDetail.IsFocused = !this.showDetail.IsFocused;
				events.fireToPageWithData('show-home1.html', "focus");
			}
		},
		//是否已点赞
		toggleLike: function() {
			if(!events.getUtid()) {
				events.judgeLoginMode();
				return;
			}
			var wd = events.showWaiting();
			var showDetail = this.showDetail;
			var comData = {
				userSpaceId: showDetail.TabId,
				userId: events.getUtid()
			}
			if(showDetail.IsLike) {
				postDataPro_delUserSpaceLikeByUser(comData, wd, function(data) {
					console.log("用户取消点赞结果：" + JSON.stringify(data));
					wd.close();
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							showDetail.IsLike = 0;
							mui.toast("您已取消点赞！");
							this.showDetail.LikeUsers.splice(commentList.getIndexInLikeUsers(),1);
						}
					} else {
						mui.toast(data.RspTxt);
					}
				})
			} else {
				postDataPro_setUserSpaceLikeByUser(comData, wd, function(data) {
					console.log("用户空间点赞结果：" + JSON.stringify(data));
					wd.close();
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							showDetail.IsLike = 1;
							mui.toast("点赞成功！")
							this.showDetail.LikeUsers.push({
								userId:events.getUtid(),
								userName:myStorage.getItem(storageKeyName.PERSONALINFO).uname
							})
						}
					} else {
						mui.toast(data.RspTxt);
					}
				})
			}
		},
		getIndexInLikeUsers: function() {
			var likers = this.showDetails.LikeUsers;
			for(var i in likers) {
				if(likers[i].userId===events.getUtid()){
					return parseInt(i);
				}
			}
		},
		//打开跳转页面
		openComment: function() {

		},
		//打开个人主页
		openPersonSpace: function() {
			events.openNewWindowWithData()
		},
		showSheet: function(comment, index0, index1) {
			events.showActionSheet([{
				title: '删除',
				dia: 1
			}], [function() {
				commentList.delComment(comment, index0, index1);
			}])
		},
		//删除评论
		delComment: function(comment, index0, index1) {
			var showDetails = this.showDetail;
			var wd = events.showWaiting();
			postDataPro_delUserMsgById({
				userMsgId: comment.TabId
			}, wd, function(data) {
				wd.close();
				console.log("删除留言后的数据：" + JSON.stringify(data))
				if(data.RspCode == 0) {
					if(data.RspData.Result) {
						if(typeof(index1) === 'number') {
							showDetails.Comments[index0].Replys.splice(index1, 1);
						} else {
							showDetails.Comments.splice(index0, 1);
						}
					}
				} else {
					mui.toast(data.RspTxt);
				}
			})
		}
	}
})