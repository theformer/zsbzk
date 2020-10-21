// packageA/pages/login_auth/phone_auth.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
     * 获取用户手机号码
     */
    bindGetPhoneNumber: function(e) {
      var _this = this;
      if (e.detail.encryptedData) {
        app.request.getUserPhoneNumber({
          url: app.base.getPhoneNumber,
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          },
          success: function(res) {
            var userInfor = wx.getStorageSync(app.base.UserInfor);
            if (userInfor != undefined && userInfor.account != undefined) {
              //获取手机号成功,并返回用户信息
              // _this.setData({
              //   modelShow: false,
              //   isAuthor: true,
              // })
              // _this.triggerEvent('flagEvent', { parameter: this.data.parameter});
              // _this.triggerEvent('openEvent', {userAuth:false});
              wx.navigateBack({
                delta: 2,
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000,
              });
            }
          },
          fail: function() {
            wx.showToast({
              title: '手机号码授权失败',
              icon: 'none',
              duration: 2000,
            });
          },
          complete :function(){
            
          }
        })
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