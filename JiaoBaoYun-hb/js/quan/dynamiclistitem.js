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
	mod.addItem = function( ulElement, data,id) {
		var li = document.createElement('li');
		li.id = id;
		li.className = 'mui-table-view-cell';

		mod.addInfo(ulElement, li, data); //增加动态的个人信息和内容
	};

	/**
	 * 增加动态的个人信息和内容
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInfo = function(ulElement, liElement, data) {
		var InfoList = data[0]; //[personalImage,personalName,time,contentText]个人头像，姓名，发布时间，动态内容的文字
		var html = '';

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body mui-pull-left">';
		//头像
		var html2 = '<img class=" dynamic-personal-image" src="' + InfoList[0] + '"></div>';
		var html3 = '<div class="mui-media-body dynamic-padding-left-10px"><span class="mui-icon mui-icon-arrowdown mui-pull-right"></span>';
		//姓名
		var html4 = '<h4>' + InfoList[1] + '<img src="../../image/dynamic/icon_Level39.png" class=" dynamic-icon-Level" /></h4>';
		//时间
		var html5 = '<p>' + InfoList[2] + '</p></div></div>';
		var html6 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body dynamic-contenttext">';
		var html7 = '<font>';
		//内容
		var html8 = InfoList[3];
		var html9 = '</font></div></div>';
		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8 + html9;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.innerHTML = html;
		liElement.appendChild(div);

		mod.addImage(ulElement, liElement, data); //增加动态的图片
	};

	/**
	 * 增加动态的图片
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addImage = function(ulElement, liElement, data) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率
		var imageData = data[1]; //[[ImageUrlList],ImageNum]动态内容的图片路径数组,图片总数量
		var ImageUrlList = imageData[0]; //图片路径数组
		var ImageNum = imageData[1]; //图片总数量
		var html = '';

		if(ImageNum == 1) { //一张图片时
			var html1 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-image-div" style="height: ' + SCREEN_WIDTH + 'px;">';
			var html2 = '<img class="dynamic-image" src="' + ImageUrlList[0] + '"></div>';
			html = html1 + html2;
		} else if(ImageNum == 2) { //两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '<div class="mui-col-sm-6 mui-col-xs-6 dynamic-image-div" style="height: ' + (SCREEN_WIDTH / 2) + 'px;">';
				var html2 = '<img class="dynamic-image" src="' + element + '"></div>';
				html = html + html1 + html2;
			});
		} else if(ImageNum >= 3) { //大于两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '';
				var html2 = '';
				var html3 = '';

				if(index < 8) {
					html1 = '<div class="mui-col-sm-4 mui-col-xs-4 dynamic-image-div" style="height: ' + (SCREEN_WIDTH / 3) + 'px;">';
					html2 = '<img class="dynamic-image" src="' + element + '"></div>';
				} else if(index == 8) {
					var html4 = '<div class="mui-col-sm-4 mui-col-xs-4 dynamic-image-div" style="height: ' + (SCREEN_WIDTH / 3) + 'px;">';
					var html5 = '';
					//蒙版
					if(ImageNum > 9) {
						html5 = '<div class="dynamic-image-more"><font style="line-height: ' + (SCREEN_WIDTH / 3) + 'px;">+' + (ImageNum - 9) + '</font></div>';
					}
					var html6 = '<img class="dynamic-image" src="' + element + '"></div>';
					html3 = html4 + html5 + html6;
				}

				html = html + html1 + html2 + html3;
			});
		}

		var div = document.createElement('div');
		div.className = 'mui-row ';
		div.innerHTML = html;
		liElement.appendChild(div);

		mod.addInteraction(ulElement, liElement, data); //增加动态的互动
	};

	/**
	 * 增加动态的互动
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInteraction = function(ulElement, liElement, data) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率
		var InteractionData = data[2]; //[introduce，viewCount，[praiseList],[commentList]]信息说明，浏览次数，点赞列表数组，评论列表数组
		var introduce = InteractionData[0]; //信息说明
		var viewCount = InteractionData[1]; //浏览次数
		var praiseList = InteractionData[2]; //点赞列表数组
		var commentList = InteractionData[3]; //评论列表数组
		//[commentList]:评论列表1.评论[commenter,content]评论者，评论内容
		//						2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容

		var html = '';
		var htmlPraiseList = ''; //点赞列表
		var htmlCommentList = ''; //评论列表

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body">';
		var html2 = '<p><span class="mui-icon mui-icon-image"></span>' + introduce + '</p></div></div>';
		var html3 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div class="mui-media-body mui-pull-right">';
		var html4 = '<img src="../../image/dynamic/icon_praise.png" class="dynamic-icon-praise" />';
		var html5 = '<img src="../../image/dynamic/icon_comment.png" class="dynamic-icon-comment" />';
		var html6 = '<img src="../../image/dynamic/icon_forward.png" class="dynamic-icon-forward" />';
		var html7 = '</div><div class="mui-media-body"><p>浏览' + viewCount + '次</p></div></div>';
		var html8 = '<div class="mui-col-sm-12 mui-col-xs-12 "><div class="mui-media-body dynamic-line"></div></div>';

		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8;

		//点赞列表
		$.each(praiseList, function(index, element) {
			var html4 = '';
			var html5 = '';
			if(index == 0) { //第一个点赞者
				var html1 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px">';
				var html2 = '<div class="mui-media-body">';
				var html3 = '<img src="../../image/dynamic/icon_praise_small.png" class="dynamic-icon-praise-small mui-pull-left" />';
				html4 = html1 + html2 + html3 + '<font class="common-font-family-Regular dynamic-praise-name">' + element + '</font>';
			} else if(index >= 1) {
				html5 = '<font class="common-font-family-Regular dynamic-praise-name">、' + element + '</font>';
			}
			htmlPraiseList = htmlPraiseList + html4 + html5;
		});
		htmlPraiseList = htmlPraiseList + '</div></div>';

		//评论列表
		var htmlCommentList1 = '<div class="mui-col-sm-12 mui-col-xs-12">';
		var htmlCommentList2 = '';

		$.each(commentList, function(index, element) {
			var htmlComment = '';
			if(element.length == 2) {
				var html1 = '<div class="mui-media-body">';
				var html2 = '<font class="common-font-family-Regular dynamic-comment-name">' + element[0] + '</font>';
				var html3 = '<font class="common-font-family-Regular">：' + element[1] + '</font></div>';
				htmlComment = html1 + html2 + html3;
			} else if(element.length == 3) {
				var html1 = '<div class="mui-media-body">';
				var html2 = '<font class="common-font-family-Regular dynamic-comment-name">' + element[0] + '</font>';
				var html3 = '<font class="common-font-family-Regular">回复</font>';
				var html4 = '<font class="common-font-family-Regular dynamic-comment-name">' + element[1] + '</font>';
				var html5 = '<font class="common-font-family-Regular">' + element[2] + '</font></div>';
				htmlComment = html1 + html2 + html3 + html4 + html5;
			}
			htmlCommentList2 = htmlCommentList2 + htmlComment;
		});

		htmlCommentList = htmlCommentList1 + htmlCommentList2 + '</div>';

		var htmlCommentBtn = '<div class="mui-col-sm-12 mui-col-xs-12"><button type="button" class="mui-btn dynamic-comment-btn"><p class="mui-pull-left">评论</p></button></div>';

		html = html + htmlPraiseList + htmlCommentList + htmlCommentBtn;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.innerHTML = html;
		liElement.appendChild(div);

		ulElement.appendChild(liElement);
	};

	return mod;

})(mui, window.dynamiclistitem || {});