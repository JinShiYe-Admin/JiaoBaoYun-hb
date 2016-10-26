/**
 * @author an
 * 轮播图  加载图片
 * @param {Object} imgUrls
 */
var  carousel=(function(mod){
	mod.createList=function(imgUrls,titles,words){
		var data=new Array();
		imgUrls.forEach(function(imgUrl,index){
			if(words){
				data.push(createItem(imgUrl,titles[index],words[index]));
			}else{
				data.push(createItem(imgUrl,titles[index]));
			}
			
		})
		return data;
	}
	createItem=function(img,title,word){
		var item=new Object();
		item.imgUrl=img;
		item.title=title;
		if(word){
			item.word=word;
		}
		return item;
	}
	mod.createView=function(data){
		var group=document.body.querySelector(".mui-slider-group,.mui-slider-loop");
		addDiv(group,data[data.length-1]);
		data.forEach(function(item,index){
			var div=document.createElement('div');
			div.className="mui-slider-item"
			createInner(item,div);
			group.appendChild(div);
		})
		addDiv(group,data[0]);
	}
	var addDiv=function(group,item){
		var div=document.createElement('div');
		div.className="mui-slider-item mui-slider-item-duplicate"
		createInner(item,div);
		group.appendChild(div);
	}
	var createInner=function(item,div){
		if(item.word){
			div.innerHTML=createWordsInner(item);
		}else{
			div.innerHTML=createImgInner(item);
		}
	}
	var createImgInner=function(item){
		var innerHTML='<a href="#">'
			        +'<img src="'+item.imgUrl+'">'
			        +'<p class="mui-slider-title">'+item.title+'</p>'
			      +'</a>';
		return innerHTML;		      
	}
	var createWordsInner=function(item){
	return	'<a href="#">'
			        +'<img src="'+item.imgUrl+'" class="mui-pull-right">'
			        +item.title
			        +'<p>'+item.word+'</p>'
			      +'</a>';
	}
	return mod;
})(window.carousel||{})
var addImg=function(imgUrls,titles){
	var group=document.body.querySelector(".mui-slider-group,.mui-slider-loop")
	addDiv(imgUrls[imgUrls.length-1],titles[titles.length-1],group)
	imgUrls.forEach(function(imgUrl,index,imgUrls){
		var div=document.createElement('div');
		div.className="mui-slider-item"
		div.innerHTML=createImgInner(imgUrl,titles[index])
		group.appendChild(div);
	})
	addDiv(imgUrls[0],titles[0],group)
}
//var createImgInner=function(imgUrl,title){
//	var innerHTML='<a href="#">'
//		        +'<img src="'+imgUrl+'">'
//		        +'<p class="mui-slider-title">'+title+'</p>'
//		      +'</a>';
//	return innerHTML;		      
//}
///**
// * 加载底部条状物
// * @param {Object} imgUrls
// */
//var addStrip=function(imgUrls){
//	var strip=document.body.querySelector(".mui-slider-indicator,.mui-text-right");
//	for(i=0;i<imgUrls.length;i++){
//		var div=document.createElement('div');
//		if(i==0){
//			div.className="mui-indicator mui-active"
//		}else{
//			div.className="mui-indicator"
//		}
//		strip.appendChild(div);
//	}
//}
///**
// * 加载第一条和最后一条数据
// * @param {Object} imgUrl
// * @param {Object} group
// */
//var addDiv=function(imgUrl,title,group){
//	var div=document.createElement('div');
//	div.className="mui-slider-item mui-slider-item-duplicate"
//	div.innerHTML=createImgInner(imgUrl,title);
//	group.appendChild(div);
//}


