var showAll = new Vue({
	el: '#show-all',
	data: {
		listData: []
	},
	methods: {
		resetData: function() {
			this.listData = [];
		},
		getBackImg:function(item,index){
			if(item.EncImgAddr){
				return item.EncImgAddr.split('|')[0]
			}
			if(parseInt(index)>0){
				return '../../image/show/show-default-small.png';
			}
			return '../../image/show/show-default-large.png';
		},
		jumpToPage: function() {

		}
	}
})