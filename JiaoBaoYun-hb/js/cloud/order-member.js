mui.init();
mui(".mui-scroll-wrapper").scroll();
mui.plusReady(function(){
	setListeners();
})
function setListeners(){
	mui(".mui-slider-item.mui-control-content").on("tap",".deal-button",function(){
		this.disabled=true;
		events.singleWebviewInPeriod(this,"member-pay.html",{
			memberName:'普通会员',
			memberTime:'3个月',
			memberPay:'12'
		})
	})
}
