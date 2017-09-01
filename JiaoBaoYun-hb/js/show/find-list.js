Vue.component('find-list', {
	props: {
		findInfo: {
			type: Object
		}
	},
	template: '#show-list',
	data: function() {
		return {
			listData: [],
			showInfo: this.findInfo
		}
	},
	created: function() {
		this.showInfo.pageIndex = 1;
		//当创建时且确定为关注或全部时 请求数据
		this.requireData();
	},
	watch: {
		'$route' (to, from) {
			console.log("发现列表的路由变化的监听：" + this.$route.params.id);
			this.showInfo.pageIndex = 1;
			this.requireData();
		},
		listData: function(newVal, oldVal) {
			this.$nextTick(function() {
				jQuery('.news-img').lazyload();
			})
		}
	},
	methods: {
		resetData: function() {
			this.listData = [];
		},
		requireData: function() {
			var com = this;
			show_list.getShowList(this.showInfo, function(showCity, data) {
				console.log('获取的关注数据：', data);
				com.addData(showCity.pageIndex, data);
				com.showInfo.pageIndex++;
			}, function(err) {
				console.log("错误", err);
			})

		},
		addData: function(pageIndex, dataArr) {
			if(pageIndex == 1) {
				this.listData = [];
			}
			for(var i = 0; i < dataArr.length; i += 6) {
				this.listData.push(dataArr.slice(i, i + 6));
			}
		},
		getBackImg: function(item, index) {
			if(item.EncImgAddr) {
				return item.EncImgAddr.split('|')[0]
			}
			if(parseInt(index) > 0) {
				return '../../image/show/show-default-small.png';
			}
			return '../../image/show/show-default-large.png';
		},
		jumpToPage: function(item) {
			console.log("点击事件")
			if(myStorage.getItem(storageKeyName.ISSHOWDETAILREADY)) {
				events.fireToPageWithData("show-detail.html", "showDetail", item);
			} else {
				setTimeout(function() {
					showAll.jumpToPage(item)
				}, 500);
			}
		},
		isVideo: function(cell) {
			var isVideo = false;
			if(cell.EncType) {
				switch(cell.EncType) {
					case 2: //视频
						isVideo = true;
						break;
					case 5: //图文混合
						var addrs = cell.EncAddr.split(".");
						switch(addrs[addrs.length - 1]) {
							case "mp4":
							case "MP4":
								isVideo = true;
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			}
			return isVideo
		}
	}
})