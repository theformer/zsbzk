// pages/member/myComment/page.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 20,
    pageIndex: 1,
    commentList:[],
    enabled:true,
    refresher:false,
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
    that.getUserLikeRecordList();
  },
  getUserLikeRecordList: function () {
    const that = this;
    let param = {
      pageSize: that.data.pageSize,
      pageIndex: that.data.pageIndex,
    };

    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getUserLikeRecordList,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          let commentList = util.ArrbyDate(res.V, "likeTime");
          that.setData({
            refresher: false,
            ["commentList[" + (that.data.pageIndex - 1) + "]"]: commentList,
            pageIndex: that.data.pageIndex + 1,
          })
        }
        else {
          if (that.data.pageIndex == 1) {
            that.setData({
              refresher: false,
              commentList: [],
            })
          }
        }
      }
    }
    app.request.wxRequest(obj);
  },
  openArticle: function (e) {
    const that = this;
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/home/article/page?id=' + id,
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '/packageA/pages/community/article/page?id=' + id,
      })
    }
  },
  deleteUserLikeRecord: function (e) {
    const that = this;
    let a = e.currentTarget.dataset.a;
    let b = e.currentTarget.dataset.b;
    let c = e.currentTarget.dataset.c;
    let data = that.data.commentList[a][b].data[c];
    let param = {
      id: data.id,
      type: data.type,
    };

    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.deleteUserLikeRecord,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            pageIndex: 1,
          })
          that.getUserLikeRecordList();
        }
      }
    }
    app.request.wxRequest(obj);

  },
  getPostNewDate:function(){
    let that = this;
    that.setData({
      pageIndex:1,
      refresher:true,
    })
    that.getUserLikeRecordList();
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