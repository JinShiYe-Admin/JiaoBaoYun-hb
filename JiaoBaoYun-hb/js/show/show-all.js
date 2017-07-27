var showAll = new Vue({
	el: '#show-all',
	data: {
		listData: [],
		detailReady:false
	},
	methods: {
		resetData: function() {
			this.listData = [];
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
			if(myStorage.getItem(storageKeyName.ISSHOWDETAILREADY)){
				events.fireToPageWithData("show-detail.html","showDetail",item);
			}else{
				setTimeout(function(){
					showAll.jumpToPage(item)
				},500);
			}
		}
	}
})