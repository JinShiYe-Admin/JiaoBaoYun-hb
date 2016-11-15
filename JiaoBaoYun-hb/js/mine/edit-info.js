mui.init();
mui.plusReady(function(){
	//获取个人信息
	var pInfo=myStorage.getItem(storageKeyName.PERSONALINFO);
	console.log(JSON.stringify(pInfo))
	var uimg=document.getElementById('uimg');
	var unick=document.getElementById('unick');
	var usexMale=document.getElementById('male');
	var usexFemale=document.getElementById('female');
	var utxt=document.getElementById('utxt');
	var uemail=document.getElementById('uemail');
		if(pInfo.uimg){
			uimg.src=pInfo.uimg
		}
		if(pInfo.unick){
			unick.value=pInfo.unick;
		}
		if(pInfo.usex){
			usexMale.checked='checked'
		}else{
			usexFemale.checked='checked'
		}
		if(pInfo.utxt){
			utxt.value=pInfo.utxt;
		}
		if(pInfo.uemail&&pInfo.uemail!=''){
			uemail.innerText=pInfo.uemail;
		}
		
	
		events.addTap('submit',function(){
			var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
			console.log(uimg.src+','+unick.value+',0,'+utxt.value+','+uemail.value)
			postDataPro_PostReUinf({vtp:'unick',vvl:unick.value},wd,
			function(data){
				wd.close();
				console.log(JSON.stringify(data))
			})
		})
		events.addTap('cancel',function(){
			mui.back()
		})
})
