// pages/member/feedback/feedback.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindFormSubmit: function (e) {
    const that = this;
    const userInfo = wx.getStorageSync(app.base.UserInfor);
    let errorContent = e.detail.value.errorContent || '';
    if (errorContent.trim().length > 0) {
      let obj = {
        url: app.base.recoveryQuestion,
        data: {
          courseId:app.base.courseId,
          userId: userInfo.id,
          errorContent: errorContent,
          errorType: 2,
          type:4,
        },
        success: (res) => {
          if (res.S == 1) {
            wx.showToast({
              icon: 'none',
              title: res.msg,
              success: (res) => {
                setTimeout(function () {
                  wx.navigateBack();
                }, 1500)
              }
            })
          }
        }
      }
      app.request.wxRequest(obj);
    } else {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none',
        duration:3000,
      })
    }
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
  onShareAppMessage: function () {

  }
})