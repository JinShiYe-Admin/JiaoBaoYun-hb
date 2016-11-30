/**
 * 账户信息js
 */
mui.init();
mui.plusReady(function() {
	//获取个人信息
	var pInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
	//展示个人信息
	changeInfo(pInfo);
	//获取性别控件
	var usex = document.getElementById('sex');
	document.getElementById('sex-container').addEventListener('tap', function() {
		//		console.log( "User pressed: "+e.index );
		plus.nativeUI.actionSheet({
			title: "请选择性别",
			cancel: "取消",
			buttons: [{
				title: "男"
			}, {
				title: "女"
			}]
		}, function(e) {
			console.log("User pressed: " + e.index);
			if(e.index > 0) {
				postSex(e.index - 1, function(data) { //回调函数
					if(data.RspCode == '0000') { //成功
						if(e.index == 1) {
							usex.innerText = '男';
						} else {
							usex.innerText = '女';
						}
					} else {
						mui.toast(data.RspTxt)
					}
				})
			}

		});
	})

	/**
	 * 拍照
	 */
	//		events.addTap('take-pic',function(){
	//			camera.getPic(camera.getCamera(),function(picPath){
	//				console.log(picPath);
	//				getFileByPath(picPath)
	//			})
	//		})
	/**
	 * 打开相册
	 */
	//		events.addTap('open-album',function(){
	//			gallery.getSinglePic(function(picPath){
	//				getFileByPath(picPath)
	//			})
	//		})

	//监听事件 传值 打开新页面
	mui('.mui-table-view').on('tap', '.open-newPage', function() {
		events.openNewWindowWithData('edit-info.html', parseInt(this.getAttribute('pos')))
	});
	window.addEventListener('infoChanged', function() {
		pInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
		changeInfo(pInfo);
	});

	//---七牛上传头像---start---
	//获取个人信息
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
	var pickButtonId = 'img';
	var getUpTokenUrl = 'http://192.168.0.178:8507/GetTokenProfilePhoto.ashx'; //'http://192.168.0.178:8507/QiuToken.ashx';
	var filePath = 'headimge' + personalUTID + '.png';
	var getUpTokenData = {
		Key: filePath
	};
	var domain = 'http://oh2zmummr.bkt.clouddn.com/'; //'http://o9u2jsxjm.bkt.clouddn.com/';

	var auto = true;
	//设置上传的参数
	// 等待的对话框
	var wd = null;
	var uploader = Qiniu.uploader({
		runtimes: 'html5,flash,html4', // 上传模式，依次退化
		browse_button: pickButtonId, // 上传选择的点选按钮，必需
		// 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
		// 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
		// 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
		// uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
		// uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
		uptoken_func: function(file) { // 在需要获取uptoken时，该方法会被调用
			var uptoken = '';
			mui.ajax(getUpTokenUrl, {
				async: false,
				data: {
					Key: 'headimge' + personalUTID + '.png'
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				//							headers: {
				//								'Content-Type': 'application/json'
				//							},
				success: function(data) {
					//服务器返回响应，根据响应结果，分析是否登录成功；
					uptoken = data.uptoken;
					console.log('获取七牛上传token成功:' + uptoken);
					wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log('获取七牛上传token失败：' + type);
					mui.toast('上传出错');
					wd.close();
				}
			});
			return uptoken;
		},
		get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
		// downtoken_url: '/downtoken',
		// Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
		// unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
		//save_key: true, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
		domain: domain, // bucket域名，下载资源时用到，必需
		//container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
		max_file_size: '100mb', // 最大文件体积限制
		flash_swf_url: 'js/qiniu/Moxie.swf', //引入flash，相对路径
		max_retries: 0, // 上传失败最大重试次数
		dragdrop: false, // 开启可拖曳上传
		//drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
		chunk_size: '4mb', // 分块上传时，每块的体积
		auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
//		resize: {
//			width: 100,
//			height: 100,
//			crop: false,
//			quality: 90,
//			preserve_headers: true
//		},
		//x_vars : {
		//    查看自定义变量
		//    'time' : function(up,file) {
		//        var time = (new Date()).getTime();
		// do something with 'time'
		//        return time;
		//    },
		//    'size' : function(up,file) {
		//        var size = file.size;
		// do something with 'size'
		//        return size;
		//    }
		//},
		init: {
			'FilesAdded': function(up, files) {
				plupload.each(files, function(file) {
					// 文件添加进队列后，处理相关的事情
					console.log('---文件添加进队列后---');
				});
			},
			'BeforeUpload': function(up, file) {
				// 每个文件上传前，处理相关的事情
				console.log('---每个文件上传前---');
			},
			'UploadProgress': function(up, file) {
				// 每个文件上传时，处理相关的事情
				console.log('文件上传时：' + JSON.stringify(file));
				console.log('上传进度：' + file.percent);
			},
			'FileUploaded': function(up, file, info) {
				console.log('---上传成功---');
				console.log('file:' + JSON.stringify(file));
				console.log('info:' + info);

				//6.用户修改各项用户信息
				//调用方法
				var comData = {
					vtp: 'uimg', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件)
					vvl: domain + JSON.parse(info).key //对应的值
				};
				postDataPro_PostReUinf(comData, wd, function(data) {
					console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
					if(data.RspCode == 0) {
						mui.toast('上传成功');
						var myDate = new Date();
						document.getElementById("img").src = domain + JSON.parse(info).key + '?' + myDate.getTime();
						console.log('用户修改各项用户信息---成功');
					} else {
						mui.toast(data.RspTxt);
						console.log('用户修改各项用户信息---失败');
					}
					wd.close();
				});
			},
			'Error': function(up, err, errTip) {
				//上传出错时，处理相关的事情
				console.log('---上传出错---');
				console.log('err' + JSON.stringify(err));
				console.log('errTip' + JSON.stringify(errTip));
				mui.toast('上传出错');
				wd.close();
			},
			'UploadComplete': function() {
				//队列文件处理完毕后，处理相关的事情
				console.log('---队列文件处理完毕后---');
			},
			'Key': function(up, file) {
				// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
				// 该配置必须要在unique_names: false，save_key: false时才生效
				console.log('---Key---');
				var key = filePath;
				// do something with key here
				return key
			}
		}
	});
	//---七牛上传头像---end---

})

var postSex = function(index, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostReUinf({
		vtp: "usex",
		vvl: index + ''
	}, wd, function(data) {
		wd.close()
		console.log(JSON.stringify(data));
		callback(data);
	})
}

/**
 * 界面显示个人信息
 * @param {Object} pInfo
 */
var changeInfo = function(pInfo) {
	var account = document.getElementById('account')
	var uimg = document.getElementById('img');
	var unick = document.getElementById('nick');
	var utxt = document.getElementById('txt');
	var uemail = document.getElementById('email');
	//	var uphone=document.getElementById('phone');
	var usex = document.getElementById('sex');
	if(pInfo.uimg) {
		var myDate = new Date();
		uimg.src = pInfo.uimg + '?' + myDate.getTime();
	}
	if(pInfo.uid) {
		account.innerText = pInfo.uid;
	}
	if(pInfo.unick) {
		unick.innerText = pInfo.unick;
	}
	if(pInfo.usex == '0') {
		usex.innerText = '男'
	} else {
		usex.innerText = '女'
	}
	if(pInfo.utxt) {
		utxt.innerText = pInfo.utxt;
	}
	if(pInfo.uemail) {
		uemail.innerText = pInfo.uemail;
	}

}