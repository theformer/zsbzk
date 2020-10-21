// miniprogram/pages/home/wechat/page.js
const app = getApp();
const wechats = require('/wechat.js');
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
    let that = this;
    let default_url ='https://mp.weixin.qq.com/s/-OeyY6lgStx-0pt8QU2idQ';
    let province = wx.getStorageSync("province");
    var provinceId;
    if(options.provinceId != undefined){
      provinceId = options.provinceId
    }else{
      provinceId = province.id;
    }
    if(options.type<3){
      for(let wechat of wechats ){
        if(wechat.id == provinceId){
          default_url = wechat.url[options.type]
          break;
        }
      }
    }else{
      default_url = "https://mp.weixin.qq.com/s/H4D7vsFCJIv_EoX2CBwi6g";
    }
    that.setData({
      default_url:default_url,
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
  onShareAppMessage: function () {

  }
})