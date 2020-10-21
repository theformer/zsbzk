// pages/member/publish/page.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:20,
    VideoIndex:1,
    TextIndex:1,
    videoPost:[],
    textPost:[],
    tabIndex:0,
    imgUrl: app.base.imgUrl,
    delShow:false,
    delId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    that.getUserVideoPost();
    that.getUserTextPost();
  },
  getUserVideoPost:function(){
    const that = this;
    let param = {
      pageSize: that.data.pageSize,
      pageIndex: that.data.VideoIndex,
    };

    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getUserVideoPost,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            pullUp: true,
            refresher:false,
            ["videoPost[" + (that.data.VideoIndex - 1) + "]"]: res.V,
            VideoIndex: that.data.VideoIndex + 1
          })
        } else {
          if (that.data.VideoIndex == 1) {
            that.setData({
              refresher: false,
              videoPost: [],
            })
          }
        }
        wx.stopPullDownRefresh();
      }
    }
    app.request.wxRequest(obj);
  },
  getUserTextPost:function(){
    const that = this;
    let param = {
      pageSize: that.data.pageSize,
      pageIndex: that.data.TextIndex,
    };

    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getUserTextPost,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            pullUp: true,
            refresher:false,
            ["textPost[" + (that.data.TextIndex - 1) + "]"]: res.V,
            TextIndex: that.data.TextIndex + 1
          })
        }
        else {
          if (that.data.TextIndex == 1) {
            that.setData({
              refresher:false,
              textPost: [],
            })
          }
        }
        wx.stopPullDownRefresh();
      }
    }
    app.request.wxRequest(obj);
  },
  onchange:function(e){
    const that = this;
    that.setData({
      tabIndex: e.currentTarget.dataset.id,
      current: e.currentTarget.dataset.id,
    })
  },
  swiperChange: function (e) {
    const that = this;
    that.setData({
      tabIndex: e.detail.current
    })
  },
  openArticle: function (e) {
    const that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/community/article/page?id=' + id,
    })
  },
  openDelete:function(e){
    const that = this;
    that.setData({
      delId: e.currentTarget.dataset.id,
      delShow:true,
    })
  },
  confirmDel:function(){
    const that = this;
    let obj = {
      url: app.base.deletePost,
      data: {
        id:that.data.delId,
      },
      success: (res) => {
        if (res.S == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            delId: 0,
            delShow: false,
            VideoIndex: 1,
            TextIndex: 1,
            videoPost:[],
            textPost:[],
          })
          that.getUserVideoPost();
          that.getUserTextPost();
        }
      }
    }
    app.request.wxRequest(obj);
  },

  cancelDel:function(e){
    this.setData({
      delShow:false,
    })
  },

  getPostNewDate:function(){
    let that = this;
    that.setData({
      TextIndex: 1,
      refresher: true,
    })
    that.getUserTextPost();
  },
  getVideoNewDate:function(){
    let that = this;
    that.setData({
      VideoIndex: 1,
      refresher: true,
    })
    that.getUserVideoPost();
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

  }
})