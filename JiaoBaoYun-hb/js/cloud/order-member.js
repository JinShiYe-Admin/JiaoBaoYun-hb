mui.init();
mui(".mui-scroll-wrapper").scroll();
mui.plusReady(function(){
	setListeners();
})
function setListeners(){
	mui(".mui-slider-item.mui-control-content").on("tap",".deal-button",function(){
		this.disabled=true;
		var type=document.querySelector(".mui-slider-indicator.mui-segmented-control").querySelector(".mui-active").value;
		console.log("订购的会员类型："+type)
		events.singleWebviewInPeriod(this,"member-pay.html",{
			memberName:'普通会员',
			memberTime:'3个月',
			memberPay:'12'
		})
	})
}
