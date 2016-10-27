var list=(function(mod){
	mod.createList=function(headImgs,names,questions,answers){
		var data=new Array();
		headImgs.forEach(function(img,i,imgs){
			data.push(img,names[i%names.length],questions[i%questions.length],answers[i%answers.length])
		})
		return data;
	}
	var item=new Object();
	var createItem=function(img,name,question,answer){
		item.headImg=img;
		item.name=name;
		item.question=question;
		item.answerDetail=answer;
		return item;
	}
	mod.createView=function(list){
		var list=mui('.mui-table-view');
		data.forEach(function(item,i,list){
			var li=document.createItem('li');
			li.className='mui-table-view-cell';
			li.innerHTML=createInner(item);
			list.appendChild(li);
		})
	}
	var createInner=function(item){
		 return '<div class="mui-pull-left head-img" >'
		   			+'<img src="'+item.headImg+'"/>'
		   			+'<p>'+item.name+'</p>'
	   			+'</div>'
	   			+'<div class="mui-pull-right">'
		   			+item.question.words;
		   			+createImgInner(item.question.imgs)
		   			+createAnswersInner(item.answerDetail);
	   			+'</div>'
		   			
	}
	var createImgInner=function(imgs){
		var imgInner='';
		imgs.forEach(function(img,i,imgs){
			if(imgs.length>3){
				imgInner+='<img style="width:33.333333333%;" src="'+img+'"/>'
			}else{
				imgInner+='<img style="width:'+100/imgs.length+'%;" src="'+img+'"/>';
			}
			
		})
		return imgInner;
	}
	var createAnswersInner=function(answerDetail){
		var answer=''
		answerDetail.forEach(function(answer,i,detail){
			answer+='<div class="chat_content_top">'
			   			+'<div class="chat-body">'
			   			+answer.name+"：回答"+answer.words+'<br/>'
			   			+createImgsInner(answer.imgs)
			   			+'</div>'
		   				+'</div>';
		})
	}
	return mod;
})(window.list||{})
