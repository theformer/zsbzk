var base = {};
/**
 * 服务器地址
 */
base.url = 'http://test.360xkw.com:8086';
// base.url="https://zkb.360xkw.com";
// base.url = 'http://192.168.2.177:8087/zkb';
base.uploadUrl ="https://uploadzkb.360xkw.com/uploadzkb";
// base.url = 'http://192.168.0.118:8080/';
base.imgUrl ="https://uploadzkb.360xkw.com/";
/**
 * 云开发环境
 */
base.env = "add-1guu6pjy222da6c7";
// base.env = "zkb-jgjrk";
/**
 * 自考默认Id
 */
base.courseId = 491;
/**
 * 自考证书id
 */
base.course_id = 5;
base.getProvinceList ="/sysParam/getProvinceListNoLogin.do";//获取省份
base.getCourseLevel ="/course/getCourseLevelNoLogin.do";//获取专业
/**资讯接口 */
base.getNewsType = "/news/getNewsTypeNoLogin.do";//获取所有资讯频道
base.getNewsByType = "/news/getNewsByTypeNoLogin.do";//根据频道获取资讯（分页）
base.getCommentList ="/comment/getCommentListNewNoLogin.do";//获取资讯社区评论列表（新）
// base.getCommentList ="/comment/getCommentListNoLogin.do";//获取资讯社区评论列表（旧）
base.addComment ="/comment/addComment.do";//添加评论
base.getNewsById= "/news/getNewsByIdNoLogin.do";//通过id获取资讯
base.getCommentById = "/comment/getCommentByIdNoLogin.do"//通过评论id获取评论及回复列表
base.addStuInfoXKW ="/stuInfo/addStuInfoXKW.do"//点击添加老师微信录入信息海
/**
 * 社区接口
 */
base.getModules = "/community/getModulesNoLogin.do";// 获取社区版块
base.getTopics= "/community/getTopicsNoLogin.do";//获取热门话题
base.getHotPosts = "/community/getHotPostsNoLogin.do";//获取热榜帖子
base.getPostByModule = "/community/getPostByModuleNoLogin.do";//获取指定论坛帖子
base.getPostByLabel="/community/getPostByLabelNoLogin.do";//获取精选帖子
base.getVideoPost = "/community/getVideoPostNoLogin.do";//获取视频专区帖子  
base.getPostById = "/community/getPostByIdNoLogin.do";//通过id获取帖子
base.getHotTopics = "/community/getHotTopicsNoLogin.do"//获取热门话题
base.deleteComment = "/comment/deleteComment.do"//删除评论
base.deleteUserLikeRecord = "/community/deleteUserLikeRecord.do"//删除用户点赞记录
base.deletePost = "/community/deletePost.do"//删除帖子
base.getMarkList = "/community/getMarkListNoLogin.do"//获取标记信息
base.addUserMark = "/community/addUserMark.do"//添加帖子、评论标记
base.addShareCount ="/community/addShareCountNoLogin.do"//添加分享计数

/**
 * 评论接口
 */
base.addCommentLikeCount ="/comment/addCommentLikeCount.do";//评论点赞

/**
 * 题库
 */

base.getUserReportCount ="/tiku/report/getUserReportCountNoLogin.do"//题库模块获取统计数据
base.getPaperQuestionIdTypesFor ="/tiku/paper/getPaperQuestionIdTypesForAppNoLogin.do"//获取试卷列表
base.getCollectionSubcourseCount ="/tiku/userCollection/getSubcourseCountNoLogin.do";//获取收藏的列表
base.getSubcourseReportDetialByPage ="/tiku/report/getSubcourseReportDetialByPageNoLogin.do"//获取做题记录
base.getPaperQuestionIdBypaperId = "/tiku/paper/getPaperQuestionIdBypaperId.do"//获取试卷所有试题信息
base.getRedoQuestionIdTypes ="/tiku/didRecord/getRedoQuestionIdTypesNoLogin.do"//获取做题记录详细做题数据
base.getwrongReviewSubcourseCount ="/tiku/wrongReview/getSubcourseCountNoLogin.do"//获取错题列表
base.deleteWrongReviews ="/tiku/wrongReview/deleteWrongReviewsNoLogin.do"//移除错题
base.saveUserCurrentStateForApp ="/tiku/currentState/saveUserCurrentStateForAppSubmitNoLogin.do"//提交试卷
base.questionRecoveryQuestion ="/tiku/questionLib/recoveryQuestionNoLogin.do"//试题纠错
base.getQuestionListByIds ="/tiku/paper/getQuestionListByIdsNoLogin.do"//获取试题信息
base.editUserCollection ="/tiku/userCollection/editUserCollectionNologin.do"//获取添加和修改收藏

/**
 * 个人中心
 */
