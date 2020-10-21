// pages/community/label-module/page.js
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
    console.log(options);
    that.eventChannel = that.getOpenerEventChannel();
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test1' });
    // eventChannel.emit('someEvent', { data: 'test2' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    that.eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('acceptDataFromOpenerPage',data)
      that.setData({
        modules: data.modules,
        moduleIndex: data.moduleIndex,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  moduleSelect:function(e){
    let that = this;
    // that.setData({
    //   ["modules[" + e.currentTarget.dataset.index +"].disabled"]: 1
    // })
    
    that.setData({
      moduleIndex: e.currentTarget.dataset.index
    })
  },
  moduleDelete:function(e){
    let that = this;
    // that.setData({
    //   ["modules[" + e.currentTarget.dataset.index + "].disabled"]: 0
    // })
    that.setData({
      moduleIndex : -1
    })
  },
  saveLabel:function(){
    let that = this;
    wx.navigateBack({
      success:function(res){
        that.eventChannel.emit('eventCallback', that.data.moduleIndex);
      }
    })
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