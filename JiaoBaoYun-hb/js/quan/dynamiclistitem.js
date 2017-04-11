var dynamiclistitem = (function($, mod) {
	mod.addComment = function() {
		if(tempIndex.indexOf('-') >= 0) {
			var indexArr = tempIndex.split('-');
			var id = indexArr[0];
			var commentId = indexArr[1];
			var replyId = indexArr[2];

			var tempModel = zonepArray[id].Comments[commentId];
			if(!tempModel) {
				mui.toast('不可以回复自己');
				return;
			}
			console.log(JSON.stringify(tempModel));
			var upperId = tempModel.TabId;
			var replyUserId;
			var ReplyIdName;
			if(replyId == '评论') {
				replyUserId = tempModel.UserId
				ReplyIdName = tempModel.UserIdName
			} else {
				replyUserId = tempModel.Replys[replyId].UserId;
				ReplyIdName = tempModel.Replys[replyId].UserIdName;
			}
			if(personalUTID == replyUserId) {
				mui.toast('不可以回复自己');
				return;
			}
		}
		events.openNewWindowWithData('../show/add-comment.html', {
			tempIndex: tempIndex,
			zonepArray: zonepArray
		})

	}
	mod.addSomeEvent = function() {
		mui('.mui-table-view').on('tap', '.icon-xiajiantou', function() {
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称

			var pageID = sliderId.replace('top_', '')
			var tempId = this.id;
			var index = this.id.replace('btn-focus' + pageID + idFlag, '');
			var isFocus = zonepArray[index].IsFocused;
			//					var isFocus = jQuery('#'+this.id).data('isFocus');
			var title, status;
			console.log(this.id)
			if(isFocus == 0) {
				title = '关注'
				status = 1;
			} else {
				title = '取消关注'
				status = 0;
			}
			var btnArray = [{ title: title, style: "destructive" }];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var flag = e.index;
				switch(flag) {
					case 0:
						break;
					case 1:
						{
							//80.（用户空间）设置某用户的关注
							//所需参数
							var comData = {
								userId: personalUTID, //用户ID
								focusId: zonepArray[index].PublisherId, //关注ID
								status: status //关注状态，0 不关注，1 关注
							};
							//返回：1为正确
							var wd = events.showWaiting();
							postDataPro_setUserFocus(comData, wd, function(data) {
								wd.close();
								console.log(JSON.stringify(data))
								if(data.RspCode == 0) {
									var pageID = sliderId.replace('top_', '')
									console.log('pageID=' + pageID)
									setTimeout(function() {
										//获取数据
										if(pageID != 1) { //定制的城市
											for(var i = 0; i < zonepArray.length; i++) {
												if(zonepArray[index].PublisherId == zonepArray[i].PublisherId) {
													if(isFocus == 0) {
														zonepArray[i].IsFocused = 1;
														datasource[sliderId] = zonepArray
													} else {
														zonepArray[i].IsFocused = 0;
														datasource[sliderId] = zonepArray
													}

												}
											}
											console.log('status=' + status)
											if(status == 0) {
												mui.toast("取消关注成功")
											} else {
												mui.toast("关注成功")
											}
										} else { //关注的人数据
											//81.（用户空间）获取用户所有关注的用户
											getFocusByUser();
										}
									}, 1000);
								}

							})

						}
						break;
				}
			});
		});
		mui('.mui-table-view').on('tap', '.dynamic-personal-image', function() {
			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('headImg' + cityID + idFlag, '');
			mui.openWindow({
				url: '../quan/zone_main.html',
				id: '../quan/zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},

				extras: {
					data: zonepArray[index].PublisherId,
					NoReadCnt: 0,
					flag: '0'
				},
				createNew: true,

			});

		})
		mui('.mui-table-view').on('tap', '.question_content', function() {

			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('question_content' + cityID + idFlag, '');
			if(idFlag == '') {
				zonepArray[index].focusFlag = 0;
			} else {
				zonepArray[index].focusFlag = 1;
			}

			events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])
		});
		mui('.mui-table-view').on('tap', '.show', function() {

			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('show' + cityID + idFlag, '');
			if(idFlag == '') {
				zonepArray[index].focusFlag = 0;
			} else {
				zonepArray[index].focusFlag = 1;
			}
			events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])

		})
		mui('.mui-table-view').on('tap', '.show2', function() {

			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('show2' + cityID + idFlag, '');
			if(idFlag == '') {
				zonepArray[index].focusFlag = 0;
			} else {
				zonepArray[index].focusFlag = 1;
			}
			events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])

		})
		//			评论
		mui('.mui-table-view').on('tap', '.dynamic-icon-comment', function() {
			var pageID = sliderId.replace('top_', '')
			tempIndex = this.id.replace('comment' + pageID + idFlag, '');
			mod.addComment();
			window.event.stopPropagation()

		});
		//底部评论按钮
		mui('.mui-table-view').on('tap', '.dynamic-comment-btn', function() {
			var pageID = sliderId.replace('top_', '')
			console.log(pageID)
			tempIndex = this.id.replace('bottomComment' + pageID + idFlag, '');
			mod.addComment();
			window.event.stopPropagation()
		});

		//			回复评论
		mui('.mui-table-view').on('tap', '.replyComment', function() {
			var pageID = sliderId.replace('top_', '')
			tempIndex = this.id.replace('replyComment' + pageID + idFlag, '');
			mod.addComment();

			window.event.stopPropagation()

		});
		//
		//点击关注
		mui('.mui-table-view').on('tap', '.btn-attention',
			function() {
				var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称

				var pageID = sliderId.replace('top_', '')
				var tempId = this.id;
				var index = this.id.replace('btn-focus' + pageID + idFlag, '');
				//80.（用户空间）设置某用户的关注
				//所需参数
				var comData = {
					userId: personalUTID, //用户ID
					focusId: zonepArray[index].PublisherId, //关注ID
					status: '1' //关注状态，0 不关注，1 关注
				};
				//返回：1为正确
				var wd = events.showWaiting();
				postDataPro_setUserFocus(comData, wd, function(data) {
					wd.close();
					if(data.RspCode == 0) {
						var btn = document.getElementById(tempId);
						btn.innerHTML = '取消关注'
						btn.className = 'mui-btn mui-pull-right btn-attentioned'
						var pageID = sliderId.replace('top_', '')
						setTimeout(function() {
							//获取数据
							if(pageID != 1) { //定制的城市
								requestData(pageID, 1);
							} else { //关注的人数据
								//81.（用户空间）获取用户所有关注的用户
								getFocusByUser();
							}
							//结束下拉刷新
							self.endPullDownToRefresh();
						}, 1000);
					}

				})
			}) //点击取消关注
		mui('.mui-table-view').on('tap', '.btn-attentioned', function() {
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称

			var pageID = sliderId.replace('top_', '')
			var tempId = this.id;
			var index = this.id.replace('btn-focus' + pageID + idFlag, '');
			//80.（用户空间）设置某用户的关注
			//所需参数
			var comData = {
				userId: personalUTID, //用户ID
				focusId: zonepArray[index].PublisherId, //关注ID
				status: '0' //关注状态，0 不关注，1 关注
			};
			//返回：1为正确
			var wd = events.showWaiting();
			postDataPro_setUserFocus(comData, wd, function(data) {
				wd.close();
				console.log(JSON.stringify(data))
				if(data.RspCode == 0) {
					var btn = document.getElementById(tempId);
					btn.innerHTML = '关注'
					btn.className = 'mui-btn mui-pull-right btn-attention'
					var pageID = sliderId.replace('top_', '')
					setTimeout(function() {
						//获取数据
						if(pageID != 1) { //定制的城市
							requestData(pageID, 1);
						} else { //关注的人数据
							//81.（用户空间）获取用户所有关注的用户
							getFocusByUser();
						}
						//结束下拉刷新
						self.endPullDownToRefresh();
					}, 1000);

				}

			})
		})
		//点击点赞人那一行 跳转到点赞的人的列表界面
		mui('.mui-table-view').on('tap', '.PraiseList', function() {
			console.log('跳转到点赞人列表界面')
			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('PraiseList' + cityID + idFlag, '');
			var LikeUsers = zonepArray[index].LikeUsers
			events.fireToPageWithData("../quan/classSpace-persons.html", "personsList", { zanList: LikeUsers, type: 3 });
			window.event.stopPropagation()
		})
		//点击点赞的人跳转到相应界面
		mui('.mui-table-view').on('tap', '.praiseName', function() {
			console.log('点赞者id' + this.dataset.info);
			mui.openWindow({
				url: '../quan/zone_main.html',
				id: '../quan/zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},

				extras: {
					data: this.dataset.info,
					NoReadCnt: 0,
					flag: '0'
				},
				createNew: true,

			});
			window.event.stopPropagation()
		});
		//点击评论者名字
		mui('.mui-table-view').on('tap', '.dynamic-comment-name', function() {
			console.log('评论者id' + this.dataset.info);
			mui.openWindow({
				url: '../quan/zone_main.html',
				id: '../quan/zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},

				extras: {
					data: this.dataset.info,
					NoReadCnt: 0,
					flag: '0'
				},
				createNew: true,

			});
			window.event.stopPropagation()

		})
		//点赞和取消点赞
		mui('.mui-table-view').on('tap', '.dynamic-icon-praise', function() {
			var userInfo = window.myStorage.getItem(window.storageKeyName.PERSONALINFO); //用户id
			var pageID = sliderId.replace('top_', '')
			var personalunick = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick; //用户昵称
			var index = this.id.replace('praise' + pageID + idFlag, '');
			var color = this.style.color;
			if(color == 'rgb(183, 183, 183)') {
				var comData = {
					userId: userInfo.utid, //用户ID
					userSpaceId: zonepArray[index].TabId, //用户空间ID
				};
				var wd = events.showWaiting();
				postDataPro_setUserSpaceLikeByUser(comData, wd, function(data) {
					wd.close();
					if(data.RspCode == 0) {
						var a = document.getElementById("praise" + pageID + idFlag + index);
						a.style.color = 'rgb(26, 155, 255)'
						var PraiseList = document.getElementById("PraiseList" + pageID + idFlag + index);
						var praiseNameList = PraiseList.getElementsByTagName("font");
						zonepArray[index].LikeUsers.unshift(userInfo) //把当前用户信息放到数组LikeUsers第一位

						if(praiseNameList.length > 0) {
							PraiseList.innerHTML = PraiseList.innerHTML.replace('mui-pull-left">', 'mui-pull-left">' + '<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>、')
						} else {
							var citycode = sliderId.replace('top_', '');
							document.getElementById('line' + citycode + idFlag + index).className = 'mui-media-body dynamic-line';
							PraiseList.innerHTML = '<img id= "praiseImg' + pageID + idFlag + index + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' +
								'<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>';
						}
					} else {
						mui.toast(data.RspTxt);
					}

				})

			} else {

				var comData = {
					userId: userInfo.utid, //用户ID
					userSpaceId: zonepArray[index].TabId, //用户空间ID
				};
				var wd = events.showWaiting();
				postDataPro_delUserSpaceLikeByUser(comData, wd, function(data) {
					wd.close();
					if(data.RspCode == 0) {
						var a = document.getElementById("praise" + pageID + idFlag + index);
						a.style.color = 'rgb(183, 183, 183)'
						var PraiseList = document.getElementById("PraiseList" + pageID + idFlag + index);
						var praiseName = PraiseList.getElementsByTagName("font");
						var tempLikeUser = zonepArray[index].LikeUsers
						for(var i in tempLikeUser) {
							if(tempLikeUser[i].utid == userInfo.utid) {
								tempLikeUser.splice(i, 1);
							}
						}
						if(praiseName.length > 1) {
							console.log('多个人点赞')
							for(var i = 0; i < praiseName.length; i++) {

								if(praiseName[i].dataset.info == userInfo.utid) {
									PraiseList.innerHTML = PraiseList.innerHTML.replace('<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>、', '')

								}
							}

						} else {
							console.log('一个人点赞')
							var citycode = sliderId.replace('top_', '');
							var comment0 = document.getElementById('replyComment' + pageID + idFlag + index + '-0-评论');
							if(comment0) {
								document.getElementById('line' + pageID + idFlag + index).className = 'mui-media-body dynamic-line';
							} else {
								document.getElementById('line' + pageID + idFlag + index).className = 'mui-media-body dynamic-line mui-hidden';
							}
							for(var i = 0; i < praiseName.length; i++) {
								if(praiseName[i].dataset.info == userInfo.utid) {
									PraiseList.removeChild(praiseName[i]);
								}
							}

							var praiseImg = document.getElementById("praiseImg" + pageID + idFlag + index);
							PraiseList.removeChild(praiseImg);

						}
					} else {
						mui.toast(data.RspTxt);
					}

				})

			}

		});
		//删除动态
		mui('.mui-table-view').on('tap', '.mui-icon-closeempty', function() {
			var btnArray = ['取消', '确定'];
			var closeId = this.id;
			mui.confirm('确定删除此条动态？', '提醒', btnArray, function(e) {
				if(e.index == 1) {
					var index = closeId.replace('delete', '');
					console.log(closeId);
					var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
					var comData = {
						userSpaceId: zonepArray[index].TabId //用户空间ID
					};
					postDataPro_delUserSpaceById(comData, wd, function(data) {
						wd.close();
						if(data.RspCode == 0) {
							mui.toast('已删除');

							var deleteNode = document.getElementById(index);
							deleteNode.parentNode.removeChild(deleteNode);
							zonepArray.splice(index, 1)
						} else {
							mui.toast(data.RspTxt);
						}
					})
				}
			})
		})

	}

	mod.addData = function(data) {

		//[[InfoList],[ImageList],[InteractionList]]动态的信息
		var ImageList = []; //内容的图片
		var EncAddrList = [];
		//个人信息和内容
		var tempModel = data;

		tempModel.personalImage = updateHeadImg(tempModel.uimg, 2)
		if(tempModel.ugname) {
			tempModel.personalName = events.shortForString(tempModel.ugname, 15);
		} else {
			tempModel.personalName = events.shortForString(tempModel.unick, 15);
		}

		tempModel.PublishDate = modifyTimeFormat(tempModel.PublishDate);

		if(tempModel.EncImgAddr != '') {
			var EncImgAddrs = tempModel.EncImgAddr.split('|');
			var EncAddr = tempModel.EncAddr.split('|');

			//内容的图片
			for(var i = 0; i < EncImgAddrs.length; i++) {
				ImageList.push(EncImgAddrs[i])
				EncAddrList.push(EncAddr[i]);
			}

		}
		tempModel.ImageList = ImageList
		tempModel.EncAddrList = EncAddrList

		//底部
		var viewCount = tempModel.ReadCnt;
		var praiseList = [];
		if(tempModel.LikeUsers.length != 0) {
			for(var i = 0; i < tempModel.LikeUsers.length; i++)
				praiseList.push(tempModel.LikeUsers[i]);
		}
		tempModel.praiseList = praiseList

		//[commentList]:评论列表
		//1.评论[commenter,content]，评论者，评论内容
		//2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容
		var commentList = [];

		for(var i = 0; i < tempModel.Comments.length; i++) {

			var tempComment = tempModel.Comments[i];
			commentList.push(tempComment);

		}
		tempModel.commentList = commentList
		tempModel.IsFocused = data.IsFocused;
		tempModel.cityCode = data.cityCode;
		tempModel.idFlag = data.idFlag;
		tempModel.id = data.id;
		tempModel.id_name = data.id_name;
		return tempModel;

	}

	mod.addItem = function(ulElement, data) {
		var li = document.createElement('li');
		li.id = data.id;
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
		var closeempty = '';
		if(data.pageFlag == 0) {
			if(personalUTID == publisherId) {
				closeempty = '<a id ="delete' + data.id + '" class="mui-icon mui-icon-closeempty mui-pull-right" ></a>';

			} else {
				closeempty = '';
			}
		} else {
			if(data.IsFocused == 0) {

				if(!document.getElementById("spaceDetail")) {
					console.log('关注')
					closeempty = '<a data-is-focus=0  id ="btn-focus' + data.id_name + '" class="mui-icon iconfont icon-xiajiantou mui-pull-right" style="color:gray;width:30px;height:30px;padding:5px"></a>';

				} else {
					//					closeempty = '<button id="btn-focus' + data.id_name + '" type="button" class="mui-btn mui-pull-right btn-attention" style="width: 55px;">关注</button>'
				}
			} else {

				if(!document.getElementById("spaceDetail")) {
					console.log('已关注')
					closeempty = '<a data-is-focus=1  id ="btn-focus' + data.id_name + '" class="mui-icon iconfont icon-xiajiantou mui-pull-right" style="color:gray;width:30px;height:30px;padding:5px"></a>';

				} else {
					//					closeempty = '<button id="btn-focus' + data.id_name + '" type="button" class="mui-btn mui-pull-right btn-attentioned" style="width: 55px;">已关注</button>'
				}

			}

		}

		var html = '';

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body mui-pull-left">';
		//头像
		var html2 = '<img id="headImg' + data.id_name + '" class=" dynamic-personal-image" style="width:40px;height:40px;border-radius: 50%;" src="' + data.personalImage + '"></div>';
		var html3 = '<div class="mui-media-body dynamic-padding-left-10px">' + closeempty;
		//姓名
		var html4 = '<p class="mui-ellipsis" style = "color:#323232;font-size:16px;margin-top:2px">' + data.personalName + '</p>';
		//时间
		var html5 = '<p>' + data.PublishDate + '</p></div></div>';
		var html6 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body dynamic-contenttext ">';
		var html7 = '<div id="question_content' + data.id_name + '" style = "color:black;font-size:14px" class="ellipsis-show question_content">';
		//内容
		var html8 = data.MsgContent;
		var html99 = '<div id="show' + data.id_name + '" class="showAll show" style="color:gray;">展开全部</div>'

		if(document.getElementById("spaceDetail")) {
			html99 = '';
		}
		var html9 = '</div>' + html99 + '</div></div>';
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
		var citycode = data.cityCode

		if(data.pageFlag == 1 && mui.os.android) {
			if(SCREEN_WIDTH < 50) {
				SCREEN_WIDTH = plus.screen.resolutionWidth * 4
			} else if(SCREEN_WIDTH > 50 && SCREEN_WIDTH < 450) {

			} else {
				SCREEN_WIDTH = SCREEN_WIDTH * 360 / 1440
			}

		}
		var ImageUrlList = data.ImageList; //图片路径数组
		var EncAddrList = data.EncAddrList
		var ImageNum = ImageUrlList.length; //图片总数量
		var html = '';
		//		if(data.pageFlag!=0){
		//			ImageNum=0;
		//		}

		if(ImageNum == 1) { //一张图片时
			var html1 = '<div>';
			var html2 = '<img class="dynamic-image"  style= "height: ' + SCREEN_WIDTH * 1 / 2 + 'px;width: ' + SCREEN_WIDTH * 1 / 2 + 'px;" src="' + ImageUrlList[0] + '" data-preview-src="' + EncAddrList[0] + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/></div>';
			html = html1 + html2;
		} else if(ImageNum == 2) { //两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '<div class="mui-col-sm-6 mui-col-xs-6 dynamic-image-div" style="height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;width: ' + (SCREEN_WIDTH - 20) / 2 + 'px;">';
				var html2 = '<img class="dynamic-image" style= "height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;" src="' + element + '" data-preview-src="' + EncAddrList[index] + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/>' + '</div>';
				html = html + html1 + html2;
			});
		} else if(ImageNum >= 3) { //大于两张图片时
			$.each(ImageUrlList, function(index, element) {
				var html1 = '<div class="mui-col-sm-4 mui-col-xs-4" style="height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;width: ' + (SCREEN_WIDTH - 20) / 3 + 'px;">';
				var html2 = '<img class="dynamic-image" style="height: ' + (SCREEN_WIDTH - 30) / 3 + 'px;width: ' + (SCREEN_WIDTH - 30) / 3 + 'px;"  src="' + element + '" data-preview-src="' + EncAddrList[index] + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/></div>';
				html = html + html1 + html2;
			});
		}

		var div = document.createElement('div');
		div.className = 'mui-row ';
		div.style.paddingLeft = '10px'
		div.style.paddingRight = '10px'
		div.style.marginTop = '-10px'
		div.innerHTML = html;
		liElement.appendChild(div);
		//				if(ImageNum == 1) {
		//					var img = div.getElementsByClassName('dynamic-image')[0];
		//					console.log(img.outerHTML);　　
		//					var width = img.naturalWidth;　　
		//					var height = img.naturalHeight;
		//					
		//					if(width<height){
		//						console.log('width=' + width + '-----' + 'height=' + height);
		//						var tempwidth = (SCREEN_WIDTH - 20) / 2;
		//						img.setAttribute('width',tempwidth+'px');
		//						img.setAttribute('height',tempwidth/width*height+'px')
		//					}else{
		//						console.log('width=' + width + '-----' + 'height=' + height);
		//						var tempHeight = (SCREEN_WIDTH - 20);
		//						img.setAttribute('height',tempHeight+'px');
		//						img.setAttribute('width',tempHeight/height*width+'px')
		//					}
		//				}

		mod.addInteraction(ulElement, liElement, data);
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
	mod.addInteraction = function(ulElement, liElement, data) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率
		var viewCount = data.ReadCnt; //浏览次数
		var praiseList = data.praiseList.reverse(); //点赞列表数组
		var commentList = data.commentList; //评论列表数组
		var html = '';
		var htmlPraiseList = '<div  class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div id= "PraiseList' + data.id_name + '" class="PraiseList mui-media-body mui-col-sm-12 mui-col-xs-12">'; //点赞列表
		var htmlCommentList = ''; //评论列表

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body">';
		var html2 = '</div></div>'
		var html3 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div class="mui-media-body mui-pull-right" style="margin-right:-15px">';
		var html4;
		//点赞状态
		if(data.IsLike != 0) { //已点赞
			html4 = '<a id="praise' + data.id_name + '" style = "color: rgb(26,155,255)"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';

		} else { //为点赞
			html4 = '<a id="praise' + data.id_name + '" style = "color: #b7b7b7"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';
		}

		var html5 = '<a id="comment' + data.id_name + '" style = "color: #b7b7b7;" class="mui-icon iconfont icon-xiaoxizhongxin dynamic-icon-comment"></a>';
		var html6 = '<font style="padding-right:7px"></font>';
		var html7
		if(data.pageFlag == 1) { //展现界面
			html7 = '</div><div class="mui-media-body"><p></p></div></div>';
		} else { //空间界面
			html7 = '</div><div class="mui-media-body"><p>浏览' + viewCount + '次</p></div></div>';
		}
		var html8;

		if(praiseList.length > 0 || commentList.length > 0) { //有点赞或者评论时显示分割线
			html8 = '<div  class="mui-col-sm-12 mui-col-xs-12 "><div id="line' + data.id_name + '" class="mui-media-body dynamic-line"></div></div>';
		} else {
			html8 = '<div  class="mui-col-sm-12 mui-col-xs-12 "><div id="line' + data.id_name + '" class="mui-media-body dynamic-line mui-hidden"></div></div>';
		}
		//点赞列表
		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8;
		var nameArr = []
		for(var i in praiseList) {
			var name = praiseList[i].unick;
			name = '<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + praiseList[i].utid + '">' + name + '</font>'
			nameArr.push(name);

		}
		if(nameArr.length > 0 && nameArr.length <= 19) {

			var praiseListStr = nameArr.join('、');
			var html3 = '<img id = "praiseImg' + data.id_name + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' + praiseListStr;
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else if(nameArr.length > 19) {
			nameArr = nameArr.slice(0, 20);
			var praiseListStr = nameArr.join('、');
			var html3 = '<img id = "praiseImg' + data.id_name + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' + praiseListStr + '等' + nameArr.length + '人觉得点赞';
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else {
			htmlPraiseList = htmlPraiseList + '</div></div>';
		}

		//评论列表
		var htmlCommentList1 = '<div id="commentList' + data.id_name + '" class="mui-col-sm-12 mui-col-xs-12">';
		var htmlCommentList2 = '';
		var commentNum = 0;
		$.each(commentList, function(index, element) {
			commentNum++;
			if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
				return false;
			}
			var firstComment = '';
			var replyComment = '';
			var html1 = '<div id="replyComment' + data.id_name + '-' + index + '-' + '评论' + '" class="mui-media-body replyComment">';
			var html2 = '<font data-info=' + element.UserId + ' class="common-font-family-Regular dynamic-comment-name ">' + element.UserIdName + '</font>';
			var html3 = '<font class="common-font-family-Regular" style = "font-size:14px">：' + element.CommentContent + '</font>';
			firstComment = html1 + html2 + html3;

			if(element.Replys && element.Replys.length != 0) {
				for(var i = 0; i < element.Replys.length; i++) {
					commentNum++
					if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
						return false;
					}
					var tempModel = element.Replys;
					var html1 = '<div id="replyComment' + data.id_name + '-' + index + '-' + i + '" class="mui-media-body replyComment">';
					var html2 = '<font data-info=' + tempModel[i].UserId + ' class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].UserIdName + '</font>';
					var html3 = '<font class="common-font-family-Regular" >回复</font>';
					var html4 = '<font data-info=' + tempModel[i].ReplyId + ' class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].ReplyIdName + '</font>';
					var html5 = '<font class="common-font-family-Regular" style = "font-size:14px">：' + tempModel[i].CommentContent + '</font></div>';
					replyComment = replyComment + html1 + html2 + html3 + html4 + html5;
				}
				replyComment = replyComment + '</div>'
			} else {
				replyComment = '</div>'
			}

			htmlCommentList2 = htmlCommentList2 + firstComment + replyComment;
		});
		if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
			console.log('评论大于20')
			showAll = '<div id="show2' + data.id_name + '" class=" show2" style="color:gray;">展开全部</div>'
		} else {
			showAll = '';
		}

		htmlCommentList = htmlCommentList1 + htmlCommentList2 + showAll + '</div>';

		html = html + htmlPraiseList + htmlCommentList //+ showAll //+ htmlCommentBtn;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.style.marginTop = '-25px'
		div.innerHTML = html;
		liElement.appendChild(div);
		ulElement.appendChild(liElement);
	};

	return mod;

})(mui, window.dynamiclistitem || {});