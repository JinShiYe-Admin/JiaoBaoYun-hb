var teaWork=(function(mod){
	mod.addClasses=function(classes){
		var tabs=document.getElementById('scroll-class');
		classes.forEach(function(className,i,classes){
			var a=document.createElement('a')
			a.className='mui-control-item';
			a.innerText=className;
			tabs.appendChild(a);
		})
		tabs.firstElementChild.className="mui-control-item mui-active";
	}
	return mod;
})(teaWork||{})
