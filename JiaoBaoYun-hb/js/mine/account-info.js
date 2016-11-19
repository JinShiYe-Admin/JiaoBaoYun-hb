/**
 * 账户信息js
 */
mui.init();
mui.plusReady(function(){
	//获取个人信息
	var pInfo=myStorage.getItem(storageKeyName.PERSONALINFO);
	//展示个人信息
	changeInfo(pInfo);
	//获取性别控件
	var usex=document.getElementById('sex');
	document.getElementById('sex-container').addEventListener('tap', function(){
//		console.log( "User pressed: "+e.index );
		plus.nativeUI.actionSheet( {title:"请选择性别",cancel:"取消",buttons:[{title:"男"},{title:"女"}]}, function(e){
			console.log( "User pressed: "+e.index );
			if(e.index>0){
				postSex(e.index-1,function(data){//回调函数
					if(data.RspCode=='0000'){//成功
						if(e.index==1){
							usex.innerText='男';
						}else{
							usex.innerText='女';
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
		console.log(JSON.stringify(data));
		callback(data);
	})
}
/**
 * 界面显示个人信息
 * @param {Object} pInfo
 */
var changeInfo=function(pInfo){
	var account=document.getElementById('account')
	var uimg=document.getElementById('img');
	var unick=document.getElementById('nick');
	var utxt=document.getElementById('txt');
	var uemail=document.getElementById('email');
//	var uphone=document.getElementById('phone'); 
	var usex=document.getElementById('sex');
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
		if(pInfo.uemail){
			uemail.innerText=pInfo.uemail;
		}
		
	}
var getFileByPath=function(path){
//	mui.ajax('http://192.168.0.178:8507/QiuToken.ashx')

	mui.ajax("http://192.168.0.178:8507/QiuToken.ashx", {
					async: false,
//					data: getUpTokenData,
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					headers: {
						'Content-Type': 'application/json'
					},
					success: function(data) {
						//服务器返回响应，根据响应结果，分析是否登录成功；
						uptoken = data.uptoken;
						console.log('获取七牛上传token成功：'+uptoken);
						load.createUpload('http://o9u2jsxjm.bkt.clouddn.com/',[path],'text.jpg',uptoken)
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						console.log('获取七牛上传token失败：' + type);
					}
				});
	
//		plus.io.resolveLocalFileSystemURL(path,function(entry){
//			console.log(entry.name)
//			console.log(entry.isFile)
//		},function(e){
//			console.log(e.message)
//		})
	}
