Vue.component('detail-img', {
	props: ['imgs'],
	template: '<div v-if="imgs&&imgs.length>0">' +
		'<div v-for="img of imgs" v-bind:style="[imgStyle,backImgSty,{\'background-image\':\'url(img.encImg)\'}]"><img v-if="img.type==2" src="url(../../image/utils/playvideo.png)"></div></div>',
	data: function() {
		return {
			imgDivRe: this.getImgRe,
			backImgSty: {
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backGroundSize: 'cover'
			}
		}
	},
	methods: {
		getImgRe: function() {
			var winWidth = document.querySelector('.mui-content').clientWidth;
			var imgRe = {
				width: 0,
				height: 0
			};
			var imgWidth = 0;
			if(this.imgs < 3) {
				imgRe.width = winWidth / this.imgs.length;
				imgRe.height = winWidth * 0.45;
			} else {
				imgRe.width = winWidth / 3;
				imgRe.height = imgRe.width;
			}
			return imgRe;
		}
	}
})

var commentList = new Vue({
	el: '#show-detail',
	data: {
		showDetail: {
			IsFocused: 0, //是否关注
			IsLike: 0, //是否点赞
			Comments: [], //评论列表
			PublishDate: '1970-01-01 00:00:00'
		}
	},
	created: function() {

	},
	methods: {
		getImgs: function(showDetail) {
//			var showDetail=this.showDetail;
			var imgs = [];
			switch(showDetail.EncType) {
				case 1: //图片
				case 2: //视频
					imgs = commentList.splitImgs(showDetail, showDetail.EncType);
					break;
				case 3: //文字
					break;
				case 4: //音频
					break;
				case 5: //图文混排
					imgs = commentList.splitImgs(showDetail, showDetail.EncType);
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
			console.log("获取图片地址："+JSON.stringify(imgs));
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
							//							mui.toast("您已取消点赞！");
							showDetail.LikeUsers.splice(commentList.getIndexInLikeUsers(), 1);
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
							//							mui.toast("点赞成功！")
							console.log("获取的个人信息：" + JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)));
							showDetail.LikeUsers.push({
								userId: events.getUtid(),
								userName: myStorage.getItem(storageKeyName.PERSONALINFO).unick
							})
						}
					} else {
						mui.toast(data.RspTxt);
					}
				})
			}
		},
		getIndexInLikeUsers: function() {
			var likers = this.showDetail.LikeUsers;
			for(var i in likers) {
				if(likers[i].userId === events.getUtid()) {
					return parseInt(i);
				}
			}
		},
		//打开跳转页面
		openComment: function() {
			events.openNewWindowWithData('detail-comment.html', "");
		},
		//打开个人主页
		openPersonSpace: function(usrId) {
			mui.openWindow({
				url: "../quan/zone_main.html",
				id: "zone_main.html",
				style: {
					top: '0px',
					height: '0px'
				},
				extras: {
					data: usrId,
					NoReadCnt: 0,
					flag: 0
				},
				createNew:true
			})
		},
		openLikers:function(){
			events.fireToPageWithData("../quan/classSpace-persons.html","personsList",{
				userSpaceId:this.showDetail.TabId,
				type:3
			})
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