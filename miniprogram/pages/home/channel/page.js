// pages/home/channel/page.js
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
    const that= this;
    let typeList = wx.getStorageSync('typeList');
    that.setData({
      typeList: typeList,
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
  typeClose:function(e){
    const that = this;
    let i = 0;
    that.data.typeList.forEach(item=>{
      if(item.disabled==0){
        i++;
      }
    })
    if(i>1){
      that.setData({
        ["typeList[" + e.currentTarget.dataset.index + "].disabled"]: 1
      })
    }else{
      wx.showToast({
        title: '最少选择一个频道',
        icon:'none',
        duration:2000,
      })
    }
    
  },
  typeAdd:function(e){
    this.setData({
      ["typeList[" + e.currentTarget.dataset.index + "].disabled"]: 0
    })
  },
  saveFun:function(e){
    const that =this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.emit('updateType', { data: that.data.typeList});
    wx.setStorageSync('typeList', that.data.typeList);
    wx.navigateBack();
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