// miniprogram/pages/question/mode/page.js
const app =getApp();
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
        data:res.data,
      })
    })
    eventChannel.on('reportDataFromOpenerPage', function(res) {
      that.setData({
        report:res.data,
      })
      that.getRedoQuestionIdTypes();
    })
  },
  to_subject(e){
    let that = this;
    wx.navigateTo({
      url: '/pages/question/subject/page?paperType='+ e.currentTarget.dataset.type,
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.data})
      }
    })
  },
  getRedoQuestionIdTypes(){
    let that = this;
    let subcourse = wx.getStorageSync('subCourse');
    let obj = {
      url: app.base.getRedoQuestionIdTypes,
      data: {
        didRecordId: that.data.report.didRecordId,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            data:res.V,
          })
        }
      }
    }
    app.request.wxRequest(obj);
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