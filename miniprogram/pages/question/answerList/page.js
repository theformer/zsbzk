// miniprogram/pages/question/answerList/page.js
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
    const eventChannel = that.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(res) {
      that.setData({
        answerList:res.answerList,
        questionTypes:res.questionTypes,
      })
    })
  },
  /**
   * 
   * 跳转指定题目 
   */
  to_question(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.emit('questionChange', {index: index});
    wx.navigateBack();
  },
  changeSubmit(e){
    let that = this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.emit('paperSubmit', {});
    wx.navigateBack();
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