base.getUserHistoryCount = "/user/getUserHistoryCount.do";//获取用户浏览记录统计信息
base.recoveryQuestion = "/tiku/questionLib/recoveryQuestionNoLogin.do";//意见反馈
base.addUserTaskRecord = "/task/addUserTaskRecord.do";//添加用户分享、浏览任务记录
base.addUserHistory ="/community/addUserHistory.do";//添加用户浏览记录
base.userSignIn ="/task/userSignIn.do"//用户签到
base.getUserSignInRecord ="/task/getUserSignInRecordNoLogin.do";//获取用户签到列表
base.getUserCreditRecord = "/user/getUserCreditRecord.do";//获取用户积分记录
base.getUserTextPost = "/community/getUserTextPost.do"//获取我发布的图文帖子
base.getUserVideoPost = "/community/getUserVideoPost.do";//获取我发布的视频帖子
base.getMyCommentList =  "/comment/getMyCommentList.do";//获取我的评论列表
base.getUserLikeRecordList = "/community/getUserLikeRecordList.do"//获取我的点赞记录列表
base.getUserRecordHistory = "/user/getUserRecordHistory.do"//获取我的记录列表
base.getUserCreditDailyAddCount = "/user/getUserCreditDailyAddCount.do"//获取用户每日赚取学分和总学分统计
base.getUserTask = "/task/getUserTask.do"//获取任务列表
base.getUserBlackList = "/user/getUserBlackList.do"//获取黑名单用户记录
base.deleteUserFromBlackList = "/user/deleteUserFromBlackList.do"//从黑名单中移除用户
base.addUserCountTaskRecord ="/task/addUserCountTaskRecord.do"//添加用户观看视频、做题任务记录
/**
 * 课程接口
 */
base.getCourseList ="/course/getCourseListNoLogin.do";//通过省份专业获取课程
base.exchangeCourse ="/course/exchangeCourse.do"//兑换课程
base.getUserCourse = "/course/getUserCourse.do"//获取我的课程
base.getVideoSubCourseAndMateriaProperByItemsId ="/course/getVideoSubCourseAndMateriaProperByItemsIdNoLogin.do";//通过课程Id获取课程包含的科目及视频列表信息
base.getCourseVideos ="/course/getCourseVideosNoLogin.do"//获取课程视频列表
/** 自考助力接口 statr*/
base.getExerciseAssist = "/applets/exercise/getExerciseAssistNologin.do";//查询团信息
base.getExerciseAssistInfor = "/applets/exercise/getExerciseAssistValidInforNologin.do";//查询自身是否开团
base.sendExerciseAssist = "/applets/exercise/sendExerciseAssistNologin.do";//发起助力活动
base.joinExerciseAssist = "/applets/exercise/joinExerciseAssistNologin.do";//参与助力
base.receiveExerciseAssist = "/applets/exercise/receiveExerciseAssistNologin.do";//领取Vip
/**
 * 上传图片
 */
base.uploadImg = "/manager/file/uploadImgforum.do"//上传单张图片
base.uploadImages ="/manager/file/uploadImgsforum.do"//上传多张图片
base.uploadVideo = "/manager/file/uploadVideoForum.do"//上传视频
base.addPost= "/community/addPost.do"//发布帖子

/**
 * 帖子审核
 */
base.checkMsg = "/weixin/checkMsgNoLogin.do";//检验内容
base.checkImg = "/weixin/checkImgNoLogin.do";//检验图片

/**
 * 用户交互事件
 */
base.addLikeCount ="/community/addLikeCount.do"//资讯帖子点赞

/**
 * 高德地图key
 */
base.mapKey = "b5d26b4c5699e54ed11d1e800e69011c";
/**
 * 账号信息接口 start
 */
base.getUserforLogin = '/user/applicationRegistLogin.do'; //登录解密接口
base.getUserInfor = '/user/getWeixinUnionIDNoLogin.do'; //用户信息解密接口
base.getPhoneNumber="/user/getPhoneNumberNoLogin.do"//用户手机号解密
base.smsRegist ="/user/smsRegistLogin.do";//测试短信登录 
/**
 * 数据库KYE
 */
base.GetUserInforState = "GetUserInforState"; //是否授权获取用户信息
base.UserInfor = "UserInfor"; //用户信息
base.UserInforData = "UserInforData"; //用户信息保存日期
base.GetUserPhoneNumBerState = "GetUserPhoneNumBerState"; //是否授权获取用户手机号
base.Config = 'Config';//用户的课程
base.SharePaper = "SharePaper"//用户分享的试卷
base.UserPhoneNumber = "UserPhoneNumber"; //用户手机号
base.UserSelectSubject = "UserSelectSubject"; //用户做题选择的科目
base.QuestionDataList = "QuestionDataList"; //用户做题的题目数据
base.DoQuestionNum = "DoQuestionNum"; //用户做题的次数
base.DoQuestionNumData = "DoQuestionNumData"; //用户做题的次数保存日期
base.UserInforSesstion = "UserInforSesstion"; //用户初级session保存
base.UserInforSesstionData = "UserInforSesstionData"; //用户初级session保存日期
base.UserScenesData = "UserScenesData"; //用户进入的场景值是否能开启关注公众号场景值
base.UserOpenId = "UserOpenId"; //单独存储用户openid
base.UserWximg = "UserWximg"; //单独存储用户微信头像
base.UserNickName = "UserNickName"; //单独存储微信昵称
base.UserVip = "UserVip";//是否VIP用户
base.VipDay = "VipDay";//VIP剩余天数

/**
 * 请求回调EvevtBus
 */
base.EventBusForNormal = "EventBusForNormal";//默认回调
base.EventBusForLogin = "EventBusForLogin";//登录回调
base.EventBusForPhoneNumber = "EventBusForPhoneNumber";//手机号码授权回调
base.EventBusForUserInfor = "EventBusForUserInfor";//用户信息授权回调
base.EventBusForUserOpenId = "EventBusForUserOpenId";//用户openid解析回调
base.EventBusForUserPhone = "EventBusForUserPhone";//用户手机号解析回调


module.exports = base;