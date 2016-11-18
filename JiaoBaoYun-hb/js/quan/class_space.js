 var class_space=(function(mod){

	/**
	 * 
	 * @param {Object} postData
	 * @param {Object} pageIndex
	 * @param {Object} pageSize
	 * @param {Object} callback
	 */
	mod.getList=function(postData,pageIndex,pageSize,callback){
		postData.pageIndex=pageIndex;
		postData.pageSize=pageSize;
		var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING)
		postDataPro_getClassSpacesByUserForClass(postData,wd,function(pagedata){
			wd.close();
			callback(pagedata);
		})
	}
	/**
	 * 
	 * @param {Object} list
	 */
	mod.createListView=function(list){
		if(list.Data){
			mod.totalPagNo=list.TotalPage;
			console.log(JSON.stringify(list))
			var container=document.getElementById('classSpace_list');
			list.Data.forEach(function(cell,index,data){
				var li=document.createElement('li');
				getPersonalImg(cell,li,container);
			}) 
		}else{
			
		}
	}
	mod.createInnerHtml=function(item){
		var inner='<div class="mui-pull-left head-img" >'
		   			+'<img src="'+item.PublisherId+'"/>'
		   			+'<p>'+item.name+'</p>'
		   			+'</div>'
		   			+'<div class="chat_content_left mui-pull-right">'
			   			+'<div class="chat-body">'
			   			+item.word+'<br/>'
			   			+createImgsInner(item)
			   			+'</div>'+'<div>'+'<p>'+item.PublishDate+'<font style ="padding:20px">'+'浏览(10人)'+'</font>'+'点赞(20人)'+'</p>'+'</div/>'
		   			+'</div>';
		return inner;
	}
	var getPersonalImg=function(cell,li,container){
		var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING)
		postDataPro_PostUinf({vvl:cell.PublisherId},wd,function(pInfo){
			wd.close();
			cell.publisherImg=pInfo.uimg;
			cell.publisherName=pInfo.uname;
			li.innerHTML=createInnerHtml(cell);
			container.appendChild(li);
		})
	}
	var createImgsInner=function(cell){
		var imgInner='';
		var percent=0.00;
		cell.EncImgAddr.split('|').forEach(function(img,ind,extras){
			if(extras.length<=3&&extras.length>0){
				percent=100/(extras.length)
			imgInner+='<img src="'+img+'" style="width:'+percent+'%;padding:2px"/>'
				}else{
			imgInner+='<img src="'+img+'" style="width:33.33333333%; padding:2px"/>'
			}
		});
		console.log(imgInner) 
		return imgInner;
	}
	return mod;
})(class_space||{});
var pageIndex=0;
var pageSize=10;
events.initRefresh('classSpace_list',
		function(){
			pageIndex=0;
//			class_space.createListView(class_space.createList(class_space.createData(),5));
		},
		function(){
			if(pageIndex>=class_space.totalPagNo){
				
			}else{
				pageIndex++;
//				class_space.createListView(class_space.createList(class_space.createData(),5));
			}
		});
//		mui.plusReady(function(){
//			console.log("出啥问题啦")
//			class_space.createListView(class_space.createList(class_space.createData(),5));
//		})
		
mui.plusReady(function(){
	var postData=plus.webview.currentWebview().data;
	console.log('班级空间获取值：'+JSON.stringify(postData))
	class_space.getList(postData,pageIndex,pageSize,class_space.createListView);
	
});