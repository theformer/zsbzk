// miniprogram/pages/question/collection/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PaperTypeId:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.PaperTypeId != undefined){
      this.setData({
        PaperTypeId: options.PaperTypeId 
      })
    }
    if (options.PaperTypeId == 1) {//模拟练习
      wx.setNavigationBarTitle({
        title: '模拟练习',
      })
    } else if (options.PaperTypeId == 4) {//历年真题
      wx.setNavigationBarTitle({
        title: '历年真题',
      })
    }
    this.getPaperQuestionIdTypesFor();
  },

  getPaperQuestionIdTypesFor:function(){
    let that = this;
    let subcourse = wx.getStorageSync('subCourse');
    let obj = {
      url: app.base.getPaperQuestionIdTypesFor,
      data: {
        subcourseId: subcourse.subCourseId,
        PaperTypeId:that.data.PaperTypeId,
      },
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          that.setData({
            ['list']: res.V.papers,
          })
        } else {
          that.setData({
            ['list']: [],
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+e.currentTarget.dataset.type,
    })
  },
  to_mode(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/question/mode/page',
      success : function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      },
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