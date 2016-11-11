//此js用于保存网络请求后，返回的model


var publicModel = (function($, mod) {
	//握手后，返回公钥
	mod.model_ShakeHand = {
		Exponent:'',//公钥模式
		Modulus:''//公钥值
	};
	
	//注册后，或者登录后，返回用户的信息
	mod.model_personalInfo = {
		utid:'',//用户表ID
		uimg:'',//用户头像地址
		unick:'',//用户昵称
		usex:'',//用户性别
		utxt:'',//用户签名
		token:''//用户令牌
	};
	
	//11.通过用户账号和手机号搜索用户
	mod.model_searchPeople = {
		utid:'',//用户表ID
		uid:'',//用户手机号
		uname:'',//用户名
		unick:'',//用户昵称
		usex:'',//性别
		utxt:'',//签名
		uimg:''//用户头像地址
	}
	
	//16.通过群ID获取群学生
	mod.model_groupStus = {
		gid:'',//群ID
		stuid:'',//学生资料id
		stuname:'',//学生名称
		stuimg:''//学生头像
	}
	
	//家校圈
	//2.（点到记事）获取用户未读点到记事列表
	mod.model_homeSchoolList = {
		TotalPage:'',//总页数
		TotalCnt:'',//总记录数
		Data:[//列表数据
			
		]]
	}
	
	//家校圈用户记事信息
	mod.model_userNoteInfo = {
		//共用
		TabId:'',//记事ID
		PublisherId:'',//发布者ID
		PublishDate:'',//发布时间
		MsgContent:'',//记事内容
		NoteType:'',//点到记事类型
		CheckType:'',//点到情况
		EncType:'',//附件类型
		EncAddr:'',//附件地址
		EncImgAddr:'',//附件缩略图
		
		//个人信息,2,4,7,
		StudentId:'',//学生ID
		
		//班级信息，14，16，19，
		ClassId:'',//班级ID
		
		//个人空间----26,28，37
		UserId:'',//用户ID
		EncIntro:''//附件简介
	}
	
	//用户空间，用户列表
	mod.model_userSpaceInfo = {
		TabId:'',//评论ID
		UserId:'',//评论用户ID
		UserSpaceId:'',//记事ID
		CommentContent:'',//评论或回复内容
		CommentDate:'',//评论或回复时间
		UpperId:'',//上级ID
		
		//31,49，
		ReplyId:'',//回复用户ID
		//51,
		MsgContent:'',//留言或回复内容
		
		MsgDate:''//留言或回复时间，49，
	}
	
	//56.（用户空间）获取与我相关
	mod.model_userSpaceAboutMe = {
		TabId:'',//留言ID
		UserId:'',//留言用户ID
		MsgType:'',//消息类型,1为其他用户评论2为评论的回复3为其他用户点赞4为其他用户留言5为留言的回复
		MsgDate:''//消息时间
	}

	return mod;

})(mui, publicModel || {});