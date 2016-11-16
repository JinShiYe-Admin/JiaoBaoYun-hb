mui.init();
mui.plusReady(function(){
	//获取个人信息
	var pInfo=myStorage.getItem(storageKeyName.PERSONALINFO);
	console.log(JSON.stringify(pInfo))
		var usex=document.getElementById('sex');
	changeInfo(pInfo);
	
	document.getElementById('sex-container').addEventListener('tap', function(){
//			console.log( "User pressed: "+e.index );
		plus.nativeUI.actionSheet( {title:"请选择性别",cancel:"取消",buttons:[{title:"男"},{title:"女"}]}, function(e){
			console.log( "User pressed: "+e.index );
			if(e.index>1){
				postSex(e.index-1,function(data){//回调函数
					if(data.RspCode=='0000'){//成功
						if(e.index==1){
							usex.innerText='男'
						}else{
							usex.innerText='女'
						}		
					}else{
						mui.toast(data.RspTxt)
					}
				})
			}
			
				
		} );
	})
		/**
		 * 拍照
		 */
		events.addTap('take-pic',function(){
			camera.getPic(camera.getCamera(),function(picPath){
				console.log(picPath);
				getFileByPath(picPath)
			})
		})
		/**
		 * 打开相册
		 */
		events.addTap('open-album',function(){
			gallery.getSinglePic(function(picPath){
				getFileByPath(picPath)
			})
		})
		//监听事件 传值 打开新页面 
		mui('.mui-table-view').on('tap','.open-newPage',function(){
			events.openNewWindowWithData('edit-info.html',parseInt(this.getAttribute('pos')))
		})
		window.addEventListener('infoChanged',function(){
			pInfo=myStorage.getItem(storageKeyName.PERSONALINFO);
			changeInfo(pInfo)
		})
		
})
var postSex=function(index,callback){
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostReUinf({vtp:"usex",vvl:index+''},wd,function(data){
		wd.close()
		console.log(data.toString())
		console.log(JSON.stringify(data));
		callback(data);
	})
}
var changeInfo=function(pInfo){
	var account=document.getElementById('account')
	var uimg=document.getElementById('img');
	var unick=document.getElementById('nick');
	var usex=document.getElementById('sex');
	var utxt=document.getElementById('txt');
	var uemail=document.getElementById('email');
	var uphone=document.getElementById('phone'); 
		if(pInfo.uimg){
			uimg.src=pInfo.uimg
		}
		if(pInfo.uid){
			account.innerText=pInfo.uid;
		}
		if(pInfo.unick){
			unick.innerText=pInfo.unick;
		}
		if(pInfo.usex=='0'){
			usex.innerText='男'
		}else{
			usex.innerText='女'
		}
		if(pInfo.utxt){
			utxt.innerText=pInfo.utxt;
		}
		if(pInfo.uemail&&pInfo.uemail!=''){
			uemail.innerText=pInfo.uemail;
		}
		
	}
var getFileByPath=function(path){
	load.createUpload('o9u2jsxjm.bkt.clouddn.com',path)
//		plus.io.resolveLocalFileSystemURL(path,function(entry){
//			console.log(entry.name)
//			console.log(entry.isFile)
//		},function(e){
//			console.log(e.message)
//		})
	}
