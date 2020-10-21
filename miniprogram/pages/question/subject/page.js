// miniprogram/pages/question/subject/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   * @questionList  题目列表
   * @didAnswerSet  用户选择答案列表
   * @answerList    是否正确做题列表
   * @correctAnswer 题目正确答案列表
   * @didQuestionIdSet  已做题目合集
   */
  data: {
    Islook_up:false,
    currentId:0,
    activeIndex:0,
    submitPaperShow:false,
    examScore:0,//答题分数
    loadModal:false,//加载框动态
    collectionList:[],//收藏列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.paperType != undefined){
      that.setData({
        paperType:options.paperType,
      })
    }
    if(options.questionId != undefined){
      that.setData({
        questionIds:[options.questionId],
      })
      that.getQuestionListByIds();
    }else
    if(options.paperId != undefined ){

    }else{
      const eventChannel = that.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(res) {
        that.setData({
          paper:res.data.paper,
          questionIdTypes:res.data.questionIdTypes,
        })
        that.init();
      })
      eventChannel.on('collDataFromOpenerPage', function(res) {
        that.setData({
          paper:res.data,
          questionIds:res.data.questionLibId,
          collectionList:res.data.questionLibId,
        })
        that.getQuestionListByIds();
      })
      eventChannel.on('wrongDataFromOpenerPage', function(res) {
        that.setData({
          paper:res.data,
          questionIds:res.data.questionLibId,
        })
        that.getQuestionListByIds();
      })
    }
    let navBarTitle ="试题";
    if (that.data.paperType == 1) {
      navBarTitle="模拟练习";
      that.setData({
        auth:0,
      })
    } else if (that.data.paperType == 2) {
      navBarTitle="模拟考试";
      that.setData({
        auth:1,
      })
    } else if(that.data.paperType == 3){
      navBarTitle="我的收藏";
    } else if(that.data.paperType == 4){
      navBarTitle="我的错题";
    }
    wx.setNavigationBarTitle({
      title: navBarTitle,
    })
    wx.getSystemInfo({
      success: (e) => {
        let info = wx.getMenuButtonBoundingClientRect()  // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
        let CustomBar = info.bottom + info.top - e.statusBarHeight + 10;
        that.setData({
          CustomBar : CustomBar,
          windowHeight: parseInt(e.windowHeight * 0.9),
        })
      },
    })
  },
  init : function(){
    let that =this;
    let questionIds = [];
    that.data.questionIdTypes.sort(function(a, b){
      return  a[1] - b[1] ;
    }); 
    that.data.questionIdTypes.forEach(v=>{
      questionIds.push(v[0]);
    })
    that.setData({
      questionIds:questionIds,
    })
    that.getQuestionListByIds();
    that.getCollectionSubcourseCount();
  },
  /**
   * 获取试题列表
   */
  getQuestionListByIds: async function(){
    let that = this;
    let questionIds = that.data.questionIds.join(",");
    let obj = {
      url: app.base.getQuestionListByIds,
      data: {
        questionIds: questionIds,
      },
      success: (res) => {
        if (res.S == 1) {
          let questionList = res.V;
          let didAnswerSet = new Array(questionList.length),
          answerList = new Array(questionList.length),
          didQuestionIdSet = new Array(questionList.length),
          answerState = new Array(questionList.length),
          questionTypes = [],
          correctAnswer = [];
          questionList.forEach((item, index, arr) => {
            correctAnswer.push(item.obAnswer);
            questionTypes.push(item.questionTypeId);
            if ((that.data.errorType != undefined && that.data.errorType == 1 )|| that.data.paper_record != undefined || that.data.question_record != undefined) {
                didAnswerSet.splice(index, 1, item.answer);
            }
          })
          
          that.setAnswerTime();
          that.setData({
            questionList: questionList,
            didAnswerSet:didAnswerSet,
            answerList:answerList,
            correctAnswer:correctAnswer,
            didQuestionIdSet:didQuestionIdSet,
            answerState:answerState,
            questionTypes:questionTypes,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 获取用户收藏
   */
  getCollectionSubcourseCount(){
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    let subcourse = wx.getStorageSync('subCourse');
    let param = {
      subcourseId : subcourse.subCourseId,
    }
    if(app.empty(userInfor)){
      param.userId =  userInfor.id;
    }else{
      return;
    }
    let obj = {
      url: app.base.getCollectionSubcourseCount,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          let list =  res.V;
          list.forEach(v=>{
            if(v.id==that.data.paper.id){
              that.setData({
                collectionList : v.questionLibId,
              })
            }
          })
        }else{
          that.setData({
            collectionList : [],
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * swiper滑动事件
   */
  bindChange (e) {
    let that = this;
    let question = that.data.questionList[e.detail.current];
    if(question.questionTypeId==5 && !that.data.answerList[e.detail.current]){
      that.setData({
        ["answerList["+ e.detail.current +"]"]:2,
        ["examScore"] : that.data.examScore + question.score,
        ["didQuestionIdSet["+ e.detail.current +"]"] : question.id,
      })
    }
    that.setData({
      activeIndex: e.detail.current
    })
  },
   /**
   * 单选题事件
   */
  get_answer(e) {
    let that = this;
    let correctAnswer = that.data.correctAnswer;
    let currentId = that.data.activeIndex;
    let answer = e.currentTarget.dataset.answer;
    let answerList = that.data.answerList;
    let didAnswerSet = that.data.didAnswerSet;
    let questionList = that.data.questionList;
    if (didAnswerSet[currentId] == null && !that.data.Islook_up && answerList[currentId] == null) {
      let reuslt =  correctAnswer[currentId] == answer ? '2' : "4";
      that.setData({
        ["didAnswerSet["+ currentId +"]"] : answer,
        ["answerList["+ currentId +"]"] : correctAnswer[currentId] == answer ? '2' : "4",
        ["examScore"] : that.data.examScore + questionList[currentId].score,
        ["didQuestionIdSet["+ currentId +"]"] : questionList[currentId].id,
      })
      if (reuslt == 2 || that.data.auth == 1) {
        that.nextQuestion(currentId + 1);
      }
    }
  },
  /**
   * 多选题事件
   */
  get_answer_many(e) {
    let that = this;
    let currentId = that.data.activeIndex;
    let answer = e.currentTarget.dataset.answer;
    let didAnswerSet = that.data.didAnswerSet;
    let answerList = that.data.answerList;
    if (answerList[currentId] == null && !that.data.Islook_up) {
        let arr = !didAnswerSet[currentId] ?  [] : didAnswerSet[currentId].split(',');
        arr.indexOf(answer) > -1 ? arr.splice(arr.indexOf(answer), 1) : arr.push(answer);
        arr.sort();
        if(didAnswerSet != undefined){
            that.setData({
              ["didAnswerSet["+ currentId +"]"] : arr.join(','),
            })
        }
    }
  },

  /**
   * 多选题提交
   */
  submit_many(e) {
    let that = this;
    let correctAnswer = that.data.correctAnswer;
    let answerList = that.data.answerList;
    let didAnswerSet = that.data.didAnswerSet;
    let currentId = that.data.activeIndex;
    let questionList = that.data.questionList;
    if (didAnswerSet[currentId]) {
        let reuslt = correctAnswer[currentId] == didAnswerSet[currentId] ? 2 : 4;
        that.setData({
          ["answerList["+ currentId +"]"] : reuslt,
          ["examScore"] : that.data.examScore + questionList[currentId].score,
          ["didQuestionIdSet["+ currentId +"]"] : questionList[currentId].id,
        })
        if (reuslt == 2 || that.data.auth == 1) {
            that.nextQuestion(currentId + 1);
        }
    } else {
      wx.showToast({
          icon: 'none',
          title: '请选择答案！',
      })
    }
  },
  /**
   * 判断题事件
   */
  get_answer_judge(e) {
    let that = this;
    let correctAnswer = that.data.correctAnswer;
    let currentId = that.data.activeIndex;
    let answer = e.currentTarget.dataset.answer;
    let answerList = that.data.answerList;
    let didAnswerSet = that.data.didAnswerSet;
    let questionList = that.data.questionList;
    if (didAnswerSet[currentId] == null && !that.data.Islook_up && answerList[currentId] == null) {
      let reuslt = correctAnswer[currentId] == answer ? '2' : "4"
        that.setData({
          ["didAnswerSet["+ currentId +"]"] : answer,
          ["answerList["+ currentId +"]"] : reuslt,
          ["examScore"] : that.data.examScore + questionList[currentId].score,
          ["didQuestionIdSet["+ currentId +"]"] : questionList[currentId].id,
        })
        if (reuslt == 2 || that.data.auth == 1) {
            that.nextQuestion(currentId + 1);
        }
    }
  },
  /**
   * 跳转位置
   */
  nextQuestion(currentId){
    let that = this;
    if(currentId == that.data.questionIds.length){
      wx.showToast({
        icon: 'none',
        title: '最后一题啦',
      })
    }else{
      that.setData({
        currentId:currentId,
      })
    }
  },

  /**
   * 答题卡
   */
  openAnswerList(){
    let that = this;
    wx.navigateTo({
      url: '/pages/question/answerList/page',
      events: {
        questionChange: function(res) {
          that.nextQuestion(res.index)
        },
        paperSubmit:function(res){
          that.changeSubmit();
        }
      },
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          questionTypes : that.data.questionTypes,
          answerList : that.data.answerList,
        })
      }
    })
  },
  /**
   * 查看解析
   */
  clickAnswerState: function () {
    let that = this;
    let currentId = that.data.activeIndex;
    that.setData({
      ["answerState["+ currentId +"]"] : !that.data.answerState[currentId]
    })
  },
  /**
   * 收藏事件
   */
  checkCollection(){
    let that = this;
    let subcourse = wx.getStorageSync('subCourse');
    let userInfo = wx.getStorageSync(app.base.UserInfor);
    let collectionList = that.data.collectionList;
    let questionLibId = that.data.questionIds[that.data.activeIndex];
    let obj = {
      url: app.base.editUserCollection,
      data: {
        subcourseId: subcourse.subCourseId,
        paperId:that.data.paper.id,
        questionLibId:questionLibId,
        userId:userInfo.id,
        courseId: app.base.courseId,
      },
      success: (res) => {
        if(res.S==1){
          wx.showToast({
            title:res.msg,
            icon: 'none',
            duration: 3000,
          })
          collectionList.indexOf(questionLibId) > -1 ? collectionList.splice(collectionList.indexOf(questionLibId), 1) : collectionList.push(questionLibId);
          that.setData({
            collectionList:collectionList,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 移除错题
   */
  deleteRecord(){
    let that = this;
    that.setData({
      loadModal:!0,
    })
    let userInfo = wx.getStorageSync(app.base.UserInfor);
    let questionId = that.data.questionIds[that.data.activeIndex];
    let obj = {
      url: app.base.deleteWrongReviews,
      data: {
        userId:userInfo.id,
        ids:questionId,
      },
      success: (res) => {
        that.setData({
          loadModal:!1,
        })
        if(res.S==1){
          wx.showToast({
            title: "移除成功,下次进入不在显示该题目",
            icon:"none",
          })
          that.nextQuestion(that.data.activeIndex+1);
        }else{
          wx.showToast({
            title: res.msg,
            icon:"none",
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 纠错
   */
  recovery_question(){
    wx.navigateTo({
      url: '/pages/member/feedback/page',
    })
  },
  /**
   * 交卷model切换
   */
  changeSubmit() {
    let that = this;
    if(!that.data.Islook_up){
      this.setData({
        submitPaperShow: !that.data.submitPaperShow
      })
    }
  },
  /**
   * 提交试卷事件
   */
  submitPaper(){
    let that = this;
    that.setData({
      loadModal:!0,
      submitPaperShow: !this.data.submitPaperShow
    })
    let subCourse = wx.getStorageSync('subCourse');
    let userInfo = wx.getStorageSync(app.base.UserInfor);
    let paper = that.data.paper;
    let submitParam = {
      userId: userInfo.id,
      doTypeId: paper.paperTypeId,
      courseId: app.base.courseId,
      paperId:paper.id,
      subcourseId: subCourse.subCourseId,
      selectedQuestionIdSet: that.data.questionIds.filter(d => d).join(","),
      didQuestionIdSet: that.data.didQuestionIdSet.filter(d => d).join(","),
      didAnswerSet: that.data.didAnswerSet.filter(d => d).join("|"),
      answerCorrectSet: that.data.answerList.filter(d => d).join("|"),
      examScore: that.data.examScore,
      isAutoNext: 1,
      usedTime: that.data.startTime,
      isComplete: true
    };
    let obj = {
      url: app.base.saveUserCurrentStateForApp,
      data: submitParam,
      success: (res) => {
        
        clearInterval(that.data.answerTime);
        that.setData({
          loadModal:!1,
        })
        if(res.S==1){
          that.setData({
            paperReport:res.V,
          })
          app.common.addUserCountTaskRecord({
            subtype:10,
            count:res.V.didQuestionIds,
          })
          that.toReport();
        }
      }
    }
    app.request.wxRequest(obj);
  },
  
  /**
   * 打开评论报告
   */
  toReport(){
    let that = this;
    wx.navigateTo({
      url: '/pages/question/paperReport/page',
      events: {
        restart: function(res) {
          that.setData({
            paperReport:undefined,
            didAnswerSet:new Array(that.data.questionIds.length),
            answerList:new Array(that.data.answerList.length),
            didQuestionIdSet:new Array(that.data.didQuestionIdSet.length),
            
          })
          that.setAnswerTime();
          that.nextQuestion(0);
        },
        look_answer:function(res){
          that.setData({
            paperReport:undefined,
            Islook_up:!0,
          })
        },
      },
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          paperReport : that.data.paperReport,
          CustomBar : that.data.CustomBar,
        })
      }
    })
  },

  /**
   * 监听上移下移
   */
  situation_touchmove(e){
    let that= this;
    that.setData({
      ["questionList["+ that.data.activeIndex +"].situationMove"] : e.changedTouches[0].pageY
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if(that.data.paperReport != undefined){
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
        
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "课程视频免费学",
      path: 'pages/home/index/page',
      imageUrl: "/static/images/share/item-share.png",
    }
  },
  /**
   * 设置答题时间
   */
  setAnswerTime(){
    let that = this;
    let start=0;
    let end = that.data.paper ? (that.data.paper.answerTime || 150) *60 : 150 * 60;
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    let answerTime = setInterval(() => {
      start++;
      let watch = that.countDown(start,end);
      if (watch == '00:00:00') {
        clearInterval(answerTime)
        that.submitPaper();
      } else {
        that.setData({
          startTime: start,
          clock: watch
        })
      }
    }, 1000)
    that.setData({
      answerTime: answerTime
    })
  },
  countDown(start,end){
    if (end <= start) {
      return '00:00:00'
    }
    let h = Math.floor((end - start) / 3600)
    if (h < 10) {
      h = '0' + h
    }
    let m = Math.floor(((end - start) % 3600) / 60)
    if (m < 10) {
      m = '0' + m
    }
    let s = Math.floor((end - start) % 60)
    if (s < 10) {
      s = '0' + s
    }
    if (Number(h) < 24) {
      return `${h}:${m}:${s}`
    }
  },
  /**
   * 收藏列表匹配
   */
  collectionMatch(res){
    
  }
})