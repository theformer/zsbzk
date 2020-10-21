// pages/exercise/assist/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserInfo:false,
    isPhoneNumber: false,
    userModelShow:false,//用户弹框信息授权
    phoneModelShow:false,///用户手机授权弹框
    showDlg:false,//授权弹框模糊层
    loadShow:false,//加载loading
    showDialog:false,//助力规则弹框
    showReceiveDialog:false,//领取兑换确认弹框
    showAssistSuccessDialog:false,//助力成功弹框
    timer:undefined,
    dialogShow:false,
    exerciseAssistUserList:[],
    shareModal:!0,
    scene:app.globalData.scene
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.id != undefined){
      that.setData({
        id:options.id,
      })
    }
    if(that.data.scene == 1154){
      that.setData({
        shareModal:!1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;
    this.setData({
      isIphoneX: isX || isXS,
    });

    if (that.data.id != undefined) {
      that.getExerciseAssist();
    } else {
      that.getExerciseAssistInfor();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                nickname: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
              })
            }
          })
        }
      }
    })
    if (typeof that.getTabBar === 'function' &&    that.getTabBar()) {
      that.getTabBar().setData({
        customTabBarSelected: 1
      })
    }
  },
  /**
   * 查询邀请助力活动信息
   */
  getExerciseAssist : function (){
    let that = this;
    that.setData({
      loadShow: true,
    })
    let userinfo = wx.getStorageSync(app.base.UserInfor);
    let obj = {
      url: app.base.getExerciseAssist,
      data: { 
        id:that.data.id ,
        openid: userinfo.openId||"",
        },
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          let result = res.V;
          that.showAssistData(result);
        }
      },
      complete:(res)=>{
        that.setData({
          loadShow: false,
        })
        wx.stopPullDownRefresh()
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 查询自身是否开团
   */
  getExerciseAssistInfor : function () {
    let that = this;
    let userinfo = wx.getStorageSync(app.base.UserInfor);
      that.setData({
        loadShow: true,
      })
      let obj = {
        url: app.base.getExerciseAssistInfor,
        data: {
          phone: userinfo.account,
        },
        success: (res) => {
          if (res.S == 1) {
            that.showAssistData(res.V);
          }
        },
        complete: (res) => {
          that.setData({
            loadShow: false,
          })
          wx.stopPullDownRefresh()
        }
      }
      app.request.wxRequest(obj);
  },
  showAssistData: function (result){
    let that = this;
    if(result.exerciseConfig ==undefined){
      that.getExerciseAssistInfor();
      return ;
    }
    let createTime = result.exerciseConfig.createTime.replace(/-/ig, '/').substring(0,19);
    let createDate = new Date(createTime);
    let endTime = result.exerciseConfig.endTime.replace(/-/ig, '/').substring(0, 19);
    let endDate = new Date(endTime);
    if (!that.data.timer){
      var i = setInterval(function () {
        that.countDown(parseInt(createDate.valueOf() / 1e3), parseInt(endDate.valueOf() / 1e3), "istime");
      }, 1e3);
      that.setData({
        timer: i,
      })
    }
    let countTime = (result.exerciseConfig.countdown / 3600000 ).toFixed(1);
    that.setData({
      userCredit:result.userCredit,
      exerciseInfo: result.exerciseConfig,
      createTime: result.exerciseConfig.createTime.substring(5, 10).replace("-","."), 
      endTime: result.exerciseConfig.endTime.substring(5, 10).replace("-", "."),
      state: result.state,
      countTime: countTime,
    })
    //(1:已发起继续邀请,2:已结束可以重新开启，3：已结束，冷却时间未过,4:已结束未领取，5:未发起助力)
    //(6:可以助力，7：已领取无法助力，直接我也要免费拿)
    if (result.state == 1 || result.state > 5) {
      that.setData({
        id: result.exerciseAssist.id,
        exerciseAssist: result.exerciseAssist,
        exerciseAssistUserList: result.exerciseAssistUserList,
      })
    } else if (result.state == 2) {

    } else if (result.state == 3) {
      let endTime = result.exerciseAssist.endTime.replace(/-/ig, '/').substring(0, 19);
      let exerciseEndTime = new Date(endTime).getTime();
      let currDate = new Date().getTime();
      exerciseEndTime += result.exerciseConfig.countdown;
      let countDownTime = (exerciseEndTime - currDate) / 1e3;
      that.setStartCountdown(countDownTime);    
      that.setData({
        id: result.exerciseAssist.id,
        exerciseAssist: result.exerciseAssist,
        exerciseAssistUserList: result.exerciseAssistUserList,
      })
    } else if (result.state == 4) {
      that.setData({
        id: result.exerciseAssist.id,
        exerciseAssist: result.exerciseAssist,
        exerciseAssistUserList: result.exerciseAssistUserList,
      })
    } else if (result.state == 5) {

    }
  },
  /**
   * 发起助力活动
   */
  sendExerciseAssist : function () {
    let that = this;
    let userInfo = wx.getStorageSync(app.base.UserInfor);
    if (userInfo != undefined && userInfo.account != undefined ){
      let obj = {
        url: app.base.sendExerciseAssist,
        data: {
          openid: userInfo.openId,
          phone: userInfo.account,
          nickname: userInfo.nickName || that.data.nickname ,
          avatarUrl: userInfo.photoUrl || that.data.avatarUrl 
        },
        success: (res) => {
          that.getExerciseAssistInfor();
          that.setData({
            dialogShow:true,
            showReceiveDialog:true
          })
        },
        complete: (res) => {
          that.setData({
            loadShow: false,
          })
          wx.stopPullDownRefresh()
        }
      }
      app.request.wxRequest(obj);
    }else{
      that.getUserOrPhone();
    }
  },
  /**
   * 参与助力
   */
  joinExerciseAssist : function () {
    let that = this;
    let userInfo = wx.getStorageSync(app.base.UserInfor);
      that.setData({
        loadShow: true,
      })
      let obj = {
        url: app.base.joinExerciseAssist,
        data: {
          openid: userInfo.openId,
          pid: that.data.id,
          nickname: that.data.nickname || userInfo.nickName,
          avatarUrl: userInfo.photoUrl || that.data.avatarUrl ,
          phone : userInfo.account
        },
        success: (res) => {
          if (res.S == 1) {
            let joinExerciseAssist = res.V;
            that.openAssistDialog();
            that.setData({
              joinExerciseAssist: joinExerciseAssist,
            })
          } else if (res.S == 0) {
            wx.showToast({
              icon: "none",
              title: res.msg,
            })
          } else {
            wx.showToast({
              icon: "none",
              title: res.msg,
            })
          }
        },
        complete: (res) => {
          that.setData({
            loadShow: false,
          })
          wx.stopPullDownRefresh()
        }
      }
      app.request.wxRequest(obj);

  },
  /**
   * 领取Vip
   */
  receiveExerciseAssist : function () {
    let that = this;
    if (that.data.exerciseAssist && that.data.exerciseAssist.credit > 0){
      let obj = {
        url: app.base.receiveExerciseAssist,
        data: {
          id: that.data.id,
        },
        success: (res) => {
          console.log(res);
          if (res.S == 1) {
            wx.showToast({
              icon: "none",
              title: "兑换成功",
            })
            that.toggleAssistDialog();
            that.getExerciseAssistInfor();
            app.request.login();
          } else if (res.S == 0) {
            wx.showToast({
              icon: "none",
              title: res.msg,
            })
          } else {
            wx.showToast({
              icon: "none",
              title: res.msg,
            })
          }
        }
      }
      app.request.wxRequest(obj);
    }else{
      wx.showToast({
        title: '您没有获得学分天数',
        icon:'none',
        duration:3000,
      })
    }
    
  },
  /**
   * 设置领取时间
   */
  setStartCountdown(end) {
    let that = this;
    let start = 0;
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    let cooldownsTime = setInterval(() => {
      start++;
      let watch = that.countDownDate(start, end);
      if (watch == '00:00:00') {
        clearInterval(cooldownsTime);
      } else {
        that.setData({
          clock: watch
        })
      }
    }, 1e3)
    that.setData({
      cooldownsTime: cooldownsTime
    })
  },
  countDown: function (t, i, e) {
    var a = parseInt(Date.now() / 1e3),
      r = (t > a ? t : i) - a,
      s = parseInt(r),
      n = Math.floor(s / 86400),
      o = Math.floor((s - 24 * n * 60 * 60) / 3600),
      l = Math.floor((s - 24 * n * 60 * 60 - 3600 * o) / 60),
      c = [n, o, l, Math.floor(s - 24 * n * 60 * 60 - 3600 * o - 60 * l)];
    if (this.setData({
      time: c
    }), "istime") {
      var u = "";
      t > a ? (u = "活动开始倒计时", this.setData({
        istime: 0
      })) : t <= a && i > a ? (u = "剩余时间", this.setData({
        istime: 1
      })) : (u = "活动已经结束，下次早点来~", this.setData({
        istime: 2
      })), this.setData({
        istimeTitle: u
      });
    }
  },
  countDownDate(start, end) {
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
      return `${h} 时 ${m} 分 ${s} 秒`
    }
  },
 
  autoScrollLine: function() {
    let that = this;
    
    /*判断滚动内容是否已经滚完，滚完了则滚动的值重新设置到0

    否则就每隔30毫秒向上滚动1px*/

    if (that.data.scrollTop >= that.data.offsetHeight){
      that.setData({
        scrollTop:0, 
      })
    }else {
      var scrollTop = that.data.scrollTop + 1;
      that.setData({
        scrollTop: scrollTop,
      })
    }
    /*判断滚动的距离刚好为一条公告的高度时停掉定时器，

    隔1s之后重新启动定时器即可实现公告滚动停留效果 */

    if (that.data.scrollTop % that.data.offsetHeight == 0) {
      clearInterval(that.data.timed)
      setTimeout(() => {
        that.data.timed = setInterval(that.autoScrollLine, 30);
      }, 1000)
    }
  },
  to_course(){
    wx.navigateTo({
      url: '/pages/credit_activity/course/page',
    })
  },
  /**
   * 打开助力成功弹框
   */
  openAssistDialog:function(){
    this.setData({
      showAssistSuccessDialog: true,
      dialogShow: true
    })
  },
  /**
   * 关闭助力成功弹框
   */
  colseAssistDialog:function(){
    this.setData({
      showAssistSuccessDialog: false,
      dialogShow:false
    })
    this.getExerciseAssist();
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
    if (this.data.dialogShow){
      wx.stopPullDownRefresh()
    }else{
      if (this.data.id != undefined) {
        this.getExerciseAssist();
      } else {
        this.getExerciseAssistInfor();
      }
    }
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
    var that = this;
    return {
      title: '自考课程全免费，不限时VIP免费领，快来助我一臂之力！',
      path: 'pages/credit_activity/assist/page?id=' + that.data.id,
      // imageUrl: 'https://tel.360xkw.com/attachment/assist-share.png',
      imageUrl:"../../../static/images/exercise/assist-share.png",
      success: (res) => {
        console.log("转发成功", res);
        if (res.shareTickets != undefined) {
          wx.getShareInfo({
            shareTicket: res.shareTickets,
            success: function (res) {

            }
          })
        }
      }
    }
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline : function(res){
    console.log(res);
    var that = this;
    return {
      title: '自考课程全免费，不限时VIP免费领，快来助我一臂之力！',
      query: "id=" + that.data.id,
      success: function(a) {},
      fail: function(a) {}
    };
  },
   /**
   * 控制 pop 的打开关闭
   * 该方法作用有2:
   * 1：点击弹窗以外的位置可消失弹窗
   * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
      dialogShow: !this.data.dialogShow,
    });

  },
  /**
   * 关闭弹框
   */
  dismissDlg: function () {
    var that = this;
    if (that.data.openType == "lookself") {
      that.getGroupMessageForOpenId();
    }
    that.setData({
      showDlg: false,
      dialogShow:false,
    })
  },
  /**
  * 控制 pop 的打开关闭
  * 该方法作用有2:
  * 1：点击弹窗以外的位置可消失弹窗
  * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
  */
  toggleAssistDialog() {
    this.setData({
      dialogShow: !this.data.dialogShow,
      showReceiveDialog: !this.data.showReceiveDialog
    }); 
  },
  /**
   * 关闭弹框
   */
  dismissAssistDlg: function () {
    var that = this;
    that.setData({
      dialogShow: !this.data.dialogShow,
      showDlg: false
    })
  },
  closeShareTips:function(){
    this.setData({
      shareModal:!1,
    })
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+ e.currentTarget.dataset.type,
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showDlg: true
    })
  },
  dismissDlg:function(){
    this.setData({
      showDlg: false
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showDlg: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})