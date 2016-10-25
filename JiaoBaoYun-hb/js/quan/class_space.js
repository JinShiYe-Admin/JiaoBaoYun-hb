 var class_space=(function(){
	var createItem=function(data,i){
		var item=new Object();
		item.headImg=data.headImgs[i%data.headImgs.length];
		item.name=data.names[i%data.names.length];
		item.word=data.words[i%data.words.length];
		item.extra=data.extras[i%data.extras.length];
		item.time=data.times[i%data.times.length];
		item.visitTime=data.visitTimes[i%data.visitTimes.length];
		item.praiseTime=data.praiseTimes[i%data.praiseTimes.length];
		return item;
	}
	var createList=function(data,num){
		var list=new Array();
		for(i=0;i<num;i++){
			list.push(createItem(data,i))
		}
		return list;
	}
	var createListView=function(list){
		console.log(JSON.stringify(list))
		var container=document.getElementById('classSpace_list');
		list.forEach(function(cell,index,list){
			var li=document.createElement('li');
			li.innerHTML=createInnerHtml(cell);
			container.appendChild(li);
		})
	}
	var createInnerHtml=function(item){
		var inner='<div class="mui-pull-left head-img" >'
		   			+'<img src="'+item.headImg+'" style="width: 100%"/>'
		   			+'<p>'+item.name+'</p>'
		   			+'</div>'
		   			+'<div class="chat_content_left mui-pull-right">'
			   			+'<div class="chat-body">'
			   			+item.word+'<br/>'
			   			+createImgsInner(item.extra)
			   			+'</div>'
		   			+'</div>';
		return inner;
	}
	var createImgsInner=function(extras){
		var imgInner='';
		var percent=0.00;
		extras.forEach(function(img,ind,extras){
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
	var createData=function(){
		var data=new Object();
		data.headImgs=['../../image/quan/img0.jpeg','../../image/quan/img1.jpeg','../../image/quan/img2.jpg',
		'../../image/quan/img3.jpg','../../image/quan/img4.jpg','../../image/quan/img5.jpg','../../image/quan/img6.jpg'];
		data.names=['李星宇','陈飞','宋亚东'];
		data.words=['我校“正新杯”第三届“挑战你的说”大型心理演讲比赛决赛圆满结束，热烈庆祝我们班的张云同学取得本次大赛的冠军','今天的作业内容<ol><li>默写第三节课生字五遍</li><li>济南的冬天文章朗读，要注意有感情的读</li>'+
		'<li>帮父母洗脚,然后写心得体会</li><li>默写第三节课生字五遍</li></ol>','2016年9月16至19日，我校举办2016年度家长开放周活动。本次活动在学校各部门的通力合作、全体学社的配合下，请家长带领着自己的孩子在学校会堂中了解相关流程，参加相关活动'];
		data.extras=[['../../image/quan/u108.jpg','../../image/quan/u114.png','../../image/quan/u84.jpg'],[],['../../image/quan/u98.jpg']];
		data.times=['9月20日 17:30','9月20日 17:30','9月15日 17:30'];
		data.visitTimes=[10,11,12];
		data.praiseTimes=[6,9,18];
		return data;
	}
	return {
		createListView:createListView,
		createList:createList,
		createData:createData
	};
})()
