const { UserInfor } = require("../../../../conf");

// miniprogram/pages/member/myCourse/video/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDlg: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.itemsId !=undefined){
      that.setData({
        itemsId : options.itemsId,
        subCourseId :options.subCourseId,
        materiaProper : options.materiaProper,
      })
    }
    wx.setNavigationBarTitle({
      title: options.itemsName,
    })
    that.getCourseVideos();
  },
  getCourseVideos(){
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    let obj = {
      url: app.base.getCourseVideos,
      data: {
        userId : userInfor.id,
        itemsId : that.data.itemsId,
        subCourseId : that.data.subCourseId,
        materiaProperId : that.data.materiaProper,
      },
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          that.setData({
            list : res.V,
            playVideo : res.V[0].videos[0]
          })
        }else{
          that.setData({
            list : [],
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 播放课程
   * @param {*} e item
   */
  playItem(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    that.setData({
      playVideo : item,
    })
  },
  videoStart(e){
    let that = this;
    that.playTimeCallback = setInterval(function(){
      app.common.addUserCountTaskRecord({
        subtype:9,
        count:1,
      })
    },6e4);
    
  },
  videoEnd(e){
    clearInterval(this.playTimeCallback);
  },
  
  /**
   * 签到
   */
  userSignIn: function() {
    wx.navigateTo({
      url: '/pages/member/singin/page',
    })
  },

  /**
   * 反馈
   */
  to_feedback(){
    wx.navigateTo({
      url: '/pages/member/feedback/page',
    })
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+e.currentTarget.dataset.type,
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
  onShareAppMessage: function (res) {
    app.common.addUserTaskRecord({id: this.data.playVideo.id , subtype: 8 })
    return {
      title: "课程视频免费学",
      path: 'pages/home/index/page',
      imageUrl: "/static/images/share/item-share.png",
    }
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