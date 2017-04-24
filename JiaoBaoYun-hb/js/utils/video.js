var video=(function(mod){
	mod.playInAndroid=function(videoAddress){
		if(plus.os.android){
			var Intent=plus.android.importClass("android.content.intent");
			var Uri=plus.android.importClass("android.net.uri");
			var main=plus.android.runtimeMainActivity();
			var intent=new Intent(Intent.ACTION_VIEW);
			var uri=Uri.parse(videoAddress);
			intent.setDataAndType(uri,"video/*");
			main.startActivity(intent);
		}else{
			console.log("这里不是android,调用错误");
		}
	}
	return mod;
})(video||{})
