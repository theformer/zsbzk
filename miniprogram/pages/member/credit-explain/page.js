const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    current:0,
    creditRecord:[],
    exchangeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let userinfo = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userinfo)) {
      that.getUserCreditRecord();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserCreditRecord:function(){
    const that = this;
    let obj = {
      url: app.base.getUserCreditRecord,
      data: {
        userId: wx.getStorageSync(app.base.UserInfor).id,
      },
      success: (res) => {
        if (res.S == 1) {
          let list = res.V;
          let exchangeList = [];
          let newlist = list.filter(v=>{
            if (v.credit < 0 ){
              exchangeList.push(v);
            }
            return v.credit > 0
          })
          let creditRecord = app.utils.ArrbyDate(newlist, "createTime");
          exchangeList = app.utils.ArrbyDate(exchangeList, "createTime");
          that.setData({
            creditRecord: creditRecord,
            exchangeList: exchangeList,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  onchange: function (e) {
    const that = this;
    that.setData({
      tabIndex: e.currentTarget.dataset.id,
      current: e.currentTarget.dataset.id,
    })
  },
  swiperChange: function (e) {
    const that = this;
    that.setData({
      tabIndex: e.detail.current
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