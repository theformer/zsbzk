// pages/member/index/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadshow: false,
    showDlg: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
  },
  init: function() {
    const that = this;
    let member = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(member)) {
      that.setData({
        member: member,
      })
      that.getUserHistoryCount();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  getUserHistoryCount: function() {
    const that = this;
    let obj = {
      url: app.base.getUserHistoryCount,
      data: {
        userId: that.data.member.id,
      },
      success: (res) => {
        if (res.S == 1) {
          let userHistory = res.V,
          userHistoryCount = {};
          userHistory.forEach(item => {
            if (item.type == 0) { //0-浏览记录，
              userHistoryCount.llcount = item.count;
            } else if (item.type == 1) { //1-发帖，
              userHistoryCount.ftcount = item.count;
            } else if (item.type == 2) { //2-评论，
              userHistoryCount.plcount = item.count;
            } else if (item.type == 3) { //3-点赞
              userHistoryCount.dzcount = item.count;
            }
          });
          that.setData({
            userHistoryCount: userHistoryCount,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  userSignIn: function() {
    wx.navigateTo({
      url: "/pages/member/singin/page"
    })
  },
  openFeedback: function() {
    wx.navigateTo({
      url: '/pages/member/feedback/page',
    })
  },
  userLogin:function(e){
    this.init();
  },
  openSingIn: function() {
    wx.navigateTo({
      url: '/pages/member/singin/page',
    })
  },
  openBlacklist:function(){
    wx.navigateTo({
      url: '/pages/member/blacklist/page',
    })
  },
  to_myCourse:function(){
    wx.navigateTo({
      url: '/pages/member/myCourse/list/page',
    })
  },
  to_activity:function(){
    wx.navigateTo({
      url: '/pages/credit_activity/course/page',
    })
  },
  dismissDlg: function (res) {
    this.setData({
      showDlg: !this.data.showDlg,
    })
  },
  preventTouchMove: function () {
    this.setData({
      showDlg: false,
    })
  },
  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let t = this;
    t.init();
    if (typeof t.getTabBar === 'function' && t.getTabBar()) {
      t.getTabBar().setData({
        customTabBarSelected: 2
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showDlg: true
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