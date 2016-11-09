

mui.init({
	swipeBack: false
});
(function($) {
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	var unfinish=document.getElementById('div-unfinish');
	var unfinishInner = '<ul id="unfinish-list" class="mui-table-view"></ul>';
	document.getElementById('slider').addEventListener('slide', function(e) {
		if (e.detail.slideNumber === 1) {
			if (unfinish.querySelector('.mui-loading')) {
				setTimeout(function() {
					unfinish.querySelector('.mui-scroll').innerHTML = unfinishInner;
				}, 500);
			}
		}
	});
})(mui);
