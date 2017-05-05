var video=(function(mod){
	mod.playInAndroid=function(videoAddress){
		if(mui.os.android){
			var Intent=plus.android.importClass("android.content.Intent");
			var Uri=plus.android.importClass("android.net.Uri");
			var main=plus.android.runtimeMainActivity();
			var intent=new Intent(Intent.ACTION_VIEW);
			var uri=Uri.parse(videoAddress);
			intent.setDataAndType(uri,"video/*");
			main.startActivity(intent);
		}else{
			console.log("这里不是android,调用错误");
		}
	}
	mod.playInHTML=function(videoPath,thumbPath){
		var player=document.getElementById("video-player");
		player.src=videoPath;
		player.poster=thumbPath;
		mui("#pop-video").popover("show");
		player.autoplay="autoplay";
	}
	mod.stopPlayInHTML=function(){
		var player=document.getElementById("video-player");
		player.pause();
//		player.src="";
//		player.poster="";
//		player.removeAttribute("autoplay");
	}
	mod.playVideo=function(videoPath,thumbPath){
		if(plus.os.name=="Android"){
			mod.playInAndroid(videoPath,thumbPath);
		}else{
			mod.playInHTML(videoPath,thumbPath);
		}
	}
	mod.initVideo=function(){
		var content=document.body;
		console.log("******************加载video标签"+document.body.className);
		
		var win_width=content.clientWidth;
		var div=document.createElement("div");
		div.className="mui-popover";
		div.id="pop-video";
		div.innerHTML='<video id="video-player" style="width:'+win_width+'px;height:'+win_width/4*3+
			'px;">your browser does not support the video tag</video>';
//		console.log("fragment.innerHTML"+fragment.innerHTML);
		content.insertBefore(div,content.querySelector(".mui-content"));
		console.log("加完标签后的内容："+content.innerHTML);
	}
	return mod;
})(video||{})
