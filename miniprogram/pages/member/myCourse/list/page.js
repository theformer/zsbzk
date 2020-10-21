// miniprogram/pages/member/myCourse/list/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"http://img.360xkw.com/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserCourse();
  },
  getUserCourse(){
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    let obj = {
      url: app.base.getUserCourse,
      data: {
        userId: userInfor.id
      },
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          that.setData({
            list : res.V
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
  to_study(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/member/myCourse/item/page?itemId=' + item.itemId,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('courseDataFromOpenerPage', {
          item : item,
        })
      }
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