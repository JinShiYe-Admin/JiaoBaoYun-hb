/**
 * @author an
 * 轮播图  加载图片
 * @param {Object} imgUrls
 */
var addImg=function(imgUrls,titles){
	var group=document.body.querySelector(".mui-slider-group,.mui-slider-loop")
	addDiv(imgUrls[imgUrls.length-1],titles[titles.length-1],group)
	imgUrls.forEach(function(imgUrl,index,imgUrls){
		var div=document.createElement('div');
		div.className="mui-slider-item"
		div.innerHTML='<a href="#">'
		      	+'<img src="'+imgUrl+'">'
		      	 +'<p class="mui-slider-title">'+titles[index]+'</p>'
		      +'</a>'
		group.appendChild(div);
	})
	addDiv(imgUrls[0],titles[0],group)
}
/**
 * 加载底部条状物
 * @param {Object} imgUrls
 */
var addStrip=function(imgUrls){
	var strip=document.body.querySelector(".mui-slider-indicator,.mui-text-right");
	for(i=0;i<imgUrls.length;i++){
		var div=document.createElement('div');
		if(i==0){
			div.className="mui-indicator mui-active"
		}else{
			div.className="mui-indicator"
		}
		strip.appendChild(div);
	}
}
/**
 * 加载第一条和最后一条数据
 * @param {Object} imgUrl
 * @param {Object} group
 */
var addDiv=function(imgUrl,title,group){
	var div=document.createElement('div');
	div.className="mui-slider-item mui-slider-item-duplicate"
		div.innerHTML='<a href="#">'
		        +'<img src="'+imgUrl+'">'
		        +'<p class="mui-slider-title">'+title+'</p>'
		      +'</a>';
	group.appendChild(div);
}
/**
 * 这个其实没啥用
 */
var getImgArray=function(){
	var imgArray=new Array();
	imgArray.push("../image/home/u292.png")
	imgArray.push("../image/home/u296.png")
	imgArray.push("../image/home/u298.png")
	return imgArray;
}
