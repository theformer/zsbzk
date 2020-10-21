// packageA/pages/login_auth/base_info_auth.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindGetUserInfo(d){
    var _this = this;
      if (d.detail.userInfo) {
        //用户按了允许授权按钮
        app.request.getUserInforForButton({
          url: app.base.getUserInfor,
          data: {
            encryptedData: d.detail.encryptedData,
            iv: d.detail.iv
          },
          success: function (res) {
            //xkw后台解析用户信息正确
            if (res.statusCode == '200') {
              wx.setStorageSync(app.base.GetUserInforState, false);
              let userInfo = wx.getStorageSync(app.base.UserInfor);
              if (userInfo.account != undefined) {
                wx.navigateBack({
                  delta: 1,
                })
              } else {
                wx.navigateTo({
                  url: '/pages/login_auth/phone_auth',
                })
              }
            } else {
              wx.showToast({
                title: '请求授权失败',
                icon: 'none',
                duration: 3000,
              });
            }
          }
        })
      } else {
        //用户拒绝了授权
        wx.showToast({
          title: '拒绝授权',
          icon: 'none',
          duration: 3000,
        });
      }
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