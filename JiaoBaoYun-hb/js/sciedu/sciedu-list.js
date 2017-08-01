var scieduList = new Vue({
	el: "#sciedu-list",
	data: {
		cityInfo: {},
		pageInfo: {
			pageIndex: 1,
			totalPage: 0
		}
		listData: [] //列表数据
	},
	watch: {
		listData: function(val, pre) {

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
			postDataPro_PostTnews({
				top: 10,
				vvl: this.cityInfo.cityCode,
				vvl1: this.pageInfo.pageIndex
			}, null, function(data) {
				console.log("sciedu-list界面获取的数据：",data);
				if(data.RspCode == 0) {
					if(this.pageInfo.pageIndex === 1) {
						scieduList.resetData();
					}
					this.pageInfo.totalPage = data.RspData.pg.PageCount;
					this.listData = this.listData.concat(data.RspData.dt);
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
			events.toggleStorageArray(this.cityInfo.CityCode, item.tabid, false);
		},
		showDetail:function(item){
			scieduList.setReaded(item);
			events.readyToPage(this.isDetailReady,"sciedu_show_main.html","scieduItemInfo",item);
		}
	}
})