var scieduList = new Vue({
	el: "#sciedu-list",
	data: {
		cityInfo: {},
		pageInfo: {
			pageIndex: 1,
			totalPage: 0
		},
		listData: [], //列表数据
		isSwiping: false
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
						scieduList.isSwiping = false;
					}
					scieduList.pageInfo.pageIndex++;
					pageInfo.totalPage = data.RspData.pg.PageCount;
					scieduList.listData = scieduList.listData.concat(data.RspData.dt);
					console.log("sciedu-list显示的最终值：", scieduList.listData);
				} else {
					mui.toast("获取数据失败:" + data.RspTxt);
				}
				if(callback) {
					callback();
				}
			})
		},
		setReaded: function(item) {
			item.isReaded = true;
			events.toggleStorageArray(this.cityInfo.acode, item.tabid, false);
		},
		showDetail: function(item) {
			scieduList.setReaded(item);
			events.readyToPage(this.isDetailReady, "sciedu_show_main.html", "scieduItemInfo", item);
		},
		getImgs: function(item) {
			if(!item.timgs){
				return [];
			}
			var imgs = item.timgs.split("|");
			imgs = imgs.map(function(img, index) {
				return img.replace(/^~\//, storageKeyName.MAINEDU);
			})
			if(imgs.length<3){
				imgs=[imgs[0]];
			}else if(imgs.length>3){
				imgs.splice(3);
			}
			console.log("sciedu-list获取的图片地址：",imgs);
			return imgs;
		},
		getTips: function(item) {
			var tips = item.tips.split("|");
			tips[0]=events.shortForDate(tips[0]);
			return tips.reverse().join('|');
		}
	}
})