// pages/member/singin/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isToday:false,
    showDlg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let userinfo = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userinfo)){
      that.setData({
        userinfo: userinfo,
      })
      let obj = {
        url: app.base.userSignIn,
        data: {
          userId: that.data.userinfo.id,
          type: 1,
          subtype: 1,
        },
        success: (res) => {
          if (res.S == 1) {
            wx.showToast({
              title: "签到成功",
              icon: 'none',
              duration: 3000,
            })
          }
          that.getUserSignInRecord();
          that.getUserCreditDailyAddCount();
        }
      }
      app.request.wxRequest(obj);
      that.getUserTask();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    // var context = wx.createCanvasContext('sign-progress');

  },
  getUserSignInRecord:function(){
    const that = this;
    let obj = {
      url: app.base.getUserSignInRecord,
      data: {
        userId: that.data.userinfo.id,
      },
      success: (res) => {
        if (res.S == 1) {
          let signArr = res.V;
          let signDays = 0;
          let isToday = that.data.isToday;
          signArr.forEach(item=>{
            if(item.state){
              signDays++;
              if (item.isToday){
                isToday = true;
              }
            }
          })
          that.setData({
            signDays: signDays,
            isToday: isToday,
            signArr: signArr,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  getUserCreditDailyAddCount:function(){
    const that = this;
    let obj = {
      url: app.base.getUserCreditDailyAddCount,
      data: {
        userId: that.data.userinfo.id,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            creditCount: res.V.creditCount,
            addCredit: res.V.addCredit,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  getUserTask:function(){
    const that = this;
    let obj = {
      url: app.base.getUserTask,
      data: {
        userId: that.data.userinfo.id,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            userTask:res.V
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  go_task : function (e) {
    const that = this;
    let item = e.currentTarget.dataset.item;
    if(item.state){
      wx.showToast({
        title: '任务已完成，明日再来',
        icon: 'none',
        duration: 3000,
      })
    }else{
      if(item.id == 4){
        wx.navigateTo({
          url: '/packageA/pages/community/release/page',
        })
      }else if(item.id > 4  && item.id < 10){
        app.globalData.navItem = 1;
        wx.switchTab({
          url: '/pages/home/index/page',
        })
      }else if(item.id == 11 || item.id == 10 || item.id == 44 || item.id == 45){
        wx.navigateTo({
          url: '/pages/member/myCourse/list/page',
        })
      }else if(item.id == 12 || item.id == 46){
        app.globalData.navItem = 0;
        wx.switchTab({
          url: '/pages/home/index/page',
        })
      }else if(item.id == 42 || item.id == 43){
        app.globalData.navItem = 1;
        wx.switchTab({
          url: '/pages/home/index/page',
        })
      }
    }
  },
  userSignIn: function () {
    const that = this;
    if (that.data.isToday){
      return;
    }
    if(!app.empty(that.data.userinfo)){
      wx.showToast({
        title: '请登录后在操作!',
        icon:'none',
        duration:3000,
      })
      return;
    }
    let obj = {
      url: app.base.userSignIn,
      data: {
        userId: that.data.userinfo.id,
        type: 1,
        subtype: 1,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            signDays: that.data.signDays+1,
            isToday:true,
          })
          wx.showToast({
            title: "签到成功",
            icon: 'none',
            duration: 3000,
          })
          that.getUserCreditDailyAddCount();
        } else {
          wx.showToast({
            title: "您已经签到！",
            icon: 'none',
            duration: 3000,
          })
          that.setData({
            isToday:true
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  to_activity(){
    wx.navigateTo({
      url: '/pages/credit_activity/course/page',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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