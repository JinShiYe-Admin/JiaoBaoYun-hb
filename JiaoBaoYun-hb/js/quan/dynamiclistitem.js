var dynamiclistitem = (function($, mod) {

	/**
	 * 增加一个动态
	 * @param {Object} ulElement 父元素
	 * @param {Object} data 动态的信息，一个数组，里面包含三组数组[[InfoList],[ImageList],[InteractionList]]
	 * @param {Object} id ID
	 * [InfoList]：[personalImage,personalName,time,contentText]个人头像，姓名，发布时间，动态内容的文字
	 * [ImageList]：[[ImageUrlList],ImageNum]动态内容的图片路径数组,图片总数量
	 * [InteractionList]：[introduce，viewCount，[praiseList],[commentList]]信息说明，浏览次数，点赞列表数组，评论列表数组
	 * [commentList]:评论列表1.评论[commenter,content]，评论者，评论内容
	 * 						2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容
	 */
	mod.addItem = function(ulElement, data, id) {
		var li = document.createElement('li');
		li.id = id;
		li.className = 'mui-table-view-cell';

		mod.addInfo(ulElement, li, data, id); //增加动态的个人信息和内容
	};

	/**
	 * 增加动态的个人信息和内容
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInfo = function(ulElement, liElement, data, id) {
		var closeempty = '';
		var InfoList = data[0]; //[personalImage,personalName,time,contentText]个人头像，姓名，发布时间，动态内容的文字
		if(pageFlag == 0) {
			if(personalUTID == publisherId) {
				closeempty = '<a id ="delete' + id + '" class="mui-icon mui-icon-closeempty mui-pull-right" ></a>';

			} else {
				closeempty = '';
			}
		}else{
			if(InfoList[4]==0){
				closeempty ='<button id="btn-focus'+data[4] + idFlag + id+'" type="button" class="mui-btn mui-pull-right btn-attention" style="width: 70px;">关注</button>'
			}else{
				closeempty ='<button id="btn-focus'+data[4] + idFlag + id+'" type="button" class="mui-btn mui-pull-right btn-attentioned style="width: 70px;">已关注</button>'
				
			}
			
		}

		
		var html = '';

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body mui-pull-left">';
		//头像
		var html2 = '<img class=" dynamic-personal-image" style="width:50px;height:50px;border-radius: 50%;" src="' + InfoList[0] + '"></div>';
		var html3 = '<div class="mui-media-body dynamic-padding-left-10px">' + closeempty;
		//姓名
		var html4 = '<h6 style = "color:black;font-size:16px">' + InfoList[1] + '</h6>';
		//时间
		var html5 = '<p>' + InfoList[2] + '</p></div></div>';
		var html6 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body dynamic-contenttext ">';
		var html7 = '<div id="question_content' + data[4] + idFlag + id+'" style = "color:black;font-size:14px" class="ellipsis-show question_content">';
		//内容
		var html8 = InfoList[3];
		var html99 = '<div id="show' + data[4] + idFlag + id+'" class="showAll show" style="color:gray;">展开全部</div>'
		if(document.getElementById("spaceDetail")){
			html99='';
		}
		var html9 = '</div>'+html99+'</div></div>';
		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8 + html9;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.innerHTML = html;
		liElement.appendChild(div);

		mod.addImage(ulElement, liElement, data, id); //增加动态的图片
	};

	/**
	 * 增加动态的图片
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addImage = function(ulElement, liElement, data, id) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率111
		var citycode;
		if(pageFlag == 1) {
			citycode = data[4]
		} else {
			citycode = ''
		}
		if(pageFlag == 1 && mui.os.android) {
			if(SCREEN_WIDTH < 50) {
				SCREEN_WIDTH = plus.screen.resolutionWidth * 4
			}

			SCREEN_WIDTH = SCREEN_WIDTH * 360 / 1440
			console.log('SCREEN_WIDTH==' + SCREEN_WIDTH * 360 / 1440)
		}
		var ImageUrlList = data[1]; //图片路径数组
		var EncAddrList = data[3]
		var ImageNum = ImageUrlList.length; //图片总数量
		var html = '';
		//		if(pageFlag!=0){
		//			ImageNum=0;
		//		}

		if(ImageNum == 1) { //一张图片时
			var html1 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-image-div" style="padding:10px;height: ' + SCREEN_WIDTH * 2 / 3 + 'px;width: ' + (SCREEN_WIDTH - 20) + 'px;">';
			var html2 = '<img class="dynamic-image" style= "height: ' + SCREEN_WIDTH * 2 / 3 + 'px;" src="' + ImageUrlList[0] + '" data-preview-src="' + EncAddrList[0] + '" data-preview-group="' + citycode + 'cellImageType' + id + '"/></div>';
			html = html1 + html2;
		} else if(ImageNum == 2) { //两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '<div class="mui-col-sm-6 mui-col-xs-6 dynamic-image-div" style="padding:10px;height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;width: ' + (SCREEN_WIDTH - 20) / 2 + 'px;">';
				var html2 = '<img class="dynamic-image" style= "height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;" src="' + element + '" data-preview-src="' + EncAddrList[index] + '" data-preview-group="' + citycode + 'cellImageType' + id + '"/>' + '</div>';
				html = html + html1 + html2;
			});
		} else if(ImageNum >= 3) { //大于两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '';
				var html2 = '';
				var html3 = '';

				if(index < 8) {
					html1 = '<div class="mui-col-sm-4 mui-col-xs-4 dynamic-image-div" style="height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;width: ' + (SCREEN_WIDTH - 20) / 3 + 'px;">';
					html2 = '<img class="dynamic-image" style= "padding-top:3px;height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;" src="' + element + '" data-preview-src="' + EncAddrList[index] + '" data-preview-group="' + citycode + 'cellImageType' + id + '"/></div>';
				} else if(index == 8) {
					var html4 = '<div class="mui-col-sm-4 mui-col-xs-4 dynamic-image-div" style="height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;width: ' + (SCREEN_WIDTH - 20) / 3 + 'px;">';
					var html5 = '';
					//蒙版
					if(ImageNum > 9) {
						html5 = '<div class="dynamic-image-more"><font style="line-height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;">+' + (ImageNum - 9) + '</font></div>';
					}
					var html6 = '<img class="dynamic-image" style= "padding-top:3px;height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;" src="' + element + '" data-preview-src="' + EncAddrList[index] + '" data-preview-group="' + citycode + 'cellImageType' + id + '"/></div>';
					html3 = html4 + html5 + html6;
				}

				html = html + html1 + html2 + html3;
			});
		}

		var div = document.createElement('div');
		div.className = 'mui-row ';
		div.style.paddingLeft = '10px'
		div.style.paddingRight = '10px'
		div.innerHTML = html;
		liElement.appendChild(div);

		mod.addInteraction(ulElement, liElement, data, id); //增加动态的互动
	};
	mod.questionContent = function() {
		var height_0;
		var height_1;
		var contentElements = document.getElementsByClassName("question_content");
		var showAll = document.getElementsByClassName("showAll");
		for(var i = 0; i < contentElements.length; i++) {
			contentElements[i].style.webkitLineClamp = '9';
			height_0 = contentElements[i].offsetHeight;
			contentElements[i].style.webkitLineClamp = '8';
			height_1 = contentElements[i].offsetHeight;
			//console.log(height_0 + '|' + height_1);
			if(height_0 > height_1) {
				//内容高度大于八行
				showAll[i].style.display = 'inline';
			} else {
				showAll[i].style.display = 'none';
			}
		}

	}

	/**
	 * 增加动态的互动
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInteraction = function(ulElement, liElement, data, id) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率
		var InteractionData = data[2]; //[introduce，viewCount，[praiseList],[commentList]]信息说明，浏览次数，点赞列表数组，评论列表数组
		var introduce = InteractionData[0]; //信息说明
		var viewCount = InteractionData[1]; //浏览次数
		var praiseList = InteractionData[2].reverse(); //点赞列表数组
		//		for(var i=0;i<20;i++){
		//			praiseList.push('情人'+i+'号')
		//		}

		if(praiseList.length > 20) {
			praiseList[19] = praiseList[19] + '等' + praiseList.length + '人觉得很赞';
		} else {}
		var commentList = InteractionData[3]; //评论列表数组

		//[commentList]:评论列表1.评论[commenter,content]评论者，评论内容
		//						2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容

		var html = '';
		var htmlPraiseList = '<div  class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div id= "PraiseList' + data[4] + idFlag + id + '" class="mui-media-body">'; //点赞列表
		var htmlCommentList = ''; //评论列表

		var html1 = '<div class="mui-col-sm-12 mui-fcol-xs-12"><div class="mui-media-body">';
		var html2 = '</div></div>'
		//		var html2 = '<p><span class="mui-icon mui-icon-image"></span>' + introduce + '</p></div></div>';
		var html3 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div class="mui-media-body mui-pull-right">';
		var html4;
		if(zonepArray[id].IsLike != 0) {
			html4 = '<a id="praise' + data[4] + idFlag + id + '" style = "color: rgb(0,165,224)"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';

		} else {
			html4 = '<a id="praise' + data[4] + idFlag + id + '" style = "color: #8F8F94"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';
		}

		var html5 = '<a id="comment' + data[4] + idFlag + id + '" style = "color: #8F8F94;" class="mui-icon iconfont icon-xiaoxizhongxin dynamic-icon-comment"></a>';
		//				var html6 = '<img src="../../image/dynamic/icon_forward.png" class="dynamic-icon-forward" />';
		var html6 = '<font style="padding-right:7px"></font>';
		var html7
		if(pageFlag == 1) {
			html7 = '</div><div class="mui-media-body"><p></p></div></div>';
		} else {
			html7 = '</div><div class="mui-media-body"><p>浏览' + viewCount + '次</p></div></div>';
		}

		var html8 = '<div id="line" class="mui-col-sm-12 mui-col-xs-12 "><div class="mui-media-body dynamic-line"></div></div>';

		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8;
		if(praiseList.length > 0 && praiseList.length <= 19) {
			var praiseListStr = praiseList.join('、');
			var html3 = '<img id = "praiseImg" src="../../image/dynamic/icon_praise_small.png" class="dynamic-icon-praise-small mui-pull-left" />' + '<font class="common-font-family-Regular dynamic-praise-name praiseName">' + praiseListStr + '</font>';
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else if(praiseList.length > 19) {
			praiseList = praiseList.slice(0, 20);
			var praiseListStr = praiseList.join('、');
			var html3 = '<img id = "praiseImg" src="../../image/dynamic/icon_praise_small.png" class="dynamic-icon-praise-small mui-pull-left" />' + '<font class="common-font-family-Regular dynamic-praise-name praiseName">' + praiseListStr + '</font>';
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else {
			htmlPraiseList = htmlPraiseList + '</div></div>';
		}


		//评论列表
		var htmlCommentList1 = '<div id="commentList' + data[4] + idFlag + id + '" class="mui-col-sm-12 mui-col-xs-12">';
		var htmlCommentList2 = '';
		var commentNum = 0;
		$.each(commentList, function(index, element) {
			commentNum++;
			if(commentNum > 20) {
				return false;
			}
			var firstComment = '';
			var replyComment = '';
			var html1 = '<div id="replyComment' + data[4] + idFlag + id + '-' + index + '-' + '评论' + '" class="mui-media-body replyComment">';
			var html2 = '<font class="common-font-family-Regular dynamic-comment-name ">' + element.UserIdName + '</font>';
			var html3 = '<font class="common-font-family-Regular" style = "font-size:14px">：' + element.CommentContent + '</font>';
			firstComment = html1 + html2 + html3;
			
			if(element.Replys&&element.Replys.length != 0) {
				for(var i = 0; i < element.Replys.length; i++) {
					commentNum++
					if(commentNum > 20) {
						return false;
					}
					var tempModel = element.Replys;
					var html1 = '<div id="replyComment' + data[4] + idFlag + id + '-' + index + '-' + i + '" class="mui-media-body replyComment">';
					var html2 = '<font class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].UserIdName + '</font>';
					var html3 = '<font class="common-font-family-Regular" style = "font-size:14px">回复</font>';
					var html4 = '<font class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].ReplyIdName + '</font>';
					var html5 = '<font class="common-font-family-Regular" style = "font-size:14px">：' + tempModel[i].CommentContent + '</font></div>';
					replyComment = replyComment + html1 + html2 + html3 + html4 + html5;
				}
				replyComment = replyComment + '</div>'
			} else {
				replyComment = '</div>'
			}

			htmlCommentList2 = htmlCommentList2 + firstComment + replyComment;
		});

		htmlCommentList = htmlCommentList1 + htmlCommentList2 + '</div>';
		var showAll

		if(commentList.length>20&&(!document.getElementById("spaceDetail"))){
			showAll = '<div id="show2' + data[4] + idFlag + id+'" class="show2" style="color:gray;">展开全部</div>'
		}else{
			showAll = '';
		}
        
		html = html + htmlPraiseList + htmlCommentList+showAll //+ htmlCommentBtn;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.style.marginTop = '-25px'
		div.innerHTML = html;
		liElement.appendChild(div);

		ulElement.appendChild(liElement);
	};

	return mod;

})(mui, window.dynamiclistitem || {});