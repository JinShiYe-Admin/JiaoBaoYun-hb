var scieduList = new Vue({
	el: "#sciedu-list",
	data: {
		cityInfo: {},
		pageInfo: {
			pageIndex: 1,
			totalPage: 0
		},
		listData: [], //列表数据
		isSwiping: false,
		isDetailReady: false,
		imgsStyle: {}
	},
	watch: {
		listData: function(val, pre) {
			console.log("sciedu-list获取的新值：", val);
		},
		cityInfo: function(val, pre) {
			scieduList.resetPageInfo();
			scieduList.requireListData();
		}
	},
	methods: {
		resetData: function() { //重置数据
			this.listData = [];
		},
		resetPageInfo: function() {
			this.pageInfo = {
				pageIndex: 1,
				totalPage: 0
			}
		},
		requireListData: function(callback) { //请求数据
			var pageInfo = this.pageInfo;
			postDataPro_PostTnews({
				top: 10,
				vvl: this.cityInfo.acode,
				vvl1: pageInfo.pageIndex
			}, null, function(data) {
				console.log("sciedu-list界面获取的数据：", data);
				if(data.RspCode == 0) {
					if(pageInfo.pageIndex === 1) {
						scieduList.resetData();
					}
					scieduList.pageInfo.pageIndex++;
					pageInfo.totalPage = data.RspData.pg.PageCount;
					scieduList.listData = scieduList.listData.concat(scieduList.rechargeList(data.RspData.dt));
					console.log("sciedu-list显示的最终值：", scieduList.listData);
				} else {
					scieduList.listData = [];
				}
				scieduList.isSwiping = false;
				if(callback) {
					callback();
				}
			})
		},
		rechargeList: function(list) {
			return list.map(function(item, index) {
				item.imgs = scieduList.getImgs(item);
				item.tips = scieduList.getTips(item);
				if(item.imgs.length === 1) {
					item.isFlex = true;
				} else {
					item.isFlex = false;
				}
				return item;
			});
		},
		//获取是否已读
		getReaded: function(item) {
			if(events.isExistInStorageArray(storageKeyName.SCIEDUREADED, item.tabid)[1] >= 0) {
				item.isReaded = true;
			}
		},
		//设置是否已读
		setReaded: function(item) {
			item.isReaded = true;
			events.toggleStorageArray(storageKeyName.SCIEDUREADED, item.tabid, false);
		},
		//展示详情
		showDetail: function(item) {
			scieduList.setReaded(item);
			
			events.readyToPage(this.isDetailReady, "sciedu_show_main.html", "scieduItemInfo", mui.extend({},item,this.cityInfo));
		},
		getImgs: function(item) {
			if(!item.timgs) {
				return [];
			}
			var imgs = item.timgs.split("|");
			imgs = imgs.map(function(img, index) {
				return img.replace(/^~\//, storageKeyName.MAINEDU);
			})
			if(imgs.length < 3) {
				imgs = [imgs[0]];
			} else if(imgs.length > 3) {
				imgs.splice(3);
			}
			console.log("sciedu-list获取的图片地址：", imgs);
			return imgs;
		},
		getTips: function(item) {
			var tips = item.tips.split("|");
			tips[0] = events.shortForDate(tips[0]);
			return tips.reverse().join('|');
		},
		getImgsStyle: function() {
			var winWidth = document.body.clientWidth;
			this.imgsStyle = {
				width: winWidth / 3 - 30,
				height: (winWidth / 3 - 30) * 0.6
			}
		}
	}
